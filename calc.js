/*
 * calc.js - pure calculation functions, no DOM access.
 * Units: carbon in kgCO2e per year, water in litres per year.
 */
(function (g) {
  "use strict";

  var data = g.VO && g.VO.data;
  if (!data && typeof require === "function") {
    data = require("./data.js");
  }

  var DAYS = 365;
  var MONTH = DAYS / 12;
  var SCENARIOS = ["low", "central", "high"];
  var VARIANTS = ["inference", "withTraining"];
  var KINDS = ["standard", "reasoning", "images"];

  function findDiet(id) {
    for (var i = 0; i < data.diets.length; i++) {
      if (data.diets[i].id === id) return data.diets[i];
    }
    throw new Error("Unknown diet: " + id);
  }

  /* ------------------------------ Diet ------------------------------ */

  /* Effective carbon (kgCO2e/day) of the target. */
  function targetCarbonPerDay(currentId, target) {
    var current = findDiet(currentId).kgCO2ePerDay;
    if (!target || target.mode === "same") return current;

    if (target.mode === "diet") return findDiet(target.dietId).kgCO2ePerDay;

    if (target.mode === "reduce") {
      var meatFree = findDiet(data.meatFreeDietId).kgCO2ePerDay;
      if (current <= meatFree) return current; /* already meat-free */
      var share = Math.min(1, Math.max(0, (target.reducePct || 0) / 100));
      return current - share * (current - meatFree);
    }
    throw new Error("Unknown target mode: " + target.mode);
  }

  /*
   * Water footprint (L/day) of a diet with the given carbon footprint.
   * Water scales with the carbon gap to the baseline diet, calibrated so a
   * vegan diet reproduces the pooled saving from Harris et al. (2020).
   * bound: "central" (default), "low" or "high" end of Harris's 95% CI.
   */
  function waterPerDay(carbonPerDay, basis, bound) {
    var w = data.dietWater;
    var base = findDiet(w.baselineDietId).kgCO2ePerDay;
    var vegan = findDiet(data.veganDietId).kgCO2ePerDay;
    var veganSaving = w.veganSaving[basis === "total" ? "total" : "blue"][bound || "central"];
    var baseLitres = basis === "total" ? w.totalLPerDay : w.blueLPerDay;
    var k = veganSaving / ((base - vegan) / base);
    var factor = 1 - k * ((base - carbonPerDay) / base);
    return Math.max(0, baseLitres * factor);
  }

  /* ------------------------------ AI ------------------------------ */

  function gramsFromWh(wh) {
    return (wh * data.gridGCO2PerKWh) / 1000; /* Wh x (g/kWh) / 1000 */
  }

  /* Water consumed generating the electricity: L per kWh is the same as mL per Wh. */
  function electricityWaterMl(wh) {
    return wh * data.electricityWaterLPerKWh;
  }

  /* Per-prompt inference footprint: { wh, carbonG, waterMl, onsiteWaterMl } */
  function inferencePerPrompt(scenarioKey) {
    var s = data.aiScenarios[scenarioKey];
    var low = data.aiScenarios.low;
    var onsite =
      s.mLWaterPerPrompt != null
        ? s.mLWaterPerPrompt
        : s.whPerPrompt * (low.mLWaterPerPrompt / low.whPerPrompt);
    return {
      wh: s.whPerPrompt,
      carbonG: gramsFromWh(s.whPerPrompt),
      onsiteWaterMl: onsite,
      waterMl: onsite + electricityWaterMl(s.whPerPrompt)
    };
  }

  /* Training water, litres per MWh (from GPT-3): on-site and including power generation. */
  function trainingWaterLPerMWh(onsiteOnly) {
    var t = data.trainingWater;
    return (onsiteOnly ? t.gpt3OnsiteLitres : t.gpt3TotalLitres) / t.gpt3MWh;
  }

  /* Training footprint shared across each prompt: { carbonG, waterMl } */
  function trainingPerPrompt(scenarioKey) {
    var t = data.trainingScenarios[scenarioKey];
    var carbonG = (t.tCO2e * 1e6) / t.lifetimePrompts;
    var litres = t.gwh * 1000 * trainingWaterLPerMWh();
    var waterMl = (litres * 1000) / t.lifetimePrompts;
    return { carbonG: carbonG, waterMl: waterMl };
  }

  /* Energy (Wh) of one reasoning prompt. */
  function reasoningWh(scenarioKey) {
    var r = data.reasoningScenarios[scenarioKey];
    return r.wh != null ? r.wh : r.multiplier * data.aiScenarios[scenarioKey].whPerPrompt;
  }

  /* Energy (Wh) of one generated image, scaled to the whole system where only GPU energy is known. */
  function imageWh(scenarioKey) {
    var s = data.imageScenarios[scenarioKey];
    return s.gpuWh != null ? s.gpuWh * data.gpuToSystemFactor : s.wh;
  }

  /*
   * Per-request footprint for each kind of request: { carbonG, waterMl, wh }.
   * Reasoning and image requests use the same carbon and water per Wh as the
   * standard prompt in that scenario.
   */
  function perRequest(scenarioKey) {
    var std = inferencePerPrompt(scenarioKey);
    var carbonPerWh = std.carbonG / std.wh;
    var waterPerWh = std.waterMl / std.wh;
    function fromWh(wh) {
      return { wh: wh, carbonG: wh * carbonPerWh, waterMl: wh * waterPerWh };
    }
    return {
      standard: std,
      reasoning: fromWh(reasoningWh(scenarioKey)),
      images: fromWh(imageWh(scenarioKey))
    };
  }

  function normaliseUsage(u) {
    u = u || {};
    return {
      standard: Math.max(0, u.standard || 0),
      reasoning: Math.max(0, u.reasoning || 0),
      images: Math.max(0, u.images || 0)
    };
  }

  /*
   * Annual AI footprint for a scenario:
   * { inference, training, withTraining, byType }
   * Training is shared across standard and reasoning requests (the same large
   * language models). It is not added to image generation, where reliable
   * training figures are not available.
   */
  function aiPerYear(scenarioKey, usage) {
    var u = normaliseUsage(usage);
    var req = perRequest(scenarioKey);
    var tr = trainingPerPrompt(scenarioKey);

    var inference = { carbon: 0, water: 0 };
    var training = { carbon: 0, water: 0 };
    var byType = {};

    KINDS.forEach(function (k) {
      var n = u[k] * DAYS;
      var inf = { carbon: (n * req[k].carbonG) / 1000, water: (n * req[k].waterMl) / 1000 };
      var trn = k === "images"
        ? { carbon: 0, water: 0 }
        : { carbon: (n * tr.carbonG) / 1000, water: (n * tr.waterMl) / 1000 };
      inference.carbon += inf.carbon;
      inference.water += inf.water;
      training.carbon += trn.carbon;
      training.water += trn.water;
      byType[k] = {
        inference: inf,
        withTraining: { carbon: inf.carbon + trn.carbon, water: inf.water + trn.water }
      };
    });

    return {
      inference: inference,
      training: training,
      withTraining: { carbon: inference.carbon + training.carbon, water: inference.water + training.water },
      byType: byType
    };
  }

  /* ------------------------------ Animals ------------------------------ */

  /* Animals a year per UK person, from a UK count in millions and the home-fed share of supply. */
  function perUkPerson(millions, homeFed) {
    return (millions * 1e6) / homeFed / data.animals.ukPopulation;
  }

  function gbPopulation() {
    return data.animals.ukPopulation - data.animals.niPopulation;
  }

  /* The same, for counts that cover Great Britain only. */
  function perGbPerson(millions, homeFed) {
    return (millions * 1e6) / homeFed / gbPopulation();
  }

  function bounds(low, central, high) { return { low: low, central: central, high: high }; }

  /*
   * Animals a year behind the average meat-eater's food, by group:
   * { meat, meatBy, fish{low,central,high}, eggs{...}, eggsBy, dairy, dairyBy }
   */
  function animalBaseline() {
    var a = data.animals;
    var meatBy = {};
    var meat = 0;
    a.meat.forEach(function (m) {
      meatBy[m.id] = perUkPerson(m.millions, m.homeFed);
      meat += meatBy[m.id];
    });
    var c = a.culledCows;
    var dairyShare = c.dairyHerd / (c.dairyHerd + c.beefHerd);
    meatBy.beefCows = perUkPerson(c.millions * (1 - dairyShare), c.homeFed);
    meat += meatBy.beefCows;

    var e = a.eggs;
    var hens = perUkPerson(e.culledHensMillions, e.homeFed);
    var chicksLow = perGbPerson(e.maleChicksMillions.low, e.homeFed);
    var chicksHigh = perGbPerson(e.maleChicksMillions.high, e.homeFed);
    var chicks = bounds(chicksLow, (chicksLow + chicksHigh) / 2, chicksHigh);

    var d = a.dairy;
    var calves = perGbPerson(d.youngMaleCalves / 1e6, d.homeFed);
    var dairyCows = perUkPerson(c.millions * dairyShare, d.homeFed);
    var separatedCalves = perGbPerson(d.calvesBornMillions, d.homeFed);

    var f = a.fish;
    var eaters = f.worldPopulation * (1 - f.plantBasedShare);
    var wildMid = (f.wildBillions.low + f.wildBillions.high) / 2;
    var fish = bounds(
      f.lowPerPerson,
      ((wildMid + f.farmedBillions.central) * 1e9) / eaters,
      ((f.wildBillions.high + f.farmedBillions.high) * 1e9) / eaters
    );

    return {
      meat: meat,
      meatBy: meatBy,
      fish: fish,
      eggs: bounds(hens + chicks.low, hens + chicks.central, hens + chicks.high),
      eggsBy: { chicks: chicks, hens: hens },
      dairy: calves + dairyCows,
      dairyBy: { calves: calves, cows: dairyCows },
      separatedCalves: separatedCalves
    };
  }

  /* How much meat, fish and egg-and-dairy a diet eats, relative to the average meat-eater. */
  function animalProfile(dietId) {
    var a = data.animals;
    return {
      meat: a.meatGramsPerDay[dietId] / a.meatGramsPerDay[a.referenceDietId],
      fish: a.fishFactor[dietId],
      eggsDairy: a.eatsEggsAndDairy[dietId] ? 1 : 0
    };
  }

  /* "Eat less meat" takes meat and fish out first and leaves eggs and dairy, as for carbon. */
  function targetAnimalProfile(currentId, target) {
    var p = animalProfile(currentId);
    if (!target || target.mode === "same") return p;
    if (target.mode === "diet") return animalProfile(target.dietId);
    if (target.mode === "reduce") {
      if (findDiet(currentId).kgCO2ePerDay <= findDiet(data.meatFreeDietId).kgCO2ePerDay) return p;
      var keep = 1 - Math.min(1, Math.max(0, (target.reducePct || 0) / 100));
      return { meat: p.meat * keep, fish: p.fish * keep, eggsDairy: p.eggsDairy };
    }
    throw new Error("Unknown target mode: " + target.mode);
  }

  /*
   * Animals a year for a profile: { meat, fish, eggs, dairy, total, separatedCalves },
   * ranged values as {low,central,high}. Separated calves are not deaths, so not in the total.
   */
  function animalsPerYear(profile, base) {
    base = base || animalBaseline();
    var out = {
      meat: base.meat * profile.meat,
      fish: {},
      eggs: {},
      dairy: base.dairy * profile.eggsDairy,
      total: {},
      separatedCalves: base.separatedCalves * profile.eggsDairy
    };
    SCENARIOS.forEach(function (s) {
      out.fish[s] = base.fish[s] * profile.fish;
      out.eggs[s] = base.eggs[s] * profile.eggsDairy;
      out.total[s] = out.meat + out.fish[s] + out.eggs[s] + out.dairy;
    });
    return out;
  }

  /* Current minus target. Ranged groups keep low <= high even when the change adds animals. */
  function animalDifference(cur, tgt) {
    function ranged(key) {
      var v = SCENARIOS.map(function (s) { return cur[key][s] - tgt[key][s]; });
      return bounds(Math.min(v[0], v[2]), v[1], Math.max(v[0], v[2]));
    }
    return {
      meat: cur.meat - tgt.meat,
      fish: ranged("fish"),
      eggs: ranged("eggs"),
      dairy: cur.dairy - tgt.dairy,
      total: ranged("total"),
      separatedCalves: cur.separatedCalves - tgt.separatedCalves
    };
  }

  function animals(currentId, target) {
    var base = animalBaseline();
    var cur = animalsPerYear(animalProfile(currentId), base);
    var tgt = animalsPerYear(targetAnimalProfile(currentId, target), base);
    return { baseline: base, current: cur, target: tgt, spared: animalDifference(cur, tgt) };
  }

  /* ------------------------------ Combine ------------------------------ */

  /*
   * input: {
   *   currentId, target: { mode, dietId?, reducePct? },
   *   usage: { standard, reasoning, images }, waterBasis: "blue" | "total"
   * }
   *
   * For each metric and variant, coverage = saving / AI use, and monthCovers
   * is how many days of AI use one month of the diet saving matches. Total water
   * (which includes rainwater) has no AI equivalent, so it is not compared.
   */
  function compute(input) {
    var currentC = findDiet(input.currentId).kgCO2ePerDay;
    var targetC = targetCarbonPerDay(input.currentId, input.target);
    var basis = input.waterBasis === "total" ? "total" : "blue";

    function dietWaterSaving(bound) {
      return (waterPerDay(currentC, basis, bound) - waterPerDay(targetC, basis, bound)) * DAYS;
    }

    var diet = {
      current: { carbon: currentC * DAYS, water: waterPerDay(currentC, basis) * DAYS },
      target: { carbon: targetC * DAYS, water: waterPerDay(targetC, basis) * DAYS }
    };
    diet.saving = {
      carbon: diet.current.carbon - diet.target.carbon,
      water: diet.current.water - diet.target.water
    };
    var waterLow = dietWaterSaving("low"), waterHigh = dietWaterSaving("high");
    diet.savingRange = {
      carbon: { low: diet.saving.carbon, high: diet.saving.carbon },
      water: { low: Math.min(waterLow, waterHigh), high: Math.max(waterLow, waterHigh) }
    };

    var ai = {};
    SCENARIOS.forEach(function (s) {
      ai[s] = aiPerYear(s, input.usage);
    });

    var comparable = { carbon: true, water: basis === "blue" };

    var metrics = {};
    ["carbon", "water"].forEach(function (m) {
      var saving = diet.saving[m];
      var range = diet.savingRange[m];
      metrics[m] = { saving: saving, savingRange: range, comparable: comparable[m], variants: {} };
      VARIANTS.forEach(function (v) {
        var row = { ai: {}, coverage: {}, monthCovers: {}, monthRange: null };
        SCENARIOS.forEach(function (s) {
          var use = ai[s][v][m];
          row.ai[s] = use;
          var ok = comparable[m] && use > 0 && saving > 0;
          row.coverage[s] = ok ? saving / use : null;
          row.monthCovers[s] = ok ? (saving / use) * MONTH : null;
        });
        if (comparable[m] && row.ai.low > 0 && range.low > 0) {
          row.monthRange = { low: (range.low / row.ai.high) * MONTH, high: (range.high / row.ai.low) * MONTH };
        }
        metrics[m].variants[v] = row;
      });
    });

    var lowest = findDiet(data.veganDietId).kgCO2ePerDay;
    var meatFree = currentC <= findDiet(data.meatFreeDietId).kgCO2ePerDay;
    var reducing = !!input.target && input.target.mode === "reduce";

    return {
      diet: diet,
      ai: ai,
      metrics: metrics,
      animals: animals(input.currentId, input.target),
      notes: {
        alreadyLowest: currentC <= lowest,
        alreadyMeatFree: reducing && meatFree,
        zeroReduce: reducing && !meatFree && !(input.target.reducePct > 0),
        noChange: Math.abs(diet.saving.carbon) < 1e-9,
        increases: diet.saving.carbon < -1e-9
      }
    };
  }

  var calc = {
    compute: compute,
    targetCarbonPerDay: targetCarbonPerDay,
    waterPerDay: waterPerDay,
    inferencePerPrompt: inferencePerPrompt,
    electricityWaterMl: electricityWaterMl,
    trainingPerPrompt: trainingPerPrompt,
    trainingWaterLPerMWh: trainingWaterLPerMWh,
    aiPerYear: aiPerYear,
    perRequest: perRequest,
    reasoningWh: reasoningWh,
    imageWh: imageWh,
    animalBaseline: animalBaseline,
    gbPopulation: gbPopulation,
    animalProfile: animalProfile,
    animalsPerYear: animalsPerYear,
    animals: animals,
    findDiet: findDiet,
    SCENARIOS: SCENARIOS,
    VARIANTS: VARIANTS,
    KINDS: KINDS,
    DAYS: DAYS,
    MONTH: MONTH
  };

  g.VO = g.VO || {};
  g.VO.calc = calc;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = calc;
  }
})(typeof window !== "undefined" ? window : globalThis);
