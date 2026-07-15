export interface GrowthStage {
  stageNumber: number;
  name: string;
  weeks: string;
  expect: string;
  care: string;
  water: string;
  pests: string;
}

export interface CropGrowthData {
  crop: string;
  duration: string;
  stages: GrowthStage[];
}

export const CROP_GROWTH_STAGES: Record<string, CropGrowthData> = {
  "Maize": {
    crop: "Maize",
    duration: "4 - 5 Months",
    stages: [
      {
        stageNumber: 1,
        name: "Emergence & Germination",
        weeks: "Weeks 1 - 2",
        expect: "Tiny green spikes push through the soil. First leaves begin to unroll.",
        care: "Keep shamba completely weed-free. Hand-pull weeds near tender shoots.",
        water: "Moderate. Soil should be moist but never soggy or waterlogged.",
        pests: "Watch for cutworms cutting stems at night and early birds digging seeds."
      },
      {
        stageNumber: 2,
        name: "Vegetative Development",
        weeks: "Weeks 3 - 7",
        expect: "Rapid growth with thick green stalks and broad leaves emerging daily.",
        care: "Apply first top-dressing fertilizer (such as CAN or Urea) when knee-high (week 4-5).",
        water: "High. Leaf canopy expands and water demand increases significantly.",
        pests: "Pest alert: Look deep in leaf whorls for Fall Armyworm damage (window-pane holes)."
      },
      {
        stageNumber: 3,
        name: "Flowering & Tasseling",
        weeks: "Weeks 8 - 10",
        expect: "Golden tassels emerge at the top; delicate pink/yellow silks form on developing cobs.",
        care: "Do not stress the crop now; any stress during pollination severely reduces yield.",
        water: "Critical. Maize needs peak watering during tasseling and silk emergence.",
        pests: "Watch for maize stalk borers and early aphids on the green tassels."
      },
      {
        stageNumber: 4,
        name: "Grain Fill & Maturity",
        weeks: "Weeks 11 - 16+",
        expect: "Kernels swell, turning sweet and yellow. Silks dry out and turn dark brown.",
        care: "Let the cobs dry naturally on the stalks until husks turn straw-yellow.",
        water: "Low. Gradually reduce watering as cobs reach full size and dry.",
        pests: "Protect ripening cobs from maize weevils, storage pests, and foraging birds."
      }
    ]
  },
  "Beans": {
    crop: "Beans",
    duration: "2.5 - 3 Months",
    stages: [
      {
        stageNumber: 1,
        name: "Germination & Cotyledon",
        weeks: "Weeks 1 - 2",
        expect: "Seed pods swell and bean cotyledons arch up through the dirt.",
        care: "Gently loosen compacted surface crust to help seedlings push through.",
        water: "Low. Excess wetness triggers seed rot. Damp soil is perfect.",
        pests: "Watch for bean flies laying eggs on leaves; look for tiny yellow punctures."
      },
      {
        stageNumber: 2,
        name: "Vegetative & Branching",
        weeks: "Weeks 3 - 5",
        expect: "Trifoliate leaves spread out. Climbing varieties start sending out search vines.",
        care: "Provide stakes or trellises for climbers; clear all surrounding weeds.",
        water: "Moderate. Water at the base of the plant to keep leaves dry.",
        pests: "Inspect lower leaf surfaces for black bean aphids and foliage beetles."
      },
      {
        stageNumber: 3,
        name: "Flowering & Pod Set",
        weeks: "Weeks 6 - 8",
        expect: "Clusters of white, pink, or purple blossoms appear, followed by tiny green pods.",
        care: "Avoid weeding during peak flowering to prevent knocking off blossoms.",
        water: "High. Water stress now causes flowers to drop off without setting pods.",
        pests: "Pest watch: Look out for thrips inside flowers and green stink bugs sucking pods."
      },
      {
        stageNumber: 4,
        name: "Pod Fill & Drying",
        weeks: "Weeks 9 - 12",
        expect: "Leaves yellow and drop; pods turn pale tan, dry up, and seeds rattle inside.",
        care: "Stop watering completely. Harvest during dry weather to prevent mold.",
        water: "None. Keep roots dry so pods can cure properly.",
        pests: "Beware of bean weevils (bruchids) attacking dried pods in the field."
      }
    ]
  },
  "Tomatoes": {
    crop: "Tomatoes",
    duration: "3 - 4.5 Months",
    stages: [
      {
        stageNumber: 1,
        name: "Seedling & Transplanting",
        weeks: "Weeks 1 - 3",
        expect: "Delicate seedlings develop true jagged leaves. Stems strengthen.",
        care: "Transplant to shamba on a cool, cloudy afternoon. Bury stem deep for extra roots.",
        water: "Moderate. Water transplanted seedlings daily until established.",
        pests: "Look out for cutworms chewing stems and whiteflies under leaves."
      },
      {
        stageNumber: 2,
        name: "Vegetative & Trellising",
        weeks: "Weeks 4 - 6",
        expect: "Bushy branches extend. Leaf canopy turns rich, fragrant dark green.",
        care: "Stake plants upright, prune lower suckers (shoots in branch elbows) for airflow.",
        water: "Consistent. Avoid dry-to-soggy swings to prevent cracked stems.",
        pests: "Watch for Leaf Miners leaving silver tracks and Early Blight brown rings."
      },
      {
        stageNumber: 3,
        name: "Flowering & Fruit Set",
        weeks: "Weeks 7 - 9",
        expect: "Yellow flowers bloom. Small green globes appear where flowers fade.",
        care: "Apply calcium-rich organic feed or ash to prevent black bottoms (blossom end rot).",
        water: "High. Deep, regular watering. Never splash water on foliage to prevent fungus.",
        pests: "Check fruits for Tuta Absoluta pinholes and tomato hornworm caterpillars."
      },
      {
        stageNumber: 4,
        name: "Ripening & Harvest",
        weeks: "Weeks 10 - 14+",
        expect: "Green fruits swell, transitioning beautifully to orange then deep crimson red.",
        care: "Harvest gently as they turn red. Prune yellowing old leaves at the base.",
        water: "Moderate. Slightly reduce water to concentrate sugars and flavor.",
        pests: "Watch for fruit borers (bollworms) boring into ripe tomatoes."
      }
    ]
  },
  "Coffee": {
    crop: "Coffee",
    duration: "Perennial (Annual Cycle)",
    stages: [
      {
        stageNumber: 1,
        name: "Nursery & Transplant",
        weeks: "Months 1 - 6",
        expect: "Healthy seedlings with glossy, dark green oval leaves grown in polybags.",
        care: "Provide 50% shade. Transplant to shamba in deep holes filled with compost at start of long rains.",
        water: "High. Keep young transplants well-mulched to retain moisture.",
        pests: "Watch for scales on stems and damping-off fungus in the roots."
      },
      {
        stageNumber: 2,
        name: "Establishment & Pruning",
        weeks: "Years 1 - 2",
        expect: "Lateral branches develop. Plant grows into a sturdy woody shrub.",
        care: "Prune weak branches and suckers. Cap the main stem at 1.5m to encourage easy plucking.",
        water: "Moderate. Established coffee is deeply rooted but loves compost mulch.",
        pests: "Inspect stems for coffee stem borer tunnels and leaf miner damage."
      },
      {
        stageNumber: 3,
        name: "Flowering (Jasmine Stage)",
        weeks: "Rainy Season",
        expect: "Clusters of snow-white, highly fragrant star-shaped flowers cover branches.",
        care: "Avoid any chemical sprays during blooming to protect pollinating bees.",
        water: "Critical. Triggers uniform flowering and determines final cherry count.",
        pests: "Watch for Antestia Bug sucking sap from tiny green flower buds."
      },
      {
        stageNumber: 4,
        name: "Cherry Ripening",
        weeks: "6 - 9 Months Post-Bloom",
        expect: "Green berries swell, turning yellow, then ripening into beautiful crimson cherries.",
        care: "Perform selective hand-picking of deep red cherries only. Do not strip branches.",
        water: "Moderate. Rain during ripening improves berry density and weight.",
        pests: "Look for Coffee Berry Borer pinholes at the blossom end of the cherries."
      }
    ]
  },
  "Tea": {
    crop: "Tea",
    duration: "Perennial (Continuous)",
    stages: [
      {
        stageNumber: 1,
        name: "Nursery & Rooting",
        weeks: "Months 1 - 9",
        expect: "Single-leaf stem cuttings develop delicate root networks in shaded sandy soil.",
        care: "Keep relative humidity high. Acidify soil with aluminum sulfate if pH rises.",
        water: "Frequent. Soft misting is ideal to keep nursery humid.",
        pests: "Watch for mites on leaves and root-knot nematodes in soil."
      },
      {
        stageNumber: 2,
        name: "Framing & Plucking Table",
        weeks: "Years 1 - 2",
        expect: "Pruning young bushes flat at specific heights to form a dense plucking table.",
        care: "Perform pegging (bending branches outward) to increase plucking area.",
        water: "Consistent. Young bushes need reliable rain/irrigation to establish canopy.",
        pests: "Watch out for thrips stunt-growing new shoots."
      },
      {
        stageNumber: 3,
        name: "Active Plucking & Flush",
        weeks: "Every 7 - 14 Days",
        expect: "Rapid emergence of soft, light green 'two leaves and a bud' shoot tips.",
        care: "Pluck selectively. Apply high-nitrogen NPK fertilizer twice a year before rains.",
        water: "High. Tea thrives under regular rains and misty morning humidity.",
        pests: "Inspect shoots for black tea aphids and red crevice mites."
      },
      {
        stageNumber: 4,
        name: "Pruning & Maintenance",
        weeks: "Every 3 - 4 Years",
        expect: "Plucking table becomes too tall or woody. Bush is cut back to trigger fresh flush.",
        care: "Prune flat with sharp shears. Apply copper fungicide to cut surfaces immediately.",
        water: "Moderate. Pruned bushes have fewer leaves to transpire but need root moisture.",
        pests: "Keep eye out for wood rot fungus on old pruned branches."
      }
    ]
  },
  "Potatoes": {
    crop: "Potatoes",
    duration: "3 - 4 Months",
    stages: [
      {
        stageNumber: 1,
        name: "Sprouting & Emergence",
        weeks: "Weeks 1 - 4",
        expect: "Chitted seed tubers send up sturdy dark green leafy sprouts through the soil.",
        care: "Keep soil loose. Hill/earth up soil around stems as soon as they reach 15cm high.",
        water: "Moderate. Keep soil damp but never waterlogged to prevent seed piece decay.",
        pests: "Watch for cutworms hiding in soil during day and chewing stems at night."
      },
      {
        stageNumber: 2,
        name: "Vegetative & Canopy",
        weeks: "Weeks 5 - 8",
        expect: "Vigorous branching creates a dense bushy row cover. Stolons begin growing underground.",
        care: "Hill up soil a second time to ensure developing tubers are buried deep away from sunlight.",
        water: "High. Canopy expansion requires plenty of water.",
        pests: "Pest alert: Look for Potato Tuber Moth larvae mining leaves or entering stems."
      },
      {
        stageNumber: 3,
        name: "Flowering & Tuber Initiation",
        weeks: "Weeks 9 - 11",
        expect: "Clusters of white, pink, or lilac flowers bloom. Stolons swell underground to start tiny tubers.",
        care: "Apply potassium-rich feed. Do not disturb the root zone where baby tubers are forming.",
        water: "Critical. Uneven watering now causes misshapen, knobby, or hollow-heart tubers.",
        pests: "Spray organic copper fungicide proactively to prevent devastating Late Blight."
      },
      {
        stageNumber: 4,
        name: "Bulking & Maturity",
        weeks: "Weeks 12 - 16",
        expect: "Tubers swell rapidly. Vines turn yellow, wither, and naturally die back.",
        care: "Stop watering 2 weeks before harvest to cure and toughen potato skins.",
        water: "None. Keep dry to prevent rot and skin blemishes.",
        pests: "Be careful of wireworms and rodents burrowing into maturing tubers."
      }
    ]
  },
  "Sukuma Wiki": {
    crop: "Sukuma Wiki",
    duration: "6+ Months Continuous",
    stages: [
      {
        stageNumber: 1,
        name: "Seedbed & Transplanting",
        weeks: "Weeks 1 - 3",
        expect: "Seedlings emerge quickly with two heart-shaped seed leaves, followed by round leaves.",
        care: "Transplant sturdy seedlings with pencil-thick stems. Space them 45cm apart.",
        water: "Moderate. Water morning and evening until transplant shock passes.",
        pests: "Protect from birds who love tender leaves, and watch for cutworms."
      },
      {
        stageNumber: 2,
        name: "Rapid Leaf Growth",
        weeks: "Weeks 4 - 8",
        expect: "Leaves expand into large, crinkled, thick blue-green fans in a lush rosette.",
        care: "Add nitrogen-rich organic manure around the base. Hand weed to avoid root damage.",
        water: "High. Collard greens are 90% water; keep soil consistently moist.",
        pests: "Aphid alert! Check leaf under-surfaces for clusters of green/grey aphids."
      },
      {
        stageNumber: 3,
        name: "Continuous Harvesting",
        weeks: "Weeks 9 - 24+",
        expect: "Outer lower leaves reach dinner-plate size, ready for weekly plucking.",
        care: "Pluck bottom leaves only, leaving at least 8 top leaves to feed the plant. Remove any yellow leaves.",
        water: "Consistent. Regular watering prevents leaves from becoming bitter and tough.",
        pests: "Watch for Diamondback Moth caterpillars making small windowpane holes."
      },
      {
        stageNumber: 4,
        name: "Flowering & Seed Set",
        weeks: "Weeks 25+",
        expect: "Center stem shoots upward rapidly, producing small bright yellow flowers.",
        care: "Uproot old woody stems to replant new seedlings, or leave flowers to dry for seeds.",
        water: "Low. Plant focuses energy on seeds rather than tasty foliage.",
        pests: "Watch for cabbage sawflies eating drying seed pods."
      }
    ]
  }
};
