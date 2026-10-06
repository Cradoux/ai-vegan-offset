/*
 * data.js - every number used by the calculator lives here, with the
 * source(s) it came from. The Sources tab is generated from this file, so
 * the page and its citations can never drift apart.
 */
(function (g) {
  "use strict";

  var data = {};

  /* ------------------------------------------------------------------ */
  /* References (shown in the Sources tab)                               */
  /* ------------------------------------------------------------------ */
  data.sources = [
    {
      id: "S1",
      title: "Dietary greenhouse gas emissions of meat-eaters, fish-eaters, vegetarians and vegans in the UK",
      authors: "Scarborough et al., Climatic Change 125, 179-192 (2014)",
      url: "https://doi.org/10.1007/s10584-014-1169-1",
      note: "Age- and sex-adjusted dietary emissions per 2,000 kcal/day for ~55,000 people in the EPIC-Oxford cohort. UK-based, and EPIC-Oxford participants are more health-conscious than average, so values for other people and countries will differ. The life-cycle data date from before 2014; S21 is a newer cross-check."
    },
    {
      id: "S2",
      title: "The Water Footprint of Diets: A Global Systematic Review and Meta-analysis",
      authors: "Harris et al., Advances in Nutrition 11(3), 2020",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7442390/",
      note: "Median European diet: 241 L/day blue water and 3,227 L/day total (blue + green). Compared with the \u201Caverage\u201D dietary pattern, diets with no animal-sourced foods had an 11.6% lower blue water footprint (95% CI 8.6% to 14.5%) and a 25.2% lower total footprint (95% CI 23.1% to 27.1%). Diets with reduced animal foods had a 5.6% lower blue footprint. The authors note the blue-water result depends on where studies were done."
    },
    {
      id: "S3",
      title: "Measuring the environmental impact of delivering AI at Google Scale",
      authors: "Google, 2025 (technical paper)",
      url: "https://arxiv.org/abs/2508.15734",
      note: "Measured in production: the median Gemini Apps text prompt uses 0.24 Wh, emits 0.03 gCO2e and consumes 0.26 mL of water. Energy includes idle capacity and data-centre overhead; active AI accelerators are 58% of it. The carbon figure is market-based (it counts Google's clean-energy purchasing) and includes embodied hardware emissions. The water figure is on-site cooling only. The data have not been independently verified."
    },
    {
      id: "S4",
      title: "Sam Altman: an average ChatGPT query uses 0.34 Wh and 0.000085 gallons of water",
      authors: "OpenAI CEO blog post, June 2025 (reported by The Verge)",
      url: "https://www.theverge.com/news/685045/sam-altman-average-chatgpt-energy-water",
      note: "Unsourced company statement with no published method, but broadly in line with independent estimates (S5, S36). 0.000085 US gallons is about 0.32 mL. Used as a cross-check on the central estimate."
    },
    {
      id: "S5",
      title: "How much energy does ChatGPT use?",
      authors: "Epoch AI, 2025",
      url: "https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use",
      note: "Independent estimate of roughly 0.3 Wh for a typical GPT-4o text query, rising to 2.5-40 Wh for very long inputs."
    },
    {
      id: "S6",
      title: "How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference",
      authors: "Jegham et al., 2025 (arXiv version 6)",
      url: "https://arxiv.org/abs/2505.09598v6",
      note: "Outside estimate built from public API performance data and assumed hardware, not direct measurement. In version 6: GPT-4o uses 0.42 Wh for a short query and 2.875 Wh for a long one (about 10,000 input tokens); GPT-5 at high reasoning effort averages 33.8 Wh for a long query; the most energy-intensive models exceed 29 Wh per long prompt. Earlier versions of the paper gave different figures."
    },
    {
      id: "S7",
      title: "Global Electricity Review 2026",
      authors: "Ember, 2026",
      url: "https://ember-energy.org/latest-insights/global-electricity-review-2026/",
      note: "Global average electricity carbon intensity: 458 gCO2e/kWh in 2025 (a record low). A location-based grid average, used to turn energy into carbon for every AI estimate."
    },
    {
      id: "S8",
      title: "Making AI Less 'Thirsty': Uncovering and Addressing the Secret Water Footprint of AI Models",
      authors: "Li, Yang, Islam & Ren, Communications of the ACM (2025)",
      url: "https://arxiv.org/abs/2304.03271",
      note: "GPT-3 training: an estimated 1,287 MWh and 700,000 L of on-site (cooling) water, or about 5.4 million L including water used to generate the electricity. At the US average, power generation consumes 3.142 L of water per kWh, and a GPT-3 request uses about 2.2 mL on-site and 16.9 mL in total."
    },
    {
      id: "S9",
      title: "Carbon Emissions and Large Neural Network Training",
      authors: "Patterson et al., 2021",
      url: "https://arxiv.org/abs/2104.10350",
      note: "Detailed accounting of training energy and emissions for large models (e.g. GPT-3: 1,287 MWh, 552 tCO2e)."
    },
    {
      id: "S10",
      title: "We did the math on AI's energy footprint. Here's the story you haven't heard.",
      authors: "O'Donnell & Crownhart, MIT Technology Review, May 2025",
      url: "https://www.technologyreview.com/2025/05/20/1116327/ai-energy-usage-climate-footprint-big-tech/",
      note: "Reports an estimate that training GPT-4 consumed 50 GWh. OpenAI has not published the figure, so treat it as approximate."
    },
    {
      id: "S11",
      title: "Training AI models doesn't emit that much (summary of GPT-4 training estimates)",
      authors: "Andy Masley (blog post)",
      url: "https://blog.andymasley.com/p/training-ai-models-doesnt-emit-that",
      note: "Collects GPT-4 estimates: Stanford AI Index (Epoch method) about 5,184 tCO2e for the final run; Ludvigsen about 12,500-15,000 tCO2e (S12); and a typical multiplier of about 2.2x for experiments and failed runs. A secondary source, used here only for the 5,184 t figure and the 2.2x multiplier."
    },
    {
      id: "S12",
      title: "The carbon footprint of GPT-4",
      authors: "Kasper Groes Albin Ludvigsen, Towards Data Science (2023)",
      url: "https://towardsdatascience.com/the-carbon-footprint-of-gpt-4-d6c676eb21ae/",
      note: "Estimates 51.8-62.3 GWh and 12,456-14,994 tCO2e for GPT-4's final run on a California-average grid, from leaked hardware details. Used as a cross-check on the central estimate."
    },
    {
      id: "S13",
      title: "AI Index Report 2026, Chapter 1: Research and Development",
      authors: "Stanford HAI, 2026",
      url: "https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_1_research_development.pdf",
      note: "Estimates Grok 4 training emissions at about 72,816 tCO2e (2025), the largest figure reported for a single training run."
    },
    {
      id: "S14",
      title: "ChatGPT users send 2.5 billion prompts a day",
      authors: "TechCrunch / OpenAI via Axios, July 2025",
      url: "https://techcrunch.com/2025/07/21/chatgpt-users-send-2-5-billion-prompts-a-day/",
      note: "About 2.5 billion prompts a day, roughly 0.9 trillion a year, spread across all of ChatGPT's models. Used as a guide for how many prompts one model might serve while it is the default."
    },
    {
      id: "S15",
      title: "How do people actually use ChatGPT?",
      authors: "Epoch AI, 2026",
      url: "https://epoch.ai/latest/introducing-the-chatgpt-usage-explorer",
      note: "Weekly active members of a US YouGov panel sent about 4.3 prompts a day in July 2025. The median active panelist sent 36 messages in December 2025, counting replies, because a small group of heavy users sends most prompts. Used to anchor the 'light' usage level."
    },
    {
      id: "S16",
      title: "Everyday comparisons (illustrative approximations)",
      authors: "Rounded rules of thumb, not from a single study",
      url: "",
      note: "About 0.17 kgCO2e per km for an average petrol car and about 40 L for a 5-minute shower. They are only there to give the numbers a sense of scale."
    },
    {
      id: "S17",
      title: "AI Energy Score v2: Refreshed Leaderboard, now with Reasoning",
      authors: "Hugging Face and Salesforce (Luccioni, Gamazaychikov), December 2025",
      url: "https://huggingface.co/blog/sasha/ai-energy-score-v2",
      note: "Across the models tested, reasoning models used about 30 times more GPU energy on average than non-reasoning models, or the same model with reasoning switched off. Individual models ranged from about 150 to 700 times more, because they write far more tokens while thinking."
    },
    {
      id: "S18",
      title: "Power Hungry Processing: Watts Driving the Cost of AI Deployment?",
      authors: "Luccioni, Jernite & Strubell, ACM FAccT 2024",
      url: "https://arxiv.org/abs/2311.16863",
      note: "Measured 88 models across 10 tasks. The image-generation models averaged 2.9 kWh per 1,000 images (about 2.9 Wh each), with a median of 1.35 Wh and a worst case of 11.5 Wh. The study used default image sizes on older GPUs, so it reads high against newer setups."
    },
    {
      id: "S19",
      title: "AI Energy Score leaderboard: image generation",
      authors: "Hugging Face, 2025",
      url: "https://huggingface.co/spaces/AIEnergyScore/Leaderboard/raw/main/data/energy/image_generation.csv",
      note: "GPU energy per image at a fixed image size on H100 hardware: about 0.19 Wh for fast models such as SD-Turbo and 1.64 Wh for Stable Diffusion XL, the most energy-hungry model listed. GPU only, so overheads such as cooling and idle capacity are not included."
    },
    {
      id: "S20",
      title: "What did it take to train Grok 4?",
      authors: "Epoch AI, 2025",
      url: "https://epoch.ai/data-insights/grok-4-training-resources",
      note: "Estimates that training Grok 4 used 310 GWh of electricity and about 750 million L of water. Because the site ran largely on gas turbines, Epoch puts the emissions at about 154,000 tCO2e, roughly double the AI Index figure (S13)."
    },
    {
      id: "S21",
      title: "Vegans, vegetarians, fish-eaters and meat-eaters in the UK show discrepant environmental impacts",
      authors: "Scarborough et al., Nature Food 4, 565-574 (2023)",
      url: "https://doi.org/10.1038/s43016-023-00795-w",
      note: "Links diets of 55,504 EPIC-Oxford participants to a review of 570 life-cycle assessments. Vegans' dietary impacts were 25.1% of high meat-eaters' for greenhouse gas emissions and 46.4% (95% UI 21.0% to 81.0%) for water use. Used as a cross-check: it finds much larger diet water differences than the scaling used here."
    },
    {
      id: "S22",
      title: "Agriculture in the United Kingdom 2025, Chapter 8: Livestock",
      authors: "Defra (UK Department for Environment, Food & Rural Affairs), 2026",
      url: "https://www.gov.uk/government/statistics/agriculture-in-the-united-kingdom-2025/chapter-8-livestock",
      note: "UK slaughter in 2025: 1,130 million table chickens, 30 million culled laying hens, 7 million turkeys, 11 million ducks and geese, 10.2 million pigs, 13.3 million sheep and lambs, 2.0 million prime cattle, 97,000 calves and 621,000 cows and adult bulls. Home-fed production met 80% of UK poultry supply, 67% of pig meat, 84% of beef, 103% of lamb, 88% of eggs and 105% of liquid milk. June herds: 1.85 million dairy cows and 1.29 million beef cows."
    },
    {
      id: "S23",
      title: "Opinion on alternatives to culling newly hatched chicks in the egg and poultry industries",
      authors: "Animal Welfare Committee (UK government advisory body), 2024",
      url: "https://assets.publishing.service.gov.uk/media/65eae6e062ff48ff7487b270/AWC_Opinion_on_chick_culling_alternatives.pdf",
      note: "About 40 to 45 million male chicks hatched into laying lines are killed each year in Great Britain, because laying breeds grow too slowly to be reared economically for meat. Based on 2022 hatchery data. The main hatcheries also supply the Republic of Ireland."
    },
    {
      id: "S24",
      title: "RFI 6634: number of male calves killed in slaughterhouses and on farm",
      authors: "Rural Payments Agency, 2023",
      url: "https://www.gov.uk/government/publications/rfi-6634-number-of-male-calves-killed-in-slaughterhouses-and-on-farm",
      note: "In 2022, 46,041 male calves aged under two months were killed in slaughterhouses and 33,451 on farms. The records do not say which herd the calves came from, so not all are dairy calves. The response does not state its area; the RPA's cattle records (BCMS) cover Great Britain, so it is treated as Great Britain only. An earlier industry estimate put dairy bull calves killed shortly after birth at about 95,000 in 2015 (S25)."
    },
    {
      id: "S25",
      title: "Position on surplus male production animals",
      authors: "British Veterinary Association, BCVA, BVPA and GVS, 2019",
      url: "https://www.bva.co.uk/media/3098/bva-bcva-bvpa-gvs-surplus-male-animals-position-oct-2019.pdf",
      note: "Male dairy calves often lack the traits wanted for beef, and in 2015 about 19% of dairy bull calves (around 95,000) were killed shortly after birth. Male layer chicks are killed at a day old, by gas or by instantaneous mechanical destruction. Used for the plain account of these practices."
    },
    {
      id: "S26",
      title: "Population estimates for the UK, England, Wales, Scotland and Northern Ireland: mid-2024",
      authors: "Office for National Statistics, 2025",
      url: "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/annualmidyearpopulationestimates/mid2024",
      note: "UK population 69,281,400 at mid-2024. Used to turn national animal counts into a figure per person."
    },
    {
      id: "S27",
      title: "Comparison of major protein-source foods and other food groups in meat-eaters and non-meat-eaters in the EPIC-Oxford cohort",
      authors: "Papier et al., Nutrients 11(4), 824 (2019)",
      url: "https://doi.org/10.3390/nu11040824",
      note: "Mean intakes by diet group, men and women, from about 30,000 EPIC-Oxford participants. Meat (red, processed and poultry): about 94 g a day for regular meat-eaters and 36 g for low meat-eaters. Fish: about 54 g a day for regular meat-eaters, 49 g for low meat-eaters and 56 g for fish-eaters. Vegetarians ate similar amounts of eggs to meat-eaters, less milk and more cheese."
    },
    {
      id: "S28",
      title: "Estimating global numbers of fishes caught from the wild annually from 2000 to 2019",
      authors: "Mood & Brooke, Animal Welfare 33, e6 (2024)",
      url: "https://doi.org/10.1017/awf.2024.7",
      note: "Converts FAO catch tonnages into numbers of fish using estimated mean weights. In 2019, 980 to 1,900 billion wild fish were caught, excluding illegal fishing, discards and bycatch. More than half of wild-caught fish are made into fishmeal and oil, much of it fed to farmed fish and livestock."
    },
    {
      id: "S29",
      title: "Estimating global numbers of farmed fishes killed for food annually from 1990 to 2019",
      authors: "Mood, Lara, Boyland & Brooke, Animal Welfare 32, e12 (2023)",
      url: "https://doi.org/10.1017/awf.2023.4",
      note: "About 124 billion farmed fish (78 to 171 billion) were killed for food in 2019. This excludes fish that die during rearing."
    },
    {
      id: "S30",
      title: "Effects of Diet Choices",
      authors: "Salazar, Animal Charity Evaluators, 2021",
      url: "https://animalcharityevaluators.org/wp-content/uploads/2024/09/Effects-of-Diet-Choices.pdf",
      note: "Estimates about 105 vertebrates spared per plant-based person per year, worldwide: about 79 wild-caught fish, 14 farmed fish and 12 land animals, assuming 3% of people eat plant-based. Used as the lower fish estimate, and for the plant-based share of the world population."
    },
    {
      id: "S31",
      title: "Population, total (SP.POP.TOTL)",
      authors: "World Bank, World Development Indicators",
      url: "https://data.worldbank.org/indicator/SP.POP.TOTL",
      note: "World population 7,696,159,728 in 2019. Used to turn global fish counts into a figure per person."
    },
    {
      id: "S32",
      title: "Dairy calf registrations: Lowest on record",
      authors: "AHDB (Agriculture and Horticulture Development Board), March 2025",
      url: "https://ahdb.org.uk/news/dairy-calf-registrations-lowest-on-record",
      note: "British Cattle Movement Service data: 1.48 million calves were registered to dairy dams in Great Britain in 2024. Northern Ireland is not included. In 2025, 60% of calves born to dairy dams had a beef sire, and most of those are reared for beef."
    },
    {
      id: "S33",
      title: "A survey of calf management practices and farmer perceptions of calf housing in UK dairy herds",
      authors: "Mahendran, Wathes, Booth & Blackie, Journal of Dairy Science 105(1), 409-423 (2022)",
      url: "https://doi.org/10.3168/jds.2021-20638",
      note: "Survey of 216 UK dairy farmers. 15.3% took calves from the cow immediately after birth, 38.8% within 12 hours, 26.4% within 24 hours and 11.6% within 36 to 48 hours. The longest any calf was left with its mother was 5 days."
    },
    {
      id: "S34",
      title: "Key performance indicators for the UK national dairy herd: 500 Holstein/Friesian herds, year ending 31 August 2025",
      authors: "Hanks, Kossaibati & Holt, University of Reading (VEERU), March 2026",
      url: "https://panlivestock.com/wp-content/uploads/2026/03/NMR500Herds-2025_Report_Final_17March26.pdf",
      note: "Median of 3.6 lactations when a cow leaves the herd, at a median age of 5.8 years. Each lactation starts with a calving, so this is about 3.6 calves per cow. The figure has been stable since 2016."
    },
    {
      id: "S35",
      title: "2024 Mid-year Population Estimates for Northern Ireland",
      authors: "Northern Ireland Statistics and Research Agency (NISRA), 2025",
      url: "https://datavis.nisra.gov.uk/population/2024-mid-year-estimates-for-northern-ireland.html",
      note: "Northern Ireland population 1,927,900 at mid-2024. Subtracted from the UK population (S26) to give 67,353,500 for Great Britain, which is used for counts that cover Great Britain only."
    },
    {
      id: "S36",
      title: "Energy use of AI inference, efficiency pathways, and test-time scaling",
      authors: "Oviedo, Kazhamiaka & Lavista Ferres (Microsoft), Joule, April 2026",
      url: "https://doi.org/10.1016/j.joule.2026.102430",
      note: "Peer-reviewed model of large models (over 200B parameters) served at production scale on H100 hardware, including the whole server and data-centre overhead (PUE). A typical query (500 input tokens, median 300 output tokens) uses a median of 0.31 Wh, interquartile range 0.16 to 0.60. A reasoning query with a median of 5,000 output tokens uses a median of 3.91 Wh, interquartile range 2.15 to 7.05. Agree with production measurements, and find widely cited estimates are 4 to 20 times too high. Modelled rather than measured, and newer hardware would use less. No water figures."
    },
    {
      id: "S37",
      title: "Field Deaths in Plant Agriculture",
      authors: "Fischer & Lamey, Journal of Agricultural and Environmental Ethics 31, 409-428 (2018)",
      url: "https://doi.org/10.1007/s10806-018-9733-8",
      note: "Reviews the evidence on wild animals killed growing crops, which the authors call very limited. Davis (2003) estimated 15 field animals killed per hectare a year, from mouse deaths at grain harvest and rat deaths at sugarcane harvest, counting animals taken by predators after harvest. Leaving out predation and correcting Archer's (2011) Australian estimate for how rarely mouse plagues occur, they arrive at roughly 1 death per hectare a year. Insects are not counted."
    },
    {
      id: "S38",
      title: "Total global agricultural land footprint associated with UK food supply 1986-2011",
      authors: "de Ruiter, Macdiarmid, Matthews, Kastner, Lynd & Smith, Global Environmental Change 43, 72-81 (2017)",
      url: "https://doi.org/10.1016/j.gloenvcha.2017.01.007",
      note: "In 2010 the UK food supply used 8,833 thousand ha of cropland at home and abroad, 5,176 thousand ha of it (about 826 m\u00B2 per person) to grow animal feed. About 87% of barley and 93% of soya beans went to feed. Feed was split about 29% pig meat, 24% beef, 19% milk, 16% poultry, 7% mutton and 5% eggs. Cropland for feed supplied only 18% of calories and 26% of protein; grassland supplied 14% and 22%. Livestock products took 85% of the total land footprint but gave 48% of protein and 32% of calories."
    },
    {
      id: "S39",
      title: "If the world adopted a plant-based diet, we would reduce global agricultural land use from 4 to 1 billion hectares",
      authors: "Hannah Ritchie, Our World in Data (2021), using Poore & Nemecek, Science 360, 987-992 (2018)",
      url: "https://ourworldindata.org/land-use-diets",
      note: "Poore and Nemecek estimate that 38% of the world's cropland grows livestock feed. In a world on a vegan diet, farmland would shrink from 4.1 to 1 billion hectares, and less cropland would be needed as well as less pasture, because more crops for people would take far less land than the feed crops they replace."
    }
  ];

  /* ------------------------------------------------------------------ */
  /* Diets                                                               */
  /* kgCO2e per day for a 2,000 kcal diet (Scarborough 2014)             */
  /* ------------------------------------------------------------------ */
  data.diets = [
    { id: "high_meat", label: "Meat-heavy", detail: "Meat most days (100 g or more a day)", kgCO2ePerDay: 7.19, src: ["S1"] },
    { id: "medium_meat", label: "Average meat-eater", detail: "Meat regularly (50 to 99 g a day)", kgCO2ePerDay: 5.63, src: ["S1"] },
    { id: "low_meat", label: "Occasional meat", detail: "A little meat (under 50 g a day)", kgCO2ePerDay: 4.67, src: ["S1"] },
    { id: "pescatarian", label: "Pescatarian", detail: "Fish, but no meat", kgCO2ePerDay: 3.91, src: ["S1"] },
    { id: "vegetarian", label: "Vegetarian", detail: "No meat or fish; dairy and eggs", kgCO2ePerDay: 3.81, src: ["S1"] },
    { id: "vegan", label: "Vegan", detail: "No animal products", kgCO2ePerDay: 2.89, src: ["S1"] }
  ];

  /* Diet that "reduce meat" moves towards (all meat and fish removed). */
  data.meatFreeDietId = "vegetarian";
  /* Diet with no animal foods; the lowest footprint, and the water calibration point. */
  data.veganDietId = "vegan";

  /* ------------------------------------------------------------------ */
  /* Diet water footprint                                                */
  /* Baseline: median European diet (Harris 2020). Other diets are        */
  /* scaled from their carbon footprint, calibrated so that going from    */
  /* an average meat-eater to vegan matches Harris's pooled -11.6% (blue) */
  /* and -25.2% (total). The ranges are Harris's 95% CIs.                */
  /* ------------------------------------------------------------------ */
  data.dietWater = {
    baselineDietId: "medium_meat",
    blueLPerDay: 241,
    totalLPerDay: 3227,
    veganSaving: {
      blue: { central: 0.116, low: 0.086, high: 0.145 },
      total: { central: 0.252, low: 0.231, high: 0.271 }
    },
    reducedAnimalBlueSaving: 0.056,
    src: ["S2"]
  };

  /* ------------------------------------------------------------------ */
  /* AI inference, per text prompt                                       */
  /* Energy includes data-centre overhead. Carbon is location-based for  */
  /* every estimate. Water is on-site cooling; water used to generate    */
  /* the electricity is added on top.                                     */
  /* ------------------------------------------------------------------ */
  data.gridGCO2PerKWh = 458; /* S7 */
  data.electricityWaterLPerKWh = 3.142; /* S8, US average; L per kWh = mL per Wh */

  data.aiScenarios = {
    low: {
      label: "Lower estimate",
      summary: "A median Gemini prompt, as measured by Google",
      whPerPrompt: 0.24,
      mLWaterPerPrompt: 0.26,
      basis: "Energy and on-site water as reported. Carbon = energy \u00D7 global grid average; Google's own market-based figure is 0.03 g.",
      src: ["S3", "S7"]
    },
    central: {
      label: "Central estimate",
      summary: "A typical query to a large current model, modelled at production scale",
      whPerPrompt: 0.31,
      mLWaterPerPrompt: null, /* derived: Wh x Google on-site water per Wh */
      basis: "Median energy from the 2026 Joule study, close to OpenAI's stated 0.34 Wh and Epoch AI's 0.3 Wh. Carbon = energy \u00D7 global grid average; on-site water = energy \u00D7 Google's water per Wh.",
      src: ["S36", "S4", "S5", "S3", "S7"]
    },
    high: {
      label: "Higher estimate",
      summary: "A longer or costlier query: the upper quartile for large current models",
      whPerPrompt: 0.60,
      mLWaterPerPrompt: null, /* derived: Wh x Google on-site water per Wh */
      basis: "Upper quartile of energy from the 2026 Joule study. Carbon = energy \u00D7 global grid average; on-site water = energy \u00D7 Google's water per Wh.",
      src: ["S36", "S3", "S7"]
    }
  };

  /* ------------------------------------------------------------------ */
  /* Training, shared out across the prompts a model serves              */
  /* ------------------------------------------------------------------ */
  /* Water per MWh of training from GPT-3 (S8): on-site plus power generation. */
  data.trainingWater = {
    gpt3MWh: 1287,
    gpt3OnsiteLitres: 700000,
    gpt3TotalLitres: 5439000,
    src: ["S8", "S9"]
  };

  data.experimentMultiplier = 2.2; /* S11 */

  data.trainingScenarios = {
    low: {
      label: "Lower estimate",
      summary: "GPT-4-class final training run only, over many prompts",
      tCO2e: 5184,
      gwh: 50,
      lifetimePrompts: 1e12,
      src: ["S10", "S11"]
    },
    central: {
      label: "Central estimate",
      summary: "GPT-4-class including experiments and failed runs (5,184 t and 50 GWh \u00D7 2.2)",
      tCO2e: 5184 * data.experimentMultiplier,
      gwh: 50 * data.experimentMultiplier,
      lifetimePrompts: 3e11,
      src: ["S10", "S11", "S12", "S14"]
    },
    high: {
      label: "Higher estimate",
      summary: "A very large 2025 run (Grok 4) over fewer prompts",
      tCO2e: 72816,
      gwh: 310,
      lifetimePrompts: 1e11,
      src: ["S13", "S20"]
    }
  };

  /* ------------------------------------------------------------------ */
  /* Usage levels (assumed mixes)                                        */
  /* ------------------------------------------------------------------ */
  /*
   * Each level is a mix of three kinds of request per day:
   *   standard  - ordinary chat prompts
   *   reasoning - "thinking" / deep-research / agent-style prompts
   *   images    - generated images
   */
  data.usageLevels = [
    { id: "light", label: "Light", detail: "A few questions a day, about the average for regular chatbot users", standard: 5, reasoning: 0, images: 0,
      basis: "Close to the 4.3 prompts a day sent by weekly active users in a US panel. The median user sends far fewer.", src: ["S15"] },
    { id: "moderate", label: "Moderate", detail: "Regular help through the working day, now and then with thinking mode or an image", standard: 20, reasoning: 2, images: 1,
      basis: "Assumed mix", src: [] },
    { id: "heavy", label: "Heavy", detail: "AI is part of most of your tasks", standard: 60, reasoning: 10, images: 5,
      basis: "Assumed mix", src: [] },
    { id: "power", label: "Power user", detail: "Coding assistants, agents or long documents all day", standard: 150, reasoning: 50, images: 15,
      basis: "Assumed mix. Heavy agent use can involve far more calls than this, so raise the sliders if that is you.", src: ["S5"] }
  ];
  data.usageMax = { standard: 500, reasoning: 200, images: 100 };

  /* ------------------------------------------------------------------ */
  /* Reasoning prompts and image generation, per request                 */
  /* Reasoning energy is the 2026 Joule study's quartiles (S36).          */
  /* Carbon and water per Wh are taken from the standard-prompt estimate */
  /* of the same scenario, so the three kinds of request stay           */
  /* consistent with each other.                                         */
  /* ------------------------------------------------------------------ */
  data.reasoningScenarios = {
    low: { wh: 2.15, basis: "Lower quartile for a reasoning query (median 5,000 output tokens) to a large current model", src: ["S36"] },
    central: { wh: 3.91, basis: "Median for a reasoning query (median 5,000 output tokens) to a large current model, about 13 times a standard prompt", src: ["S36"] },
    high: { wh: 7.05, basis: "Upper quartile for a reasoning query to a large current model", src: ["S36"] }
  };

  /* GPU-only figures are scaled up to the whole system: accelerators are 58% of per-prompt energy (S3). */
  data.gpuToSystemFactor = 1 / 0.58;

  data.imageScenarios = {
    low: { gpuWh: 0.19, basis: "Fast image models on a fixed image size, GPU energy \u00D7 1.72 for the rest of the system", src: ["S19", "S3"] },
    central: { wh: 1.35, basis: "Median across the image-generation models tested, at default image sizes", src: ["S18"] },
    high: { wh: 2.907, basis: "Mean across the image-generation models tested; close to Stable Diffusion XL scaled to the whole system (about 2.8 Wh)", src: ["S18", "S19"] }
  };

  /* ------------------------------------------------------------------ */
  /* Everyday comparisons                                                */
  /* ------------------------------------------------------------------ */
  data.equivalents = {
    kgCO2ePerKmCar: 0.17,
    litresPerShower: 40,
    src: ["S16"]
  };

  /* ------------------------------------------------------------------ */
  /* Animal lives                                                        */
  /* Land animals and egg and dairy deaths: UK slaughter divided by the   */
  /* home-fed share of UK supply (so imports count too), per person.     */
  /* Counts that cover Great Britain only use the Great Britain          */
  /* population.                                                         */
  /* That national figure is treated as the average meat-eater's.        */
  /* Fish: global counts per person who eats animal products.            */
  /* ------------------------------------------------------------------ */
  data.animals = {
    ukPopulation: 69281400, /* S26 */
    niPopulation: 1927900, /* S35; Great Britain-only counts are divided by UK minus NI */

    /* Killed for meat. millions = UK slaughter in 2025; homeFed = share of UK supply. */
    meat: [
      { id: "chickens", label: "Chickens", millions: 1130, homeFed: 0.80, src: ["S22"] },
      { id: "turkeys", label: "Turkeys", millions: 7, homeFed: 0.80, src: ["S22"] },
      { id: "ducks", label: "Ducks and geese", millions: 11, homeFed: 0.80, src: ["S22"] },
      { id: "pigs", label: "Pigs", millions: 10.163, homeFed: 0.67, src: ["S22"] },
      { id: "sheep", label: "Sheep and lambs", millions: 13.348, homeFed: 1.03, src: ["S22"] },
      { id: "cattle", label: "Cattle and calves for beef", millions: 2.009 + 0.097, homeFed: 0.84, src: ["S22"] }
    ],

    /* Cows and adult bulls slaughtered, split between dairy and beef by herd size (an assumption). */
    culledCows: { millions: 0.621, dairyHerd: 1849, beefHerd: 1290, homeFed: 0.84, src: ["S22"] },

    eggs: {
      maleChicksMillions: { low: 40, high: 45 }, /* S23, Great Britain */
      culledHensMillions: 30, /* S22 */
      homeFed: 0.88,
      src: ["S22", "S23"]
    },

    dairy: {
      youngMaleCalves: 46041 + 33451, /* S24, under two months old, 2022, Great Britain */
      calvesBornMillions: 1.48, /* S32, Great Britain, 2024; all taken from their mothers within days (S33) */
      lifetimeCalves: 3.6, /* S34, median lactations at exit */
      homeFed: 1.05,
      src: ["S22", "S24", "S32", "S33", "S34"]
    },

    /* Fish killed per person who eats animal products, per year. */
    fish: {
      worldPopulation: 7696159728, /* S31, 2019 */
      plantBasedShare: 0.03, /* S30 */
      wildBillions: { low: 980, high: 1900 }, /* S28, 2019 */
      farmedBillions: { low: 78, central: 124, high: 171 }, /* S29, 2019 */
      lowPerPerson: 78.77 + 13.76, /* S30: wild + farmed */
      src: ["S28", "S29", "S30", "S31"]
    },

    /*
     * How much of each food a diet eats, relative to the average meat-eater.
     * Meat: grams a day, assumed 125 / 75 for the meat-heavy and average bands
     * (S1 sets them at 100 g or more, and 50 to 99 g); 36 g is the EPIC-Oxford
     * low meat-eater mean (S27). Fish: EPIC-Oxford means (S27).
     * Eggs and dairy are taken as the same for every diet that includes them.
     */
    meatGramsPerDay: { high_meat: 125, medium_meat: 75, low_meat: 36, pescatarian: 0, vegetarian: 0, vegan: 0 },
    fishFactor: { high_meat: 1, medium_meat: 1, low_meat: 49 / 54, pescatarian: 56 / 54, vegetarian: 0, vegan: 0 },
    eatsEggsAndDairy: { high_meat: true, medium_meat: true, low_meat: true, pescatarian: true, vegetarian: true, vegan: false },
    referenceDietId: "medium_meat"
  };

  /* ------------------------------------------------------------------ */
  /* Wild animals killed growing crops                                    */
  /* Cropland per person: UK food supply in 2010, at home and abroad,      */
  /* split into crops for people and crops for animal feed (S38). That     */
  /* is treated as the average meat-eater's. Feed cropland scales with     */
  /* the meat, milk and eggs a diet eats. Animal foods that are cut are    */
  /* replaced with plant foods grown on cropland: the lower estimate       */
  /* replaces their protein, the higher their calories (S38).              */
  /* Deaths per hectare a year: S37.                                       */
  /* ------------------------------------------------------------------ */
  data.cropDeaths = {
    perHectare: { low: 1, central: 8, high: 15 }, /* S37; central is the midpoint */
    feedM2PerPerson: 826, /* S38, 2010 */
    croplandKha: { food: 8833 - 5176, feed: 5176 }, /* S38, 2010 */
    feedShare: { meat: 0.29 + 0.24 + 0.16 + 0.07, dairy: 0.19, eggs: 0.05 }, /* S38 */
    /* Share of UK calories and protein from animal foods (grassland + feed cropland), S38 */
    animalSupply: { calories: 0.14 + 0.18, protein: 0.22 + 0.26 },
    src: ["S37", "S38"]
  };

  g.VO = g.VO || {};
  g.VO.data = data;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = data;
  }
})(typeof window !== "undefined" ? window : globalThis);
