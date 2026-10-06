---
name: Prompt & Plate
description: Isotype picture statistics for one question - does a diet change make up for your AI footprint.
colors:
  paper: "#f8f8f8"
  white: "#ffffff"
  ink: "#0e0e0e"
  ink-2: "#4a4a4a"
  ink-3: "#6b6b6b"
  hair: "#cfcfcf"
  ai-red: "#c8102e"
  diet-blue-grey: "#6e8aa9"
  diet-ink: "#3d6283"
  water-ochre: "#dfa739"
  water-ink: "#8a5f0c"
typography:
  display:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "2.3125rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.95rem"
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 700
    lineHeight: "1.5rem"
  question:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.09rem"
    fontWeight: 500
    lineHeight: "1.6rem"
  body:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  numeral:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 700
    lineHeight: 1.1
    fontFeature: "tnum"
  display-narrow:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
  subhead:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 500
    lineHeight: 1.35
  caption:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.4
  small:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.4
  button:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.25
  label:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 500
    lineHeight: 1.35
  tag:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.5
  brand:
    fontFamily: "Latin Punctuation, Noto Sans HK, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.29rem"
    fontWeight: 700
    letterSpacing: "-0.03em"
rounded:
  none: "0"
spacing:
  gutter: "0.4rem"
  margin: "0.9375rem"
  row: "0.6rem"
  section: "1rem"
  label-col: "12.8rem"
  panel-col: "17.5rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "0.55rem 0.6rem"
    height: "2.6875rem"
  button-primary-hover:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.white}"
  button-primary-active:
    backgroundColor: "{colors.ink-3}"
    textColor: "{colors.white}"
  step-panel:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.8125rem 0.9rem 0.6875rem"
    width: "{spacing.panel-col}"
  segment:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.5rem"
  segment-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  tab:
    textColor: "{colors.ink}"
    padding: "0.35rem 0.6rem"
  ref-tag:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 0.3rem"
  ref-tag-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
---

# Design System: Prompt & Plate

## Overview

**Creative North Star: "Count It Out"**

Prompt & Plate is a sheet of Isotype picture statistics. Quantities are shown by repeating one identical, flat pictogram, never by scaling it. A year of AI use is a short row of red chat bubbles. A year of what you eat is two walls of clouds, one per unit: before the change in graphite, and after it in blue-grey, with the clouds the change removes left as faint ghosts at the end of the after wall. The reader sees the size of the gap before reading a number. Everything else on the page serves that count: off-white paper, black ink, heavy black rules between chart rows, and a narrow left column that labels each row like the margin of a statistical chart.

The page is dense and quiet. There is one sans throughout, set in bold for headings and statements. Corners are square, there are no shadows or gradients, and colour belongs to the pictograms. Text stays black or grey, apart from a few words tinted to match the symbol they describe. The interface is a white panel with a thin black border, set inside the chart grid. It holds radios, sliders and square black buttons, so the controls read as part of the chart, not as a separate app laid over it.

This record replaces the earlier leaf mark and green palette, which are retired.

**Key Characteristics:**
- Identical masked SVG pictograms, counted not scaled, each colour fixed to one quantity.
- Partial quantities drawn as cut symbols over a faint ghost, never rounded away.
- A fixed symbol unit (5 kg CO₂e, 100 L of water, one animal, one year of AI use) that never changes with the inputs, always stated in an explicit key.
- Full-width 0.125rem black rules between rows; a three-column chart grid of label, symbols and panel.
- Paper #f8f8f8, ink #0e0e0e, white only for interactive surfaces.
- Square corners, no shadows, no gradients.

## Colors

Achromatic paper and ink, with three pictogram hues that each count a single quantity.

### Primary
- **Signal Red** (ai-red): the AI quantity, and only that. It fills the chat-bubble pictograms, AI water drops and AI month symbols, and tints AI figures in statements and tables.

### Secondary
- **Isotype Blue-Grey** (diet-blue-grey): diet CO2e after the change. It fills the after wall, its saving ghosts, the month chart clouds, and the favicon cloud. It is a symbol colour, not a text colour.
- **Before** (ink-2, Graphite): diet CO2e before the change. It fills the before wall and labels it in text.
- **Deep Slate Blue** (diet-ink): the text twin of the blue-grey. Used for diet figures in statements, captions and tables, and for the "derived" mark on the Sources tab.

