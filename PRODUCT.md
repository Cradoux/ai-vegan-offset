# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The main job is personal. Someone who uses AI opens the page to see their own water and carbon footprint next to what a change in how they eat could save, and to treat that diet change as making up for the AI use.

Two other audiences use the same result. Someone weighing eating less meat or going vegan uses their AI use as a familiar scale. A teacher, journalist, or advocate uses the sourced comparison to show other people.

## Product Purpose

Prompt & Plate teaches the relative environmental impact of eating meat and using AI. People tend to underestimate what eating meat costs the environment, while the environmental cost of AI is widely discussed. The calculator uses that public attention on AI as a way in. It estimates the water and carbon of a person's AI use and sets it beside the saving from a change on their plate, so the person can see the diet change as an offset for that use.

The page encourages people towards a plant-based diet. Success is that a visitor leaves understanding how large a diet change is compared with their AI use, and is more inclined to eat plant-based. The comparison has to be trustworthy enough for that to hold: their own inputs, a yearly result, and a source for every figure. There are no accounts and no saved results.

## Positioning

AI's footprint is the familiar scale, and food is the larger lever. A diet change is how someone makes up for their AI use, and a plant-based diet is where the page points. A neighbouring calculator that only illustrates the two footprints, without taking a side on what to eat, is not this product.

The page states the offset as "makes up for": one month of the diet change makes up for a span of AI use. The caveat says making up counts totals, and does not undo local effects near a data centre.

## Operating Context

One static page in a browser. The person answers three things: how they eat now, what they might change to (including cutting some meat and fish by a chosen share), and how much AI they use in a day (everyday chat, thinking or agent prompts, and generated images, from a preset or from sliders). The page then shows a year of AI use against the diet saving. A Sources tab lists the studies and assumptions behind the numbers. There is no login, no backend, and no stored session.

## Capabilities and Constraints

The calculator is plain HTML, CSS, and JavaScript (`index.html`, `styles.css`, `data.js`, `calc.js`, `app.js`). `data.js` is the only number store. The Sources tab is generated from it, so the page and its citations stay the same data.

Current behaviour, which is what the page does today:

- Diet ladder from published UK figures: meat-heavy, average meat-eater, occasional meat, pescatarian, vegetarian, vegan, plus a "cut some meat and fish" control.
- Usage presets (light, moderate, heavy, power user) and per-day sliders for chat, thinking or agent prompts, and images.
- A yearly water and carbon comparison, including how much AI use one month of the diet change makes up for, with car-kilometre and shower equivalents as scale only.
- Controls for a lower, central, or higher AI estimate, and for blue water versus total water. Total water is diet-only, because AI has no rainfall equivalent in the model.
- A "Flights, for scale" section, collapsed below the results, draws one economy return flight from the UK (a choice of six destinations) next to a year of the diet saving and a year of AI use, in the same 5 kg CO2e symbols. It is carbon only, includes non-CO2 effects (DESNZ 2025, S40), and is context, not part of the offset result.
- An "Animal lives" section, collapsed below the results, shows how many animals a year the chosen change would spare. It covers land animals, fish, and deaths in egg and dairy production (male chicks, laying hens, young male calves, dairy cows), explains each egg and dairy practice plainly, and offers a "Try a vegan diet" step back into the calculator.

Confirmed constraints:

- Every figure stays tied to a cited source, and the Sources tab stays generated from the same data as the calculation.
- Voice stays plain and non-judgmental: no guilt, no verdict, and no licence language. The offset is stated as a comparison of making up, not as permission to use AI.

Open:

- Whether the lower / central / higher ranges and the caveat block must stay as prominent as they are now was not locked. They are how the page works today.
- Whether diet figures must remain the published UK and European studies was not locked. That is the current basis (Scarborough et al. for carbon, Harris et al. for water).
- Whether the public name stays Prompt & Plate was not locked. That is the name on the page today. The repository folder is `AI-vegan-offset`.

## Brand Commitments

Voice: plain, non-judgmental English. No guilt, no verdict, and no language that treats the offset as a licence.

The current name on the page is Prompt & Plate, set as a plain wordmark. The favicon is the diet cloud pictogram. The name was not confirmed as permanent.

## Evidence on Hand

Citations and the numbers they support live in `data.js` (sources S1–S35), including Scarborough et al. 2014 and 2023, Harris et al. 2020, Google's 2025 Gemini measurement, OpenAI's stated ChatGPT query figure, Epoch AI, Jegham et al., Ember's grid intensity, and the training and image-generation sources listed there. Some usage mixes are labelled as assumptions and have no study.

Do not invent testimonials, user counts, customer stories, or impact claims that those sources do not state.

Animal-life figures are cited in `data.js` (S22–S31): Defra slaughter and supply statistics, the Animal Welfare Committee on male chicks, Rural Payments Agency calf records, BVA on surplus male animals, ONS population, EPIC-Oxford intakes (Papier et al.), FishCount estimates (Mood & Brooke), Animal Charity Evaluators, and World Bank population. Land, egg and dairy counts are UK and consumption-adjusted. Fish counts are global averages. Shellfish, bycatch, deaths before slaughter and wild animals are not counted.
## Product Principles

1. Use AI as the way in, and teach the relative scale. The visitor arrives worried about AI and leaves knowing food matters more.
2. Lead with the person's own year. Diet decisions and shared explanations use that same calculator, not a separate pitch.
3. A change on the plate is how someone makes up for their AI use, and plant-based is the direction the page encourages.
4. Every number traces to the cited dataset the page calculates from, including animal lives. The Sources tab is that dataset.
5. Encourage plainly. Make the case with evidence, without guilt or a verdict on the visitor.
