/*
 * app.js - UI wiring: inputs, results, tabs and the Sources tab.
 * Depends on data.js and calc.js (loaded first).
 */
(function () {
  "use strict";

  var data = window.VO.data;
  var calc = window.VO.calc;
  var SCENARIOS = calc.SCENARIOS;
  var KINDS = calc.KINDS;

  /* ------------------------------ State ------------------------------ */

  var state = {
    currentId: "medium_meat",
    targetId: "reduce", /* same | reduce | a diet id */
    reducePct: 50,
    usageId: "moderate", /* a usage level id, or "custom" */
    standard: 20,
    reasoning: 2,
    images: 1,
    estimate: "central", /* low | central | high */
    waterBasis: "blue" /* blue | total */
  };

  var TARGET_OPTIONS = [
    { id: "same", label: "No change", detail: "Keep eating as you do now" },
    { id: "reduce", label: "Eat less meat", detail: "Cut some meat and fish, by an amount you choose" }
  ].concat(["pescatarian", data.meatFreeDietId, data.veganDietId].map(function (id) {
    var d = calc.findDiet(id);
    return { id: d.id, label: d.label, detail: d.detail };
  }));

  var ESTIMATE_OPTIONS = [
    { id: "low", label: "Lower" },
    { id: "central", label: "Central" },
    { id: "high", label: "Higher" }
  ];

  var WATER_OPTIONS = [
    { id: "blue", label: "Blue", note: "Blue water: irrigation, rivers and groundwater for food; cooling water and water used to generate the electricity for AI." },
    { id: "total", label: "Total", note: "Total water adds rainwater used by crops and pasture. AI has no equivalent, so water is shown for the diet alone and not compared." }
  ];

  var SLIDER_TEXT = {
    standard: "chat prompts a day",
    reasoning: "thinking or agent prompts a day",
    images: "images a day"
  };

  var $ = function (id) { return document.getElementById(id); };

  /* ------------------------------ Formatting ------------------------------ */

  function sig(x, digits) {
    if (!isFinite(x)) return "-";
    if (x === 0) return "0";
    var max = digits || 3;
    return Number(x).toLocaleString("en-GB", {
      maximumSignificantDigits: max,
      minimumSignificantDigits: Math.min(2, max)
    });
  }

  /* Update the URL hash without adding history entries (ignored where blocked). */
  function setHash(name) {
    try { history.replaceState(null, "", "#" + name); } catch (e) { /* not essential */ }
  }

  function fmtCarbon(kg) {
    var a = Math.abs(kg);
    if (a === 0) return "0 g";
    if (a < 1) return sig(kg * 1000) + " g";
    if (a < 1000) return sig(kg) + " kg";
    return sig(kg / 1000) + " t";
  }

  function fmtWater(l) {
    var a = Math.abs(l);
    if (a === 0) return "0 L";
    if (a < 1) return sig(l * 1000) + " mL";
    if (a < 1000) return sig(l) + " L";
    return sig(l / 1000) + " m\u00B3";
  }

  function unitCount(n, one, many) {
    var r = n < 10 ? n.toFixed(1).replace(/\.0$/, "") : String(Math.round(n));
    return r + " " + (r === "1" ? one : many);
  }

  /* A span of time given in days: "5 hours", "12 days", "3.5 months", "2.1 years". */
  function fmtSpan(d) {
    if (d == null) return "-";
    if (d < 1) {
      var h = d * 24;
      return h < 1 ? "under an hour" : unitCount(Math.round(h), "hour", "hours");
    }
    if (d < 31) return unitCount(d, "day", "days");
    if (d < calc.DAYS) return unitCount(d / calc.MONTH, "month", "months");
    var y = d / calc.DAYS;
    return (y < 10 ? unitCount(y, "year", "years") : sig(y, 2) + " years");
  }

  /* For running text: "about 5.6 days" or "under an hour". */
  function spanPhrase(d) {
    return d * 24 < 1 ? "under an hour" : "about " + fmtSpan(d);
  }

  function fmtPct(p) {
    if (p < 0.1) return "under 0.1%";
    if (p < 10) return p.toFixed(1) + "%";
    return Math.round(p) + "%";
  }

  /* ------------------------------ Inputs ------------------------------ */

  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

  /* e.g. "20 chats, 2 thinking, 1 image a day" */
  function mixText(u) {
    var parts = [plural(u.standard, "chat", "chats")];
    if (u.reasoning) parts.push(u.reasoning + " thinking");
    if (u.images) parts.push(plural(u.images, "image", "images"));
    return parts.join(", ") + " a day";
  }

  function matchingLevel() {
    return data.usageLevels.filter(function (u) {
      return u.standard === state.standard && u.reasoning === state.reasoning && u.images === state.images;
    })[0];
  }

  function optHTML(name, item, checked, describedBy) {
    return (
      '<label class="opt"><input type="radio" name="' + name + '" value="' + item.id + '"' + (checked ? " checked" : "") +
      (describedBy ? ' aria-describedby="' + describedBy + '"' : "") + ">" +
      '<span class="opt-mark" aria-hidden="true"></span>' +
      '<span class="opt-text"><span class="opt-title">' + item.label + "</span>" +
      (item.meta ? '<span class="opt-meta">' + item.meta + "</span>" : "") +
      "</span></label>"
    );
  }

  function segmentedHTML(name, options, selected) {
    return options.map(function (o) {
      return (
        '<label class="seg"><input type="radio" name="' + name + '" value="' + o.id + '"' +
        (o.id === selected ? " checked" : "") + "><span>" + o.label + "</span></label>"
      );
    }).join("");
  }

  function renderChoices() {
    $("current-choices").innerHTML = data.diets
      .map(function (d) { return optHTML("current", d, d.id === state.currentId, "current-hint"); })
      .join("");

    $("target-choices").innerHTML = TARGET_OPTIONS
      .map(function (t) { return optHTML("target", t, t.id === state.targetId); })
      .join("");

    $("usage-choices").innerHTML = data.usageLevels
      .map(function (u) { return optHTML("usage", { id: u.id, label: u.label, meta: mixText(u) }, u.id === state.usageId); })
      .join("") +
      optHTML("usage", { id: "custom", label: "Custom", meta: "Your own mix, set with the sliders" }, state.usageId === "custom");

    $("estimate-control").innerHTML = segmentedHTML("estimate", ESTIMATE_OPTIONS, state.estimate);
    $("water-control").innerHTML = segmentedHTML("water", WATER_OPTIONS, state.waterBasis);
  }

  function setFill(input) {
    var min = Number(input.min), max = Number(input.max), val = Number(input.value);
    input.style.setProperty("--fill", ((val - min) / (max - min)) * 100 + "%");
  }

  function bindInputs() {
    document.addEventListener("change", function (e) {
      var t = e.target;
      if (!(t instanceof HTMLInputElement) || t.type !== "radio") return;

      if (t.name === "current") state.currentId = t.value;
      else if (t.name === "target") state.targetId = t.value;
      else if (t.name === "usage") {
        state.usageId = t.value;
        if (t.value !== "custom") {
          var level = data.usageLevels.filter(function (u) { return u.id === t.value; })[0];
          KINDS.forEach(function (k) { state[k] = level[k]; });
        }
      } else if (t.name === "estimate") state.estimate = t.value;
      else if (t.name === "water") state.waterBasis = t.value;
      else return;

      syncControls();
      render(true);
    });

    $("reduce-slider").addEventListener("input", function (e) {
      state.reducePct = Number(e.target.value);
      syncControls();
      render(true);
    });

    KINDS.forEach(function (k) {
      $(k + "-slider").addEventListener("input", function (e) {
        state[k] = Number(e.target.value);
        /* Once the user has chosen Custom, keep it even if the sliders land on a preset. */
        if (state.usageId !== "custom") {
          var match = matchingLevel();
          state.usageId = match ? match.id : "custom";
        }
        syncControls();
        render(true);
      });
    });
  }

  /* Reflect state back into slider labels and radio selection. */
  function syncControls() {
    var reduce = $("reduce-slider");
    reduce.value = state.reducePct;
    reduce.setAttribute("aria-valuetext", state.reducePct + " percent");
    $("reduce-output").textContent = state.reducePct + "%";
    setFill(reduce);

    KINDS.forEach(function (k) {
      var s = $(k + "-slider");
      s.value = state[k];
      s.setAttribute("aria-valuetext", state[k] + " " + SLIDER_TEXT[k]);
      $(k + "-output").textContent = state[k];
      setFill(s);
    });

    $("reduce-panel").hidden = state.targetId !== "reduce";
    $("current-hint").textContent = calc.findDiet(state.currentId).detail;

    var usageRadios = document.querySelectorAll('input[name="usage"]');
    Array.prototype.forEach.call(usageRadios, function (r) { r.checked = r.value === state.usageId; });

    var water = WATER_OPTIONS.filter(function (o) { return o.id === state.waterBasis; })[0];
    $("control-note").textContent = data.aiScenarios[state.estimate].label + ": " +
      data.aiScenarios[state.estimate].summary.charAt(0).toLowerCase() + data.aiScenarios[state.estimate].summary.slice(1) +
      ". " + water.note;
  }

  function currentTarget() {
    if (state.targetId === "same") return { mode: "same" };
    if (state.targetId === "reduce") return { mode: "reduce", reducePct: state.reducePct };
    return { mode: "diet", dietId: state.targetId };
  }

  /* ------------------------------ Steps ------------------------------ */

  var STEP_NEXT = { 1: "Next: what might you change to?", 2: "Next: how much do you use AI?", 3: "See your result" };
  var step = 1;

  function showStep(n, focus) {
    step = n;
    [1, 2, 3].forEach(function (i) { $("step-" + i).hidden = i !== n; });
    $("step-back").hidden = n === 1;
    $("step-next").textContent = STEP_NEXT[n];
    if (focus) $("step-" + n).querySelector("legend").focus();
  }

  function bindSteps() {
    $("step-next").addEventListener("click", function () {
      if (step < 3) {
        showStep(step + 1, true);
        render();
        return;
      }
      $("results").scrollIntoView({ block: "start" });
      $("results").focus({ preventScroll: true });
    });
    $("step-back").addEventListener("click", function () { showStep(step - 1, true); render(); });
  }

  /* ------------------------------ Symbols ------------------------------ */

  /* Fixed units: a symbol always means the same amount, whatever the inputs. */
  var KG_PER_SYMBOL = 5;
  var LITRES_PER_DROP = 100;

  /* Past `cap` symbols, shrink the row's symbols (by area) so the block keeps roughly the same size. */
  function fit(el, count, cap, min) {
    var k = count > cap ? Math.max(Math.sqrt(cap / count), min) : 1;
    el.style.setProperty("--k", k.toFixed(3));
  }

  /* n symbols, to a tenth; a trailing fraction is a cut symbol. Anything above zero shows at least a tenth. */
  function symbolCounts(n) {
    var tenths = n > 0 ? Math.max(1, Math.round(n * 10)) : 0;
    return { full: Math.floor(tenths / 10), frac: (tenths % 10) / 10 };
  }

  /* A cut symbol over a faint whole one, so a small fraction still reads as part of a symbol. */
  function partHTML(cls, frac, animate) {
    return '<span class="pg-part' + (animate ? " in" : "") + '" style="--d:500ms">' +
      '<i class="pg pg-ghost' + cls + '"></i><i class="pg' + cls + '" style="--f:' + frac + '"></i></span>';
  }

  /*
   * Redraw a symbol row. Symbols added since the last draw grow in, spread over half a second.
   * With ghostTo, faint symbols fill the row out to that count, showing what was taken away.
   */
  function drawSymbols(el, n, ghostTo) {
    var c = symbolCounts(n);
    var prev = Number(el.getAttribute("data-full") || 0);
    var fresh = Math.max(c.full - prev, 1);
    var html = "";
    for (var i = 0; i < c.full; i++) {
      html += i >= prev
        ? '<i class="pg in" style="--d:' + Math.round(((i - prev) / fresh) * 500) + 'ms"></i>'
        : '<i class="pg"></i>';
    }
    if (c.frac > 0) html += partHTML("", c.frac, c.full >= prev);
    if (ghostTo > n) {
      var g = symbolCounts(ghostTo);
      var slots = g.full + (g.frac > 0 ? 1 : 0);
      for (var j = c.full + (c.frac > 0 ? 1 : 0); j < slots; j++) {
        var f = j === g.full ? g.frac : 1;
        html += '<i class="pg pg-ghost"' + (f < 1 ? ' style="--f:' + f + '"' : "") + "></i>";
      }
    }
    el.innerHTML = html;
    el.setAttribute("data-full", c.full);
  }

  function emptyNote(el, text) {
    el.innerHTML = '<p class="empty-note">' + text + "</p>";
    el.setAttribute("data-full", 0);
  }

  /* Why there is no diet saving to draw, when there is none. */
  function noSavingText(out) {
    var n = out.notes;
    if (step === 1) return "Choose a change in step 2 to see what it would save.";
    if (n.increases) return "This change would add to your food footprint, so there is nothing to set against your AI use. Try a different change in step 2.";
    if (n.alreadyLowest) return "You already eat a vegan diet, the lowest footprint here, so there is no further saving to draw.";
    if (n.alreadyMeatFree) return "You already eat no meat or fish, so eating less of them changes nothing. Choose vegan in step 2.";
    if (n.zeroReduce) return "Move the slider in step 2 above 0% to see what eating less meat would save.";
    return "Choose a change in step 2 to see what it would save.";
  }

  /* What the "after" row shows, named in full so it reads without step 2 open. */
  function targetName(out) {
    var cur = calc.findDiet(state.currentId).label;
    if (state.targetId === "same" || out.notes.alreadyMeatFree) return cur + ", unchanged";
    if (state.targetId === "reduce") return cur + " with " + state.reducePct + "% less meat and fish";
    return calc.findDiet(state.targetId).label;
  }

  function afterNote(out) {
    var s = out.diet.saving.carbon;
    if (out.notes.increases) return fmtCarbon(-s) + " more than before.";
    if (s > 1e-9) return fmtCarbon(s) + " less than before. The faint symbols are the saving.";
    return step === 1 ? "Choose a change in step 2." : "No saving.";
  }

  function renderCarbon(out) {
    var c = out.metrics.carbon;
    var ai = c.variants.withTraining.ai[state.estimate];
    var saving = c.saving;

    var aiRow = $("ai-carbon");
    fit(aiRow, ai / KG_PER_SYMBOL, 6, 0.25);
    if (ai > 0) drawSymbols(aiRow, ai / KG_PER_SYMBOL);
    else emptyNote(aiRow, "No AI use entered. Set your day in step 3.");

    var before = out.diet.current.carbon / KG_PER_SYMBOL;
    var after = out.diet.target.carbon / KG_PER_SYMBOL;
    /* Both diet rows share one symbol size so they stay comparable. */
    var most = Math.max(before, after);
    fit($("diet-before"), most, 200, 0.4);
    fit($("diet-after"), most, 200, 0.4);
    drawSymbols($("diet-before"), before);
    drawSymbols($("diet-after"), after, before);

    $("before-cap").innerHTML = '<span class="cap-tag cap-before">Before</span>' + calc.findDiet(state.currentId).label +
      ': <strong class="cap-before">' + fmtCarbon(out.diet.current.carbon) + " CO\u2082e</strong> a year";
    $("after-cap").innerHTML = '<span class="cap-tag cap-after">After</span>' + targetName(out) +
      ': <strong class="cap-after">' + fmtCarbon(out.diet.target.carbon) + " CO\u2082e</strong> a year. " +
      '<span class="cap-note">' + afterNote(out) + "</span>";

    $("carbon-key").innerHTML = "Each symbol = " + KG_PER_SYMBOL + " kg CO<sub>2</sub>e";
    $("ai-carbon-desc").textContent = ": " + fmtCarbon(ai) + " CO\u2082e, counting training.";
    $("steps-tally").innerHTML = saving > 0
      ? "Your diet change saves <strong>" + fmtCarbon(saving) + " CO\u2082e</strong> a year. Your AI use: <strong>" + fmtCarbon(ai) + "</strong>."
      : "Your AI use: <strong>" + fmtCarbon(ai) + " CO\u2082e</strong> a year.";
  }

  var DIET_CAP = '<span class="cap-label">Saved by the change from before to after</span>';
  var AI_CAP = '<span class="cap-label">Your AI use</span>';

  function renderWater(out) {
    var w = out.metrics.water;
    var total = state.waterBasis === "total";
    var ai = w.variants.withTraining.ai[state.estimate];
    var saving = w.saving;
    var unit = LITRES_PER_DROP;
    var kind = total ? "water, rainwater included" : "blue water";
    /* Both water rows share one symbol size so they stay comparable. */
    var most = Math.max(saving, w.comparable ? ai : 0) / unit;
    fit($("water-diet"), most, 36, 0.3);
    fit($("water-ai"), most, 36, 0.3);

    if (saving > 0) {
      drawSymbols($("water-diet"), saving / unit);
      $("water-diet-cap").innerHTML = DIET_CAP + '<strong class="cap-water">' + fmtWater(saving) + "</strong> of " + kind + " saved a year";
    } else {
      emptyNote($("water-diet"), noSavingText(out));
      $("water-diet-cap").innerHTML = DIET_CAP + "No water saved by this change";
    }

    if (!w.comparable) {
      emptyNote($("water-ai"), "Not compared: total water includes rainwater, which has no AI equivalent. Choose Blue under the result to compare.");
      $("water-ai-cap").innerHTML = AI_CAP + "<strong>" + fmtWater(ai) + "</strong> of water a year";
    } else if (ai > 0) {
      drawSymbols($("water-ai"), ai / unit);
      $("water-ai-cap").innerHTML = AI_CAP + '<strong class="cap-ai">' + fmtWater(ai) + "</strong> of water a year, counting training";
    } else {
      emptyNote($("water-ai"), "No AI use entered.");
      $("water-ai-cap").innerHTML = AI_CAP + "No AI use entered";
    }
    $("water-key").textContent = "Each drop = " + fmtWater(unit) + " of " + kind;
  }

  /* ------------------------------ Result ------------------------------ */

  var VARIANT_LABEL = { inference: "without training", withTraining: "including training" };
  var KIND_LABEL = { standard: "everyday chats", reasoning: "thinking and agent prompts", images: "images" };

  function equivalent(metric, amount) {
    var e = data.equivalents;
    if (metric === "carbon") {
      var km = amount / e.kgCO2ePerKmCar;
      return km < 0.1 ? "under 100 m of driving" : "about " + sig(km, 2) + " km of driving";
    }
    var showers = amount / e.litresPerShower;
    return showers < 0.1 ? "under a tenth of a shower" : "about " + sig(showers, 2) + " " + (sig(showers, 2) === "1" ? "shower" : "showers");
  }

  /* Share of the AI footprint (including training) by kind of request. */
  function breakdownText(metric, out) {
    var by = out.ai[state.estimate].byType;
    var total = 0;
    KINDS.forEach(function (k) { total += by[k].withTraining[metric]; });
    if (total <= 0) return "";
    return KINDS
      .map(function (k) { return { k: k, share: (by[k].withTraining[metric] / total) * 100 }; })
      .filter(function (p) { return p.share > 0; })
      .sort(function (a, b) { return b.share - a.share; })
      .map(function (p) { return KIND_LABEL[p.k] + " " + (p.share < 1 ? "under 1%" : Math.round(p.share) + "%"); })
      .join(", ");
  }

  function totalRequests() { return state.standard + state.reasoning + state.images; }

  function aiUseText(out) {
    var cUse = out.metrics.carbon.variants.withTraining.ai[state.estimate];
    var wUse = out.metrics.water.variants.withTraining.ai[state.estimate];
    return "Your AI use comes to about " + fmtCarbon(cUse) + " CO\u2082e and " + fmtWater(wUse) + " of water a year.";
  }

  /* The result as a heading and a supporting line. */
  function statement(out) {
    var c = out.metrics.carbon, w = out.metrics.water;
    var n = out.notes;
    var hasUse = totalRequests() > 0;

    if (n.increases || n.alreadyLowest || n.alreadyMeatFree || n.zeroReduce || n.noChange) {
      if (step === 1 && hasUse) return { main: aiUseText(out), sub: noSavingText(out) };
      return { main: noSavingText(out), sub: hasUse ? aiUseText(out) : "" };
    }
    if (!hasUse) {
      return {
        main: "Your diet change would save about <span class=\"diet\">" + fmtCarbon(c.saving) + " CO\u2082e</span> and " +
          fmtWater(w.saving) + " of water a year.",
        sub: "Add some AI use in step 3 to see how much of it this makes up for."
      };
    }
    var cSpan = c.variants.withTraining.monthCovers[state.estimate];
    var wSpan = w.variants.withTraining.monthCovers[state.estimate];
    return {
      main: "<span class=\"diet\">1 month of your diet change</span> makes up for <span class=\"ai\">" + fmtSpan(cSpan) + "</span> of your AI use.",
      sub: "That is the carbon, counting training" +
        (wSpan != null ? ". For water, 1 month makes up for " + spanPhrase(wSpan) + "." : ". Total water includes rainwater, so it is not compared with AI.") +
        " " + aiUseText(out)
    };
  }

  /* One month of the diet saving, in the wall's clouds, against the years of AI use it covers. */
  function renderMonth(out) {
    var c = out.metrics.carbon;
    var span = c.variants.withTraining.monthCovers[state.estimate];
    var chart = $("month-chart");
    chart.hidden = !(c.saving > 0 && totalRequests() > 0 && span != null);
    if (chart.hidden) return;

    var years = span / calc.DAYS;
    var clouds = c.saving / 12 / KG_PER_SYMBOL;
    fit($("month-diet"), clouds, 60, 0.45);
    fit($("month-ai"), years, 18, 0.3);
    drawSymbols($("month-diet"), clouds);
    drawSymbols($("month-ai"), years);
    $("month-key").innerHTML = "Each cloud = " + KG_PER_SYMBOL + " kg CO<sub>2</sub>e saved. Each bubble = a year of your AI use.";
  }

  function rangeText(fmt, lo, hi) {
    var a = fmt(lo), b = fmt(hi);
    return a === b ? "" : '<span class="range">' + a + " to " + b + "</span>";
  }

  function cellAI(M, metric, variant) {
    var m = METRICS[metric];
    var row = M.variants[variant];
    var use = row.ai[state.estimate];
    return '<strong class="ai">' + m.fmt(use) + "</strong>" + (use > 0 ? rangeText(m.fmt, row.ai.low, row.ai.high) : "");
  }

  function cellCover(M, variant) {
    var row = M.variants[variant];
    var use = row.ai[state.estimate];
    if (use <= 0) return '<span class="muted">No AI use entered</span>';
    if (!M.comparable) return '<span class="muted">Not compared: rainwater has no AI equivalent</span>';
    if (M.saving <= 0) return '<span class="muted">No diet saving to compare against</span>';
    var html = "<strong>" + fmtSpan(row.monthCovers[state.estimate]) + "</strong>";
    if (row.monthRange) html += rangeText(fmtSpan, row.monthRange.low, row.monthRange.high);
    return html;
  }

  var METRICS = {
    carbon: { title: "Carbon", unit: "CO\u2082e a year", fmt: fmtCarbon },
    water: { title: "Water", unit: "litres a year", fmt: fmtWater }
  };

  function tableHTML(out) {
    var C = out.metrics.carbon, W = out.metrics.water;
    function saving(M, metric) {
      var m = METRICS[metric];
      if (M.saving < 0) return '<strong>+' + m.fmt(-M.saving) + "</strong><span class=\"range\">added by this change</span>";
      var html = '<strong class="diet">' + m.fmt(M.saving) + "</strong>";
      if (metric === "water" && M.saving > 0) html += rangeText(fmtWater, M.savingRange.low, M.savingRange.high);
      return html;
    }
    function everyday(M, metric) {
      var use = M.variants.withTraining.ai[state.estimate];
      var parts = [];
      if (use > 0) parts.push("Your AI use: " + equivalent(metric, use));
      if (M.saving > 0) parts.push("your diet saving: " + equivalent(metric, M.saving));
      return parts.join("; ") || '<span class="muted">-</span>';
    }
    var rows = [
      ["Saved a year by your diet change", saving(C, "carbon"), saving(W, "water")],
      ["Your AI use a year, " + VARIANT_LABEL.inference, cellAI(C, "carbon", "inference"), cellAI(W, "water", "inference")],
      ["Your AI use a year, " + VARIANT_LABEL.withTraining, cellAI(C, "carbon", "withTraining"), cellAI(W, "water", "withTraining")],
      ["1 month of your diet change makes up for, " + VARIANT_LABEL.inference, cellCover(C, "inference"), cellCover(W, "inference")],
      ["1 month of your diet change makes up for, " + VARIANT_LABEL.withTraining, cellCover(C, "withTraining"), cellCover(W, "withTraining")],
      ["In everyday terms", everyday(C, "carbon"), everyday(W, "water")],
      ["Where AI's footprint comes from", breakdownText("carbon", out) || "-", breakdownText("water", out) || "-"]
    ];
    var waterHead = "Water" + (state.waterBasis === "total" ? ", blue and rainwater" : ", blue") +
      '<span class="tag">modelled, lower confidence</span>';
    return '<div class="rt-wrap"><table class="rt"><thead><tr><th scope="col"><span class="sr-only">Measure</span></th>' +
      '<th scope="col">Carbon, CO\u2082e</th><th scope="col">' + waterHead + "</th></tr></thead><tbody>" +
      rows.map(function (r) {
        return '<tr><th scope="row">' + r[0] + "</th><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  }

  function updateNotes(out) {
    var note = $("target-note");
    var hint = $("reduce-hint");
    var n = out.notes;
    var msg = "";

    if (n.increases) {
      msg = "This target has a higher footprint than your current diet, so it adds to the total rather than saving anything.";
    } else if (n.alreadyLowest && state.targetId !== "same") {
      msg = "You already eat a vegan diet, the lowest-footprint option here, so no target would lower it.";
    } else if (n.alreadyMeatFree) {
      msg = "You already eat no meat or fish, so this option has no effect. Pick vegan to go further.";
    }
    note.textContent = msg;
    note.hidden = !msg;

    var cur = calc.findDiet(state.currentId);
    var cut = cur.id === "pescatarian" ? "fish comes out, and dairy and eggs stay." : "meat and fish come out first, and dairy and eggs stay.";
    hint.textContent = n.alreadyMeatFree ? "" :
      state.reducePct + "% of the way from \u201C" + cur.label.toLowerCase() + "\u201D to vegetarian: " + cut;
    hint.hidden = !hint.textContent;
  }

  /* ------------------------------ Animal lives ------------------------------ */

  var EPS = 0.005;

  /* Whole animals where it reads naturally: "230", "21", "1.2", "under 1". */
  function fmtCount(n) {
    var a = Math.abs(n);
    if (a < EPS) return "0";
    if (a < 1) return "under 1";
    if (a < 10) return a.toFixed(1).replace(/\.0$/, "");
    if (a < 100) return String(Math.round(a));
    return sig(a, 2);
  }

  function animalWord(n) { return fmtCount(n) === "1" ? "animal" : "animals"; }

  function targetPhrase() {
    if (state.targetId === "reduce") return "cutting " + state.reducePct + "% of your meat and fish";
    return "a " + calc.findDiet(state.targetId).label.toLowerCase() + " diet";
  }

  function livesHeadline(out) {
    var A = out.animals;
    var t = A.spared.total.central;
    if (A.current.total.central < EPS) return "None counted on a vegan diet";
    if (t > EPS) return "About " + fmtCount(t) + " spared a year";
    if (t < -EPS) return "About " + fmtCount(t) + " more a year";
    return "About " + fmtCount(A.current.total.central) + " a year on your current diet";
  }

  function livesLead(out) {
    var A = out.animals, n = out.notes;
    var cur = calc.findDiet(state.currentId).label.toLowerCase();
    var t = A.spared.total;
    var now = A.current.total.central;

    if (now < EPS) {
      return "On a vegan diet, no animals in this count are killed for your food.";
    }
    if (n.alreadyMeatFree || n.zeroReduce || state.targetId === "same" || Math.abs(t.central) < EPS) {
      return "Your current diet accounts for about <strong>" + fmtCount(now) + " " + animalWord(now) + " a year</strong>. " +
        (n.alreadyMeatFree
          ? "They all come from eggs and dairy. Choose vegan in step 2 to see them spared."
          : "Choose a change in step 2 to see how many it would spare.");
    }
    if (t.central < 0) {
      var why = A.spared.meat > EPS && A.spared.fish.central < 0
        ? " Fewer land animals are killed, but more fish: pescatarians in the study ate a little more fish than meat-eaters."
        : "";
      return "Moving from " + cur + " to " + targetPhrase() + " would mean about <strong>" + fmtCount(t.central) +
        " more " + animalWord(t.central) + " a year</strong>." + why;
    }
    var range = fmtCount(t.low) === fmtCount(t.high) ? "" :
      ", or between " + fmtCount(t.low) + " and " + fmtCount(t.high) + " depending on the fish estimate";
    return "Moving from " + cur + " to " + targetPhrase() + " would spare about <strong>" + fmtCount(t.central) +
      " " + animalWord(t.central) + " a year</strong>" + range + ".";
  }

  /* Static symbols for a count of animals, always one symbol per animal; large counts get smaller symbols. */
  function animalSymbols(value, kind) {
    var a = Math.abs(value);
    var k = a > 150 ? Math.max(Math.sqrt(150 / a), 0.45) : 1;
    var c = symbolCounts(a);
    var html = "";
    for (var i = 0; i < c.full; i++) html += '<i class="pg pg-' + kind + '"></i>';
    if (c.frac > 0) html += partHTML(" pg-" + kind, c.frac, false);
    return { html: html, k: k.toFixed(3) };
  }

  function livesRowHTML(value, title, detail, kind) {
    var more = value < -EPS;
    var n = Math.abs(value) < 1 ? sig(Math.abs(value), 2) : fmtCount(value);
    var pg = animalSymbols(value, kind);
    return '<li class="lives-row"><div><span class="lives-label">' + title + (more ? " (more)" : "") + "</span>" +
      '<span class="lives-num' + (more ? " more" : "") + '">' + (more ? "+" : "") + n + "</span></div>" +
      '<div class="lives-pg' + (more ? " more" : "") + '" style="--k:' + pg.k + '" aria-hidden="true">' + pg.html + "</div>" +
      '<p class="lives-detail">' + detail + "</p></li>";
  }

  function livesRows(out) {
    var A = out.animals, base = A.baseline;
    var changing = Math.abs(A.spared.total.central) >= EPS;
    var v = changing ? A.spared : A.current;
    function central(x) { return typeof x === "number" ? x : x.central; }
    function shown(key) { return Math.abs(central(v[key])) > EPS; }
    var rows = [];

    if (shown("meat")) {
      var share = base.meat > 0 ? v.meat / base.meat : 0;
      var chickens = base.meatBy.chickens * share;
      var rest = Math.abs(v.meat - chickens);
      rows.push(livesRowHTML(v.meat, "Land animals killed for meat",
        "Almost all chickens: about " + fmtCount(chickens) + ". Pigs, sheep, turkeys, ducks and cattle together come to " +
        (rest < 1 ? "less than one." : "about " + fmtCount(rest) + "."), "hen"));
    }
    if (shown("fish")) {
      var ends = [Math.abs(v.fish.low), Math.abs(v.fish.high)].sort(function (a, b) { return a - b; });
      rows.push(livesRowHTML(v.fish.central, "Fish",
        "Somewhere between " + fmtCount(ends[0]) + " and " + fmtCount(ends[1]) +
        ". These are global averages, and they include fish caught to make feed for farmed fish and livestock. Shellfish are not counted.", "fish"));
    }
    if (shown("eggs")) {
      rows.push(livesRowHTML(v.eggs.central, "Killed for eggs",
        "Male chicks killed on the day they hatch, and hens slaughtered at the end of their laying life.", "chick"));
    }
    if (shown("separatedCalves")) {
      rows.push(livesRowHTML(v.separatedCalves, "Calves taken from their mothers",
        "A dairy cow has about " + data.animals.dairy.lifetimeCalves + " calves before she is slaughtered, usually at around six years old. " +
        "Almost every one is taken from her within a day or two of birth, so her milk can be sold. " +
        "This is not counted in the total killed. Dairy cows and young calves killed for dairy add about " +
        sig(Math.abs(v.dairy), 2) + " a year to that total.", "calf"));
    }
    return rows.length ? '<ul class="lives-rows">' + rows.join("") + "</ul>" : "";
  }

  var LIVES_HOW =
    '<div class="lives-how"><h3>How eggs and dairy cost lives</h3><dl>' +
    "<div><dt>Male chicks</dt><dd>Laying breeds are bred for eggs, not meat. Their male chicks lay no eggs and grow too slowly to be reared for meat, " +
    "so British hatcheries kill them on the day they hatch, with gas or by instant mechanical means. That is about 40 to 45 million chicks a year.</dd></div>" +
    "<div><dt>Laying hens</dt><dd>Hens are slaughtered at the end of their laying life: about 30 million in the UK in 2025.</dd></div>" +
    "<div><dt>Calves</dt><dd>A cow only gives milk after giving birth, so dairy herds produce calves every year: about 1.48 million in Great Britain in 2024. " +
    "A cow has about 3.6 calves in her life, and most are taken from her within 24 hours, almost all within two days. Most calves are reared for beef, and some male calves are killed within weeks of birth: " +
    "about 80,000 male calves under two months old in 2022, not all of them from dairy herds.</dd></div>" +
    "<div><dt>Dairy cows</dt><dd>Dairy cows are slaughtered when their milking life ends. About 620,000 cows and adult bulls were slaughtered in the UK in 2025, from dairy and beef herds together.</dd></div>" +
    "</dl></div>";

  function livesNote(out) {
    var A = out.animals;
    var leftover = A.target.eggs.central + A.target.dairy;
    var meatAndFishGone = A.target.meat < EPS && A.target.fish.central < EPS;
    var hadMeatOrFish = A.current.meat > EPS || A.current.fish.central > EPS;
    if (state.targetId === data.veganDietId) {
      return A.current.total.central > EPS ? '<p class="lives-note">A vegan diet spares the most animals of any option here.</p>' : "";
    }
    if (meatAndFishGone && hadMeatOrFish && leftover > EPS) {
      return '<p class="lives-note">Going vegetarian ends the meat and fish deaths in this count. About ' + fmtCount(leftover) +
        " " + animalWord(leftover) + " a year are still killed for the eggs and dairy, and a vegan diet ends those too.</p>";
    }
    var changing = Math.abs(A.spared.total.central) >= EPS;
    if (changing && leftover > EPS && Math.abs(A.spared.eggs.central + A.spared.dairy) < EPS) {
      return '<p class="lives-note">Eggs and dairy stay the same in this change, so the ' + fmtCount(leftover) + " " + animalWord(leftover) +
        " a year killed for them are not spared. A vegan diet spares those too.</p>";
    }
    return "";
  }

  function livesCTA(out) {
    if (state.targetId === data.veganDietId || out.animals.current.total.central < EPS) return "";
    return '<div class="lives-cta"><button type="button" class="btn" data-try-diet="' + data.veganDietId + '">Try a vegan diet</button>' +
      "<span>Every number on the page updates, including this one.</span></div>";
  }

  function renderLives(out) {
    $("lives-headline").textContent = livesHeadline(out);
    $("lives-body").innerHTML =
      '<p class="lives-lead">' + livesLead(out) + "</p>" +
      livesRows(out) +
      livesNote(out) +
      livesCTA(out) +
      LIVES_HOW +
      '<p class="lives-foot">Land animal, egg and dairy counts are UK estimates from national slaughter records, adjusted for imports. ' +
      "Fish counts are global averages, so they are less certain. The figures and how they were worked out are in the " +
      '<a href="#sources" data-goto="sources">Sources tab</a>.</p>';
  }

  function bindLives() {
    $("lives-body").addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-try-diet]");
      if (!btn) return;
      state.targetId = btn.getAttribute("data-try-diet");
      var radio = document.querySelector('input[name="target"][value="' + state.targetId + '"]');
      if (radio) radio.checked = true;
      syncControls();
      render(true);
      $("lives").querySelector("summary").focus();
    });
  }

  /* ------------------------------ Render ------------------------------ */

  /* Announce the result to screen readers once input settles, not on every slider step. */
  var liveTimer = null;
  function announce() {
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function () {
      $("live-summary").textContent = $("summary").textContent + " " + $("summary-sub").textContent;
    }, 700);
  }

  function render(fromInput) {
    var out = calc.compute({
      currentId: state.currentId,
      target: currentTarget(),
      usage: { standard: state.standard, reasoning: state.reasoning, images: state.images },
      waterBasis: state.waterBasis
    });

    renderCarbon(out);
    renderWater(out);
    var s = statement(out);
    $("summary").innerHTML = s.main;
    $("summary-sub").textContent = s.sub;
    $("summary-sub").hidden = !s.sub;
    renderMonth(out);
    $("result-table").innerHTML = tableHTML(out);
    renderLives(out);
    updateNotes(out);
    if (fromInput) announce();
  }

  /* ------------------------------ Sources tab ------------------------------ */

  function refs(ids) {
    if (!ids || !ids.length) return '<span class="muted">Assumption</span>';
    return ids.map(function (id) {
      return '<a class="ref" href="#ref-' + id + '">' + id + "</a>";
    }).join("");
  }

  function table(headers, rows) {
    return '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      headers.map(function (h) { return "<th>" + h + "</th>"; }).join("") +
      "</tr></thead><tbody>" +
      rows.map(function (r) { return "<tr>" + r.join("") + "</tr>"; }).join("") +
      "</tbody></table></div>";
  }

  function td(v, cls) { return "<td" + (cls ? ' class="' + cls + '"' : "") + ">" + v + "</td>"; }
  var DERIVED = '<span class="derived">derived</span>';

  function pct(x) { return (x * 100).toFixed(1).replace(/\.0$/, "") + "%"; }

  function renderSources() {
    var days = calc.DAYS;
    var html = "";

    html += '<div class="src-intro"><h1 tabindex="-1">Sources and assumptions</h1>' +
      "<p>Every number in the calculator is listed here with where it came from. " +
      "Where a figure was worked out rather than reported directly, it is marked <em>derived</em> and the working is explained. " +
      "Some figures are company statements or our own assumptions, and they are labelled as such.</p></div>";

    /* How it works */
    html += '<section class="src-section"><h2>How the calculation works</h2><div class="method">' +
      '<div class="card"><h3>Diet</h3><p>Each diet has a carbon footprint per day (S1). Your saving is the difference between your current and target diet, over a year. ' +
      "\u201CEat less meat\u201D moves you part of the way from your current diet to vegetarian.</p></div>" +
      '<div class="card"><h3>Water</h3><p>Studies of dietary water use disagree a lot, so this is the least certain part of the calculator. ' +
      "We use the median European diet as the baseline (S2) and scale other diets using their carbon footprint, calibrated so a vegan diet matches the pooled saving in S2. " +
      "This scaling is our own assumption. Blue water for food does not track carbon closely, so the range shown uses the 95% confidence interval from S2. " +
      "<strong>Blue</strong> water (irrigation, groundwater, rivers) is compared with AI's cooling water plus the water used to generate its electricity, since both are fresh water taken out of use. " +
      "<strong>Total</strong> adds rainwater taken up by crops and pasture. Data centres have no equivalent, so total water is shown for the diet alone and is not compared.</p></div>" +
      '<div class="card"><h3>AI inference</h3><p>Requests per day \u00D7 365 \u00D7 the footprint of one request, counted separately for three kinds: everyday chat prompts, thinking or agent prompts, and generated images. ' +
      "Published figures differ by a factor of several depending on the model and how long the prompt is, so three estimates are used and the range is shown. " +
      "All three turn energy into carbon on the same basis, the global average electricity mix.</p></div>" +
      '<div class="card"><h3>The headline figure</h3><p>How much of your AI use one month of your diet change makes up for: your yearly diet saving divided by your yearly AI footprint, \u00D7 one month. ' +
      "It is worked out separately for carbon and for blue water, with and without training. It counts the diet saving against the AI footprint as a total, not against local effects near a data centre.</p></div>" +
      '<div class="card"><h3>AI training</h3><p>Training is a one-off cost for each model. It is shared across the prompts the model is expected to serve, then added to each prompt. ' +
      "It is applied to chat and thinking prompts, which run on the same large language models. It is not added to images: image models are generally much smaller, and there are no reliable training figures for them. " +
      "Training figures come from outside estimates, because most companies do not publish them.</p></div>" +
      '<div class="card"><h3>Animal lives</h3><p>Land animals, and the animals killed in egg and dairy production, start from UK slaughter records. ' +
      "Each count is divided by the share of UK supply that is home-produced, so imported food counts too, then by the UK population. " +
      "That national figure is treated as the average meat-eater's. Other diets are scaled by how much meat and fish they eat, from UK diet studies. " +
      "Fish are counted from global estimates per person who eats animal products. The figure shown is how many fewer animals your target diet accounts for each year.</p></div>" +
      "</div></section>";

    /* Diet carbon */
    html += '<section class="src-section"><h2>Diet carbon footprints</h2>' +
      "<p>Dietary emissions for a 2,000 kcal day, adjusted for age and sex.</p>" +
      table(
        ["Diet", "kg CO\u2082e per day", "kg CO\u2082e per year", "Source"],
        data.diets.map(function (d) {
          return [td(d.label + ' <span class="muted">(' + d.detail + ")</span>"), td(d.kgCO2ePerDay.toFixed(2), "num"),
            td(sig(d.kgCO2ePerDay * days, 4), "num"), td(refs(d.src))];
        })
      ) + "</section>";

    /* Diet water */
    var w = data.dietWater;
    var base = calc.findDiet(w.baselineDietId);
    var vegan = calc.findDiet(data.veganDietId);
    var veg = calc.findDiet(data.meatFreeDietId);
    var high = calc.findDiet("high_meat");
    var gap = (base.kgCO2ePerDay - vegan.kgCO2ePerDay) / base.kgCO2ePerDay;
    var vb = w.veganSaving.blue, vt = w.veganSaving.total;
    var vegBlue = 1 - calc.waterPerDay(veg.kgCO2ePerDay, "blue") / calc.waterPerDay(base.kgCO2ePerDay, "blue");
    var veganVsHigh = 1 - calc.waterPerDay(vegan.kgCO2ePerDay, "blue") / calc.waterPerDay(high.kgCO2ePerDay, "blue");
    html += '<section class="src-section"><h2>Diet water footprints</h2>' +
      "<p>The baseline is the \u201C" + base.label.toLowerCase() + "\u201D diet. Other diets are scaled from it. Treat these figures as modelled, with lower confidence than the carbon figures.</p>" +
      table(
        ["Value", "Used", "Basis", "Source"],
        [
          [td("Baseline blue water"), td(w.blueLPerDay + " L per day", "num"), td("Median of European diets", "basis"), td(refs(w.src))],
          [td("Baseline total water (blue + green)"), td(w.totalLPerDay.toLocaleString("en-GB") + " L per day", "num"), td("Median of European diets", "basis"), td(refs(w.src))],
          [td("Blue water saving, no animal foods"), td(pct(vb.central) + " (" + pct(vb.low) + " to " + pct(vb.high) + ")", "num"),
            td("Pooled across studies, compared with the average diet; 95% confidence interval in brackets", "basis"), td(refs(w.src))],
          [td("Total water saving, no animal foods"), td(pct(vt.central) + " (" + pct(vt.low) + " to " + pct(vt.high) + ")", "num"),
            td("Pooled across studies, compared with the average diet; 95% confidence interval in brackets", "basis"), td(refs(w.src))],
          [td("Scaling for other diets" + DERIVED),
            td("Blue \u00D7" + (vb.central / gap).toFixed(2) + ", total \u00D7" + (vt.central / gap).toFixed(2), "num"),
            td("Water saving = carbon saving as a share of the baseline, \u00D7 this factor. Vegan saves " + (gap * 100).toFixed(0) + "% of carbon, and the factor is calibrated so that this gives the pooled water saving above.", "basis"),
            td(refs(["S1", "S2"]))],
          [td("Cross-check: fewer animal foods" + DERIVED),
            td("Vegetarian: " + pct(vegBlue) + " less blue water", "num"),
            td("S2 found " + pct(w.reducedAnimalBlueSaving) + " less blue water for diets with reduced animal foods, close to what the scaling gives for vegetarian.", "basis"),
            td(refs(["S2"]))],
          [td("Cross-check: vegan vs meat-heavy" + DERIVED),
            td("Vegan: " + pct(veganVsHigh) + " less blue water", "num"),
            td("A newer UK study found vegans' water use was about 54% lower than high meat-eaters', with a wide range. The scaling here is more cautious than that.", "basis"),
            td(refs(["S21"]))]
        ]
      ) + "</section>";

    /* AI inference */
    var elec = data.electricityWaterLPerKWh;
    html += '<section class="src-section"><h2>AI inference, per prompt</h2>' +
      "<p>One text prompt to a chatbot. \u201CHigher\u201D means a longer or costlier query: the upper quartile for large current models.</p>" +
      table(
        ["Estimate", "Energy", "Carbon", "On-site water", "Water incl. power", "How it was set", "Source"],
        SCENARIOS.map(function (k) {
          var s = data.aiScenarios[k];
          var p = calc.inferencePerPrompt(k);
          return [
            td("<strong>" + s.label + "</strong><br><span class=\"muted\">" + s.summary + "</span>"),
            td(sig(s.whPerPrompt, 3) + " Wh", "num"),
            td(sig(p.carbonG, 2) + " g" + DERIVED, "num"),
            td(sig(p.onsiteWaterMl, 2) + " mL" + (s.mLWaterPerPrompt == null ? DERIVED : ""), "num"),
            td(sig(p.waterMl, 2) + " mL" + DERIVED, "num"),
            td(s.basis, "basis"),
            td(refs(s.src))
          ];
        })
      ) +
      '<p class="after-table">Carbon is worked out as energy \u00D7 ' + data.gridGCO2PerKWh +
      " g CO\u2082e per kWh, the 2025 global average electricity mix " + refs(["S7"]) +
      ", for every estimate. Google reports 0.03 g for its median prompt, but that is a market-based figure that counts its clean-energy purchasing, so it is not used here " + refs(["S3"]) + ". " +
      "Water used to generate the electricity is added at " + elec + " mL per Wh, the US average " + refs(["S8"]) +
      ". It is several times larger than the cooling water, and the real figure depends on the local power mix.</p>" +
      "</section>";

    /* Reasoning and images */
    html += '<section class="src-section"><h2>Thinking prompts and image generation, per request</h2>' +
      "<p>These use the same carbon and water per Wh as the standard prompt in the same estimate, so only the energy differs.</p>" +
      table(
        ["Kind", "Estimate", "Energy", "Carbon", "Water", "How it was set", "Source"],
        ["reasoning", "images"].reduce(function (rows, kind) {
          SCENARIOS.forEach(function (k) {
            var cfg = kind === "reasoning" ? data.reasoningScenarios[k] : data.imageScenarios[k];
            var p = calc.perRequest(k)[kind];
            var derived = cfg.wh == null;
            rows.push([
              td(kind === "reasoning" ? "Thinking or agent prompt" : "Generated image"),
              td(data.aiScenarios[k].label),
              td(sig(p.wh, 3) + " Wh" + (derived ? DERIVED : ""), "num"),
              td(sig(p.carbonG, 2) + " g" + DERIVED, "num"),
              td(sig(p.waterMl, 2) + " mL" + DERIVED, "num"),
              td(cfg.basis, "basis"),
              td(refs(cfg.src))
            ]);
          });
          return rows;
        }, [])
      ) +
      '<p class="after-table">How much a thinking prompt costs depends on how long the model thinks. These estimates assume answers of about 5,000 tokens, including the thinking ' + refs(["S36"]) +
      ". Maximum-effort reasoning on long documents can use much more: one outside estimate puts GPT-5 at high effort on a long prompt at about 34 Wh " + refs(["S6"]) + ". " +
      "Where only GPU energy is known for an image model, it is scaled up by " + sig(data.gpuToSystemFactor, 3) +
      ", because AI accelerators make up 58% of the energy of a prompt once the rest of the server and the data centre are counted " + refs(["S3"]) +
      ". Commercial image tools do not publish their own figures, so treat these as a guide " + refs(["S17", "S18", "S19"]) + ".</p>" +
      "</section>";

    /* Training */
    var std = calc.inferencePerPrompt("central");
    var trC = calc.trainingPerPrompt("central");
    var tc = data.trainingScenarios.central;
    var atFewer = (tc.tCO2e * 1e6) / 1e11;
    html += '<section class="src-section"><h2>AI training, shared across prompts</h2>' +
      "<p>Each estimate shares one model's training footprint across the prompts it is expected to serve. Water is estimated at " +
      sig(calc.trainingWaterLPerMWh(), 3) + " L per MWh including power generation (" + sig(calc.trainingWaterLPerMWh(true), 3) +
      " L on site), taken from GPT-3 " + refs(data.trainingWater.src) + ".</p>" +
      table(
        ["Estimate", "Training carbon", "Training energy", "Water incl. power", "Prompts served", "Added per prompt", "Source"],
        SCENARIOS.map(function (k) {
          var t = data.trainingScenarios[k];
          var p = calc.trainingPerPrompt(k);
          var litres = t.gwh * 1000 * calc.trainingWaterLPerMWh();
          return [
            td("<strong>" + t.label + "</strong><br><span class=\"muted\">" + t.summary + "</span>"),
            td(Math.round(t.tCO2e).toLocaleString("en-GB") + " t CO\u2082e", "num"),
            td(sig(t.gwh, 3) + " GWh", "num"),
            td(sig(litres / 1e6, 3) + " million L" + DERIVED, "num"),
            td(sig(t.lifetimePrompts / 1e12, 2) + " trillion", "num"),
            td(sig(p.carbonG * 1000, 2) + " mg CO\u2082e<br>" + sig(p.waterMl, 2) + " mL water" + DERIVED, "num"),
            td(refs(t.src))
          ];
        })
      ) +
      '<p class="after-table">The number of prompts a model serves is an assumption, and the training share depends heavily on it: halve the prompts and the share per prompt doubles. ' +
      "ChatGPT handles around 0.9 trillion prompts a year across all its models " + refs(["S14"]) +
      ", and any one model is usually the default for months rather than years, so the estimates assume 1, 0.3 and 0.1 trillion. " +
      "At the central estimate, training adds about " + Math.round((trC.carbonG / std.carbonG) * 100) + "% to the carbon of an everyday prompt; spread over 0.1 trillion prompts it would add about " +
      Math.round((atFewer / std.carbonG) * 100) + "%. " +
      "For Grok 4, Epoch estimates about 154,000 t CO\u2082e because the site ran largely on gas turbines " + refs(["S20"]) +
      ", roughly double the AI Index figure used here. Training figures are rough because companies rarely publish them " + refs(["S10", "S11"]) + ".</p>" +
      "</section>";

    /* Animal lives */
    var an = data.animals;
    var ab = calc.animalBaseline();
    var perPerson = function (n) { return sig(n, n < 1 ? 2 : 3) + " a year" + DERIVED; };
    var cows = an.culledCows;
    var dairyShare = cows.dairyHerd / (cows.dairyHerd + cows.beefHerd);
    var homeFed = function (x) { return Math.round(x * 100) + "% home-produced"; };
    var meatRows = an.meat.map(function (m) {
      return [td(m.label), td(perPerson(ab.meatBy[m.id]), "num"),
        td(sig(m.millions, 4) + " million slaughtered in the UK in 2025, " + homeFed(m.homeFed), "basis"), td(refs(m.src))];
    });
    meatRows.push([td("Beef cows and bulls"), td(perPerson(ab.meatBy.beefCows), "num"),
      td(Math.round((1 - dairyShare) * 100) + "% of the " + Math.round(cows.millions * 1000) + ",000 cows and adult bulls slaughtered, split by herd size (assumption)", "basis"),
      td(refs(cows.src))]);
    var fishWorld = an.fish.worldPopulation * (1 - an.fish.plantBasedShare);
    html += '<section class="src-section"><h2>Animal lives</h2>' +
      "<p>Animals killed each year for the food of an average meat-eater. Shares of supply are from S22, and the UK population is " +
      an.ukPopulation.toLocaleString("en-GB") + " " + refs(["S26"]) + ". Counts that cover Great Britain only are divided by the Great Britain population, " +
      calc.gbPopulation().toLocaleString("en-GB") + ", which leaves out Northern Ireland's " + an.niPopulation.toLocaleString("en-GB") + " " + refs(["S35"]) + ".</p>" +
      table(
        ["Animals", "Per person", "Basis", "Source"],
        meatRows.concat([
          [td("Male chicks from laying lines"), td(sig(ab.eggsBy.chicks.low, 2) + " to " + sig(ab.eggsBy.chicks.high, 2) + " a year" + DERIVED, "num"),
            td(an.eggs.maleChicksMillions.low + " to " + an.eggs.maleChicksMillions.high + " million a year in Great Britain, per person in Great Britain; " + homeFed(an.eggs.homeFed) + " for eggs", "basis"), td(refs(["S23", "S22", "S35"]))],
          [td("Laying hens"), td(perPerson(ab.eggsBy.hens), "num"),
            td(an.eggs.culledHensMillions + " million culled hens slaughtered in 2025, " + homeFed(an.eggs.homeFed) + " for eggs", "basis"), td(refs(["S22"]))],
          [td("Young male calves"), td(perPerson(ab.dairyBy.calves), "num"),
            td(an.dairy.youngMaleCalves.toLocaleString("en-GB") + " male calves under two months old killed in Great Britain in 2022, all counted as dairy, per person in Great Britain; milk is " + homeFed(an.dairy.homeFed), "basis"), td(refs(["S24", "S22", "S35"]))],
          [td("Dairy cows"), td(perPerson(ab.dairyBy.cows), "num"),
            td(Math.round(dairyShare * 100) + "% of cows and adult bulls slaughtered, split by herd size (assumption)", "basis"), td(refs(["S22"]))],
          [td("Calves taken from their mothers (not counted as killed)"), td(perPerson(ab.separatedCalves), "num"),
            td(sig(an.dairy.calvesBornMillions, 3) + " million calves born to dairy cows in Great Britain in 2024, almost all taken from their mothers within two days, per person in Great Britain; milk is " +
              homeFed(an.dairy.homeFed), "basis"), td(refs(["S32", "S33", "S22", "S35"]))],
          [td("Fish, lower"), td(perPerson(ab.fish.low), "num"),
            td("Wild-caught and farmed fish per person who eats animal products, worldwide", "basis"), td(refs(["S30"]))],
          [td("Fish, central"), td(perPerson(ab.fish.central), "num"),
            td("Midpoints of " + an.fish.wildBillions.low + " to " + an.fish.wildBillions.high + " billion wild and " + an.fish.farmedBillions.central +
              " billion farmed fish in 2019, shared among the " + sig(fishWorld / 1e9, 3) + " billion people who are not plant-based", "basis"), td(refs(an.fish.src))],
          [td("Fish, higher"), td(perPerson(ab.fish.high), "num"),
            td("Upper ends: " + an.fish.wildBillions.high + " billion wild and " + an.fish.farmedBillions.high + " billion farmed fish", "basis"), td(refs(an.fish.src))]
        ])
      ) +
      '<p class="after-table">Each diet is scaled from the average meat-eater. Meat is scaled by grams eaten a day: ' +
      "125 g for meat-heavy and 75 g for average are assumptions inside the bands of S1, and 36 g is the low meat-eater mean in S27. " +
      "Fish uses the EPIC-Oxford means in S27. Eggs and dairy are counted the same for every diet that includes them, because vegetarians in S27 ate similar amounts of eggs, less milk and more cheese.</p>" +
      table(
        ["Diet", "Meat", "Fish", "Eggs and dairy", "Animals a year", "Source"],
        data.diets.map(function (d) {
          var p = calc.animalProfile(d.id);
          var a = calc.animalsPerYear(p, ab);
          return [
            td(d.label),
            td("\u00D7" + p.meat.toFixed(2), "num"),
            td("\u00D7" + p.fish.toFixed(2), "num"),
            td(p.eggsDairy ? "Yes" : "No", "num"),
            td(fmtCount(a.total.central) + (a.total.high - a.total.low > 1 ? " (" + fmtCount(a.total.low) + " to " + fmtCount(a.total.high) + ")" : "") + DERIVED, "num"),
            td(refs(["S1", "S27"]))
          ];
        })
      ) + "</section>";

    /* Usage and equivalents */
    html += '<section class="src-section"><h2>Usage levels and everyday comparisons</h2>' +
      "<p>The usage levels are assumed mixes, there to give a starting point. Your own numbers will differ.</p>" +
      table(
        ["Value", "Used", "Basis", "Source"],
        data.usageLevels.map(function (u) {
          return [td(u.label), td(mixText(u), "num"), td(u.basis, "basis"), td(refs(u.src))];
        }).concat([
          [td("Car emissions"), td(data.equivalents.kgCO2ePerKmCar + " kg CO\u2082e per km", "num"), td("Rule of thumb for an average petrol car", "basis"), td(refs(data.equivalents.src))],
          [td("Shower"), td(data.equivalents.litresPerShower + " L", "num"), td("Rule of thumb for a 5-minute shower", "basis"), td(refs(data.equivalents.src))]
        ])
      ) + "</section>";

    /* Caveats */
    html += '<section class="src-section"><h2>Worth knowing</h2><ul class="caveats">' +
      "<li><strong>These are estimates.</strong> AI figures vary by model, hardware, location and prompt length, and many are reported by the companies themselves. Treat the range as the honest answer.</li>" +
      "<li><strong>Thinking and agent prompts are counted separately.</strong> One thinking prompt can use about 13 times the energy of a standard one, and one agent session can involve many such calls. If a tool makes several calls for each thing you ask, count each call, or raise the slider.</li>" +
      "<li><strong>Image figures are rough.</strong> Energy per image depends on the model and image size, and commercial tools do not publish their own numbers. Video, voice and other kinds of AI are not included.</li>" +
      "<li><strong>Not everything is counted.</strong> AI that runs without you asking, such as search summaries, email suggestions or background features, is not included.</li>" +
      "<li><strong>Diet figures are averages.</strong> What you buy, where it was grown and how much you waste all change the real number. The carbon data are UK-based and the water data lean European.</li>" +
      "<li><strong>Diet water is the least certain figure.</strong> It is scaled from carbon, which is our own assumption, and blue water for food does not follow carbon closely. Only blue water is compared with AI; total water includes rainwater, which has no data-centre equivalent.</li>" +
      "<li><strong>Training depends on an assumption.</strong> How many prompts a model serves over its life is not published, and the training share per prompt scales with it.</li>" +
      "<li><strong>Animal counts leave a lot out.</strong> Shellfish, bycatch, animals that die before slaughter, and wild animals killed by farming are not counted, so the real number is higher. " +
      "Fish are global averages rather than UK figures, and they include fish caught for feed, some of which goes to livestock.</li>" +
      "<li><strong>This is not a full life-cycle assessment.</strong> Chip manufacturing, data-centre construction and networking are not counted, apart from what is built into the figures above.</li>" +
      "<li><strong>Making up counts totals, not places.</strong> A diet change can balance the carbon and water of your AI use, but it does not undo local effects, such as strain on a particular grid or water supply.</li>" +
      "</ul></section>";

    /* References */
    html += '<section class="src-section"><h2>References</h2><ol class="ref-list">' +
      data.sources.slice().sort(function (a, b) {
        return Number(a.id.slice(1)) - Number(b.id.slice(1));
      }).map(function (s) {
        return '<li id="ref-' + s.id + '"><span class="ref-id">' + s.id + "</span>" +
          '<div class="ref-title">' + s.title + "</div>" +
          '<div class="ref-authors">' + s.authors + "</div>" +
          '<div class="ref-note">' + s.note + "</div>" +
          (s.url ? '<a class="ref-link" href="' + s.url + '" target="_blank" rel="noopener noreferrer">' + s.url + "</a>" : "") +
          "</li>";
      }).join("") + "</ol></section>";

    $("sources-root").innerHTML = html;
  }

  /* ------------------------------ Tabs ------------------------------ */

  var TABS = ["calculator", "sources"];

  function activateTab(name, focus) {
    TABS.forEach(function (t) {
      var selected = t === name;
      var tab = $("tab-" + t);
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
      $("panel-" + t).hidden = !selected;
    });
    if (focus) $("tab-" + name).focus();
  }

  function routeFromHash() {
    var hash = window.location.hash.replace("#", "");
    if (!hash) return;
    if (hash === "sources" || hash === "calculator") {
      activateTab(hash, false);
      window.scrollTo(0, 0);
    } else if (hash.indexOf("ref-") === 0) {
      activateTab("sources", false);
      var el = document.getElementById(hash);
      if (el) el.scrollIntoView({ block: "start" });
    }
  }

  function bindTabs() {
    TABS.forEach(function (t, i) {
      var tab = $("tab-" + t);
      tab.addEventListener("click", function () {
        activateTab(t, false);
        setHash(t);
        window.scrollTo(0, 0);
      });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = TABS[(i + 1) % TABS.length];
        else if (e.key === "ArrowLeft") next = TABS[(i - 1 + TABS.length) % TABS.length];
        else if (e.key === "Home") next = TABS[0];
        else if (e.key === "End") next = TABS[TABS.length - 1];
        if (next) {
          e.preventDefault();
          activateTab(next, true);
          setHash(next);
        }
      });
    });

    /* In-page links to a tab, such as the "Sources tab" link under the results. */
    document.addEventListener("click", function (e) {
      var link = e.target.closest && e.target.closest("[data-goto]");
      if (!link) return;
      e.preventDefault();
      var name = link.getAttribute("data-goto");
      activateTab(name, false);
      setHash(name);
      window.scrollTo(0, 0);
      var heading = document.querySelector("#panel-" + name + " h1");
      if (heading) heading.focus();
    });

    window.addEventListener("hashchange", routeFromHash);
  }

  /* ------------------------------ Init ------------------------------ */

  renderChoices();
  bindInputs();
  bindSteps();
  bindLives();
  syncControls();
  render(false);
  renderSources();
  bindTabs();
  routeFromHash();
})();