### Tertiary
- **Isotype Ochre** (water-ochre): diet water. It fills the drop pictograms.
- **Burnt Umber** (water-ink): the text twin of the ochre. Used for water captions and the outlined water tag in the result table.

### Neutral
- **Chart Paper** (paper): the page background, and the base mixed into ghost symbols.
- **Panel White** (white): interactive surfaces only, such as the step panel, segmented controls, radio wells, the details toggle and reference tags. Also the text colour on ink.
- **Press Ink** (ink): text, all rules, panel borders, buttons, selected segments, focus outlines.
- **Graphite** (ink-2): secondary prose, hints, table headers, captions.
- **Pencil Grey** (ink-3): tertiary metadata, ranges, units, footnotes.
- **Hairline** (hair): minor dividers inside tables and panels, and the unfilled slider track.

### Named Rules
**The One Job Rule.** Each pictogram hue counts one quantity: red for AI, blue-grey for diet CO2e, ochre for diet water, black for animals, and black planes for flight CO2e in the Flights section. Black never counts animals and flights in the same section. Never reuse a hue for decoration or for a different quantity.

**The Ink Twin Rule.** Blue-grey and ochre are too light for text on paper. Any text that names a diet or water figure uses its darker twin (diet-ink, water-ink). Red is dark enough to serve as its own text colour.

**The Ghost Rule.** The unfilled part of a cut symbol is its own hue mixed 22% into paper (`color-mix(in srgb, currentColor 22%, var(--paper))`). It is never a separate grey.

## Typography

**Display Font:** Noto Sans HK, from a local Latin-subset woff2 (weights 100 to 900), with Helvetica Neue and Arial as fallbacks.
**Body Font:** The same family.
**Punctuation:** A local "Latin Punctuation" face (Segoe UI, Helvetica Neue or Arial) listed first in the stack, limited to U+2013-2014, U+2018-201D and U+2026. It exists because Noto Sans HK sets curly quotes, dashes and the ellipsis at CJK full width.

**Character:** A plain, slightly geometric grotesque. It labels a chart rather than performing. Weight carries the hierarchy (700 for headings and figures, 500 for questions and labels, 400 for prose), and slight negative tracking tightens the large sizes.

The root size is fluid: `html { font-size: clamp(15px, 1.25vw, 18px) }`. Every size below is in rem, so the whole chart scales with it. Tabular figures are on for the whole body.

### Hierarchy
- **Brand** (700, 1.29rem, -0.03em): the wordmark in the top bar. It drops to 1.1rem below 560px.
- **Display** (700, 2.3125rem, 1.2, -0.012em): the single-line page question and the Sources intro heading. It becomes `clamp(1.75rem, 5.2vw, 2.3125rem)` below 1000px.
- **Headline** (700, 1.95rem, 1.22, -0.01em): the result statement, max 30ch. It becomes 1.6rem below 1000px and 1.4rem below 560px.
- **Title** (700, 1.12rem, 1.5rem): section heads such as Water and Animal lives. Source section heads use 1.35rem.
- **Question** (500, 1.09rem, 1.6rem): the legend of each step.
- **Numeral** (700, 1.6rem, 1.1): large per-row counts in Animal lives. Table figures use 700 at 1.1rem.
- **Body** (400, 1rem, 1.5): row labels, prose. Measure 60–75ch.
- **Subhead** (500–700, 1.35rem): the Animal lives lead, Sources section heads, and the result statement below 560px.
- **Caption** (400, 0.95rem): chart keys, water captions, table body, notes.
- **Button** (400, 0.875rem): solid button labels, sized so the step panel's longest label sits on one line.
- **Small** (400, 0.9rem): step counts, segmented controls, method and Animal lives detail text.
- **Label** (500, 0.82rem): control labels, table headers, ranges and hints in Graphite or Pencil Grey.
- **Tag** (500, 0.75rem): reference chips and the "modelled" and "derived" tags.

### Named Rules
**The One Family Rule.** One sans, weights 400, 500 and 700. No second display face, no italics for emphasis, no all-caps labels.

**The Stated Unit Rule.** Every pictogram row has a key in body type that names the unit ("Each symbol = 5 kg CO₂e"). The unit is fixed: switching units as the inputs change makes the same symbol mean different amounts, which confuses readers.

