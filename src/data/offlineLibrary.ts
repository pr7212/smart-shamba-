export interface LibraryArticle {
  id: string;
  title: string;
  category: "Soil & Compost" | "Natural Pests" | "Water Saving" | "Crop Practices";
  summary: string;
  difficulty: "Easy" | "Medium" | "Expert";
  materials: string[];
  steps: string[];
  tips: string[];
}

export const OFFLINE_LIBRARY_ARTICLES: LibraryArticle[] = [
  {
    id: "composting-pit",
    title: "Step-by-Step Pit Composting",
    category: "Soil & Compost",
    summary: "Create rich, black soil nourishment using local farm organic waste. Pit composting retains moisture better than compost piles during dry East African seasons.",
    difficulty: "Easy",
    materials: [
      "Dry brown materials (maize stalks, dry leaves, straw)",
      "Green materials (kitchen waste, fresh grass, weeds)",
      "Animal manure (cow, chicken, or goat)",
      "Topsoil",
      "Ash (from cooking fires)"
    ],
    steps: [
      "Dig a pit of 1 meter deep by 1 meter wide in a shaded area of your shamba.",
      "Lay dry maize stalks or twigs at the bottom (about 10cm thick) for air circulation.",
      "Add a 15cm layer of green materials (grass clippings, kitchen waste) to provide nitrogen.",
      "Add a 5cm layer of animal manure to introduce beneficial soil microorganisms.",
      "Sprinkle a thin layer of topsoil and cooking wood ash to balance pH and reduce odor.",
      "Pour a bucket of water to ensure the layer is moist like a wrung-out sponge.",
      "Repeat these layers until the pit is full, then cover with soil or dry grass to keep heat in.",
      "Turn the compost every 2-3 weeks. It will be fully ready, rich, and dark in 3 to 4 months."
    ],
    tips: [
      "If the compost smells like ammonia, it is too wet or has too much green material. Turn it and add dry leaves.",
      "Check the heat by inserting a long stick; it should feel warm when pulled out after 10 minutes."
    ]
  },
  {
    id: "neem-chili-spray",
    title: "Homemade Neem & Chili Biopesticide",
    category: "Natural Pests",
    summary: "An organic insecticide spray to repel and kill sucking and chewing pests like aphids, whiteflies, thrips, and caterpillars without using toxic chemicals.",
    difficulty: "Medium",
    materials: [
      "1 kg of fresh Neem leaves (Mwarobaini)",
      "5-10 hot red chilies (bird's eye chilies)",
      "1 bulb of garlic",
      "1 tablespoon of bar soap (e.g., Jamaa or Sunlight bar, grated)",
      "5 liters of clean water"
    ],
    steps: [
      "Crush or grind the Neem leaves, hot chilies, and garlic into a thick paste.",
      "Mix the paste with 5 liters of water in a large bucket and stir thoroughly.",
      "Let the mixture soak overnight (12 to 24 hours) in a shady spot.",
      "Strain the mixture using a fine cloth or sieve to remove all leaf pieces (which block sprayers).",
      "Dissolve the grated soap in a cup of warm water and stir it into the strained liquid. The soap helps the spray stick to leaves.",
      "Dilute this mixture 1:1 with clean water before spraying on affected crops."
    ],
    tips: [
      "Spray early in the morning or late in the evening to avoid leaf burn under hot sunlight and protect bees.",
      "Target the undersides of leaves where pests like aphids and whiteflies hide."
    ]
  },
  {
    id: "zai-pits",
    title: "Zai Pits for Dryland Farming",
    category: "Water Saving",
    summary: "Traditional West African planting pits adapted for arid areas. Zai pits capture runoff rain water, preserve soil moisture, and concentrate fertilizers.",
    difficulty: "Medium",
    materials: [
      "Hand hoe or mattock",
      "Decomposed animal manure or compost",
      "Dry mulch (dry grass, maize husks)"
    ],
    steps: [
      "During the dry season, dig pits that are 20-30 cm wide and 15-20 cm deep.",
      "Space the pits 60-80 cm apart in rows, offset like bricks to capture water runoff down slopes.",
      "Mix the excavated topsoil with 1-2 handfuls of rich compost or animal manure.",
      "Fill the bottom of each pit with the soil-manure mixture, leaving a slight basin top to capture water.",
      "Plant 4-6 seeds of maize, millet, or sorghum in each pit when the first rains fall.",
      "Apply a layer of dry mulch inside and around the pit to stop water from evaporating."
    ],
    tips: [
      "Zai pits can double your harvest in low-rainfall seasons compared to flat-tilled land.",
      "You can reuse the same pits for up to 3 seasons, just adding a bit of fresh manure each time."
    ]
  },
  {
    id: "tithonia-liquid-manure",
    title: "Tithonia Liquid Fertilizer ('Plant Tea')",
    category: "Soil & Compost",
    summary: "Make a high-nitrogen liquid fertilizer from Wild Sunflower (Tithonia diversifolia) leaves, a weed common along East African roadsides.",
    difficulty: "Easy",
    materials: [
      "Fresh leaves and soft green stems of Tithonia",
      "A large plastic drum or bucket (20-100 liters)",
      "Clean water",
      "A heavy stone and a stick for stirring"
    ],
    steps: [
      "Chop fresh Tithonia leaves and green branches into small pieces.",
      "Fill the bucket or drum 3/4 full with the chopped green pieces.",
      "Fill the drum with clean water until it completely covers the plant material.",
      "Place a heavy stone on top of the leaves to keep them submerged.",
      "Cover the drum with a lid or cloth to prevent mosquitoes from breeding.",
      "Stir the mixture thoroughly with a stick every 3 days.",
      "After 2 weeks, the liquid will turn dark green and pungent. Strain out the leaves.",
      "Dilute the dark liquid with clean water (1 part tea to 2 parts water) until it looks like light tea."
    ],
    tips: [
      "Apply directly to the root zone of leafy crops like Sukuma Wiki or young maize once a week.",
      "The leftover decomposed Tithonia leaves can be thrown into your compost pit as an activator."
    ]
  },
  {
    id: "crop-rotation-plans",
    title: "Smart Crop Rotation for Yield & Pest Suppression",
    category: "Crop Practices",
    summary: "Break pest lifecycles and balance soil nutrients by rotating heavy feeders (like maize/potatoes) with nitrogen-fixers (like beans/cowpeas).",
    difficulty: "Easy",
    materials: [
      "A simple record book or map of your garden beds",
      "Seeds for 3 different crop families"
    ],
    steps: [
      "Divide your farming plot or garden beds into 3 or 4 distinct zones.",
      "Season 1: Plant heavy-feeding cereal crops (Maize, Sorghum) or brassicas (Sukuma wiki, Cabbage) in Zone A.",
      "Season 2: Follow with legume crops (Beans, Cowpeas, Groundnuts) in Zone A. Legumes have root nodules that fix nitrogen back into the soil.",
      "Season 3: Follow with root crops (Potatoes, Sweet potatoes, Cassava) in Zone A. Root crops feed on different nutrient depths and loosen the soil.",
      "Always rotate crops from different plant families; e.g., never plant Tomatoes right after Irish Potatoes, as they share the Late Blight disease."
    ],
    tips: [
      "Intercropping beans between rows of maize is also an excellent way to feed soil during the same season.",
      "Keep a small drawing in a notebook so you don't forget what was planted where last year."
    ]
  }
];