## Layout

The page is a full-bleed chart with a 0.9375rem side margin and no centred container. The calculator is a stack of ruled rows. Each row is a three-column grid: label column (12.8rem), symbols (`minmax(0, 1fr)`) and panel column (17.5rem), with a 0.4rem gutter. Water and result sections use two columns (symbols or prose, then panel). Animal lives keeps the label column, and its lead, note, call to action and footnotes are indented by `label-col + gutter` so they hang on the chart's text line.

The first viewport, as shipped at 1280×720: top bar (3.2rem), rule, one-line display question, rule, AI row (min 4.6875rem), rule, diet row (min 25.4375rem). In the diet row the label sits top-left and the key bottom-left, the before and after walls fill the middle (each under a caption naming the diet and its total, split by a 1px rule), and the step panel is in the right column. The Water heading starts at the bottom edge.

Pictogram sizes are set by the row, not the data. Base sizes are AI chat bubbles 3.125rem, diet clouds 1.5625rem, water drops 1.375rem, animal symbols 1.35rem. Units are fixed (5 kg, 100 L, one animal, one year). Any amount above zero shows at least a tenth of a symbol. When a row's count passes its cap (AI 6, before and after walls 200 with one shared scale, water 36, month clouds 60, month years 18, animals 150), a scale `--k = sqrt(cap / count)` (with a floor) shrinks that row's symbols and gaps so the block keeps roughly its size. Both water rows share one scale.

Responsive: below 1000px the label and panel columns shrink to 9rem and 15rem. Every chart row collapses to one column (label, symbols, key, panel), the wall's minimum height goes, and the step panel adds a one-line tally. Below 560px the symbols shrink (AI 2.5rem, clouds 1rem), and result-table rows re-flow into two-column cards separated by rules.

## Elevation & Depth

The system is flat. There are no drop shadows, no gradients and no tonal layering. Depth comes only from Panel White sitting on Chart Paper inside a 1.5px ink border, and from rule weight. Box-shadow appears only as a stroke technique: a white inset ring that turns the checked radio into a ring-and-dot, and a 1.5px ink ring round the slider thumb. It never sits under a surface.

### Named Rules
**The Flat Sheet Rule.** Nothing floats. If a surface needs separation, give it a white fill and a 1.5px ink border, or a rule. Never a shadow.

## Shapes

Every corner is square (radius 0): buttons, panels, segments, tags, slider thumbs and the details toggle. The only round form is the radio well, a 1.05rem circle in a 1.5px ink stroke. Line weight is a three-step scale: 0.125rem ink rules between major rows, 1.5px ink borders round interactive surfaces, and 1px ink or Hairline lines inside tables and sub-charts. The pictograms are filled silhouettes masked from inline SVG data URIs, with no outline and no internal detail beyond cut-outs (bubble dots, fish eye).

### Named Rules
**The Cut Not Round Rule.** A fractional quantity is a symbol cropped from the left to a width of `size × fraction`, over its own ghost. Never round to a whole symbol, and never show the fraction as a number inside the symbol row.

## Components

### Buttons
Blunt and solid, like a printed block.
- **Shape:** square (0).
- **Primary:** ink fill, white text, 0.875rem at weight 400, min height 2.6875rem. Fills its row in the step nav, and sizes to content elsewhere.
- **Hover / Active:** fill lightens to Graphite, then to Pencil Grey. No transition and no movement.
- **Focus:** 2px ink outline, 3px offset (the global focus style).
- **Link button:** text-only "Back", underlined at 0.2em offset; the underline thickens to 2px on hover.

### Segmented controls
- **Style:** a white strip in a 1.5px ink border. Segments are split by 1.5px ink lines, and the text is 0.88rem.
- **State:** the selected segment is ink with white text at weight 500. Hover fills #ececec. Focus draws a 2px ink outline on the segment.

### Step panel
- **Container:** Panel White, 1.5px ink border, square, 0.8125rem 0.9rem padding. It sits in the panel column of the diet row.
- **Contents:** step count (Small, 0.9rem), legend in Question type, a single column of radio rows (min 2rem), hints in Label grey, and sliders separated by a Hairline top rule.
- **Radios:** a 1.05rem circle with a 1.5px ink stroke on white. The stroke thickens to 2.5px on hover. When checked, it becomes a filled dot inside a white inset ring, and the label goes to weight 500.
- **Sliders:** 4px track, ink-filled up to the value and Hairline after it. The thumb is a square 1.1rem ink block with a white border and an ink ring. The output value is set at 700, 1.15rem.
- **Notice:** a variant of the hint for a blocked choice, a tinted block with no border.

### Navigation
- **Top bar:** 3.2rem tall, ruled below. The wordmark is on the left, and two text tabs on the right with a 1.5rem gap. The selected tab is weight 600 with no underline. Other tabs underline on hover. The bar does not change on mobile; only the type gets smaller.

### Tables
- **Result table:** each row has a 1px ink rule on top. The header is Label grey with no rule. Figures are 700 at 1.1rem, and ranges sit under them in Pencil Grey. A water tag is a 1px Burnt Umber outline at 0.72rem.
- **Data table (Sources):** a heavy rule on top, a 1px ink rule under the header, Hairline between rows, and the basis column in Graphite.
- **Reference tag:** a square, 1px-ink-bordered white tag at 0.75rem weight 500. It inverts to ink on hover.

### Pictogram row (signature)
The defining component. Each symbol is an `<i>` whose width is `--s × --f` and whose height is `--s / --ar`. It is filled with `currentColor` through a mask, left-aligned, from the shared SVG data URIs (chat, cloud, drop, hen, fish, chick, calf, mouse, plane).

### Flights, for scale
A second disclosure, styled like Animal lives and placed above it. Inside, three ruled rows on the label / symbols grid (flight planes in ink, diet saving clouds in blue-grey, AI chat bubbles in red) share one 5 kg CO2e unit, a single shared size scale (cap 200, floor 0.3) and a 1.5625rem base size, so the rows compare directly. A white bordered panel in the panel column holds the destination radios. Rows are wrapping flex runs with fixed gaps. When the data changes, only the newly added symbols animate: opacity from 0 and a move from -0.4rem at 0.55 scale, over 0.5s, `cubic-bezier(0.16, 1, 0.3, 1)`, staggered across 500ms. A cut symbol arrives last, at 500ms, drawn over a faint whole ghost.

### Disclosure (Animal lives)
A full-width `<details>`, ruled below. The summary keeps the label-column grid, and a 2.25rem square white toggle with a 1.5px ink border holds an SVG chevron. On hover the toggle inverts to ink. On open the chevron turns 180° over 0.4s. The body expands through `interpolate-size: allow-keywords` and a `::details-content` block-size transition (0.45s, same curve). The animal pictograms are black (hen, fish, chick, calf), each row with its count in Numeral type and its unit in Pencil Grey.

### Motion
There are two kinds of motion: symbols growing in, and the disclosure expanding. Both use `cubic-bezier(0.16, 1, 0.3, 1)`. Under `prefers-reduced-motion: reduce` the symbols appear without animation, the disclosure and chevron do not transition, and smooth scrolling is off.

## Do's and Don'ts

### Do:
- **Do** show every quantity as a count of identical symbols at one size per row and a fixed unit, with a key that names the unit.
- **Do** cut the last symbol to its fraction over a 22% ghost of its own hue.
- **Do** keep pictogram hues to their one quantity (red AI, graphite diet CO2e before, blue-grey diet CO2e after, ochre diet water, black animals), and use diet-ink or water-ink when that quantity appears in text.
- **Do** separate major rows with 0.125rem ink rules, and put every row on the label / symbols / panel grid (12.8rem / 1fr / 17.5rem).
- **Do** keep controls square: white fill, 1.5px ink border, solid ink for buttons and selected states.
- **Do** size type in rem against the `clamp(15px, 1.25vw, 18px)` root, and keep the Latin Punctuation face first in the font stack.

### Don't:
- **Don't** scale one pictogram to show size, draw bar or pie charts, or round partial symbols away.
- **Don't** use rounded corners, drop shadows, gradients or cards floating on the paper.
- **Don't** bring back the leaf mark, the green palette, or a rounded result card with a leaf accent.
- **Don't** use Signal Red for anything that is not the AI quantity. It is not a selection colour or a warning colour.
- **Don't** set body text in blue-grey or ochre on paper.
- **Don't** add a second typeface, uppercase eyebrow labels, or icon-font glyphs. Icons are inline SVG.
