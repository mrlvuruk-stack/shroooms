import axios from "axios";
import * as actionTypes from "../actionTypes/productsListTypes";

const FALLBACK_PRODUCTS = [
  // ── 1. SPONGES (5 items) ──
  {
    _id: "spg-1",
    name: "Bio-Cellulose Moisture Sponge",
    category: "Sponges",
    categorySlug: "sponges",
    image: "/prod_moisture_sponge.jpg",
    price: 199,
    unit: "Pack of 5",
    description: "Eco-friendly high-retention bio-cellulose moisture sponge designed for humidity control in grow chambers.",
    benefits: "100% Biodegradable · High Moisture Retention",
    badge: "Eco Essential"
  },
  {
    _id: "spg-2",
    name: "High-Density Aeration Foam Sponge",
    category: "Sponges",
    categorySlug: "sponges",
    image: "/category_sponges.jpg",
    price: 249,
    unit: "Pack of 10",
    description: "Autoclavable open-cell foam sponges for jar lid breathability and sterile filter plugs.",
    benefits: "Sterile Plug · High Temp Safe",
    badge: "Lab Favorite"
  },
  {
    _id: "spg-3",
    name: "Sterile Mycelium Filter Sponge Plugs",
    category: "Sponges",
    categorySlug: "sponges",
    image: "/prod_moisture_sponge.jpg",
    price: 299,
    unit: "Pack of 20",
    description: "Synthetic high-temperature filter sponges engineered for liquid culture jar lid ports.",
    benefits: "Reusable 121°C · Zero Mold Contamination",
    badge: "Pro Choice"
  },
  {
    _id: "spg-4",
    name: "Hydrophilic Moisture Matrix Sponge Block",
    category: "Sponges",
    categorySlug: "sponges",
    image: "/category_sponges.jpg",
    price: 349,
    unit: "Pack of 2",
    description: "Deep humidity reservoir sponge block that maintains constant relative humidity without standing water.",
    benefits: "Continuous Humidity · Long Lasting",
    badge: "Fruiting Essential"
  },
  {
    _id: "spg-5",
    name: "Agar Tissue Transfer Sponge Pad",
    category: "Sponges",
    categorySlug: "sponges",
    image: "/category_sponges.jpg",
    price: 179,
    unit: "Pack of 12",
    description: "Micro-porous lab sponge pads for swab wiping and sterile workspace preparation.",
    benefits: "Ultra Absorbent · Lint-Free",
    badge: "Clean Room"
  },

  // ── 2. ACCESSORIES (5 items) ──
  {
    _id: "acc-1",
    name: "Ultra-Fine Continuous Spray Mister",
    category: "Accessories",
    categorySlug: "accessories",
    image: "/category_accessories.jpg",
    price: 299,
    unit: "1 Unit (300ml)",
    description: "Provides an ultra-fine aerosol mist essential for maintaining optimal humidity for fruiting mushroom caps.",
    benefits: "Continuous Spray · Fine Droplets",
    badge: "Must Have"
  },
  {
    _id: "acc-2",
    name: "Precision Inoculation Scalpel Set",
    category: "Accessories",
    categorySlug: "accessories",
    image: "/prod_scalpel.jpg",
    price: 349,
    unit: "1 Handle + 10 Blades",
    description: "Sterile stainless steel scalpel set for agar tissue transfer, cloning, and clean culture work.",
    benefits: "Surgical Grade · Individually Wrapped",
    badge: "Pro Tool"
  },
  {
    _id: "acc-3",
    name: "Heavy-Duty Alcohol Sterilizer Lamp",
    category: "Accessories",
    categorySlug: "accessories",
    image: "/prod_alcohol_lamp.jpg",
    price: 399,
    unit: "1 Unit + 3 Wicks",
    description: "Glass laboratory alcohol burner lamp for flame sterilizing needles, loops, and scalpels inside Still Air Boxes.",
    benefits: "Soot-Free Flame · Heat Resistant Glass",
    badge: "Lab Essential"
  },
  {
    _id: "acc-4",
    name: "Still Air Box (SAB) Arm Port Rings",
    category: "Accessories",
    categorySlug: "accessories",
    image: "/category_accessories.jpg",
    price: 499,
    unit: "Set of 2 Rings",
    description: "Flexible silicone arm hole collars for converting plastic tubs into still-air inoculation enclosures.",
    benefits: "Air Tight Seal · Easy Installation",
    badge: "DIY Lab"
  },
  {
    _id: "acc-5",
    name: "Stainless Steel Flame Inoculation Loop",
    category: "Accessories",
    categorySlug: "accessories",
    image: "/prod_scalpel.jpg",
    price: 199,
    unit: "Pack of 2",
    description: "Nichrome metal wire loop on insulated brass handle for streak plating agar petri dishes.",
    benefits: "Rapid Heat & Cool · Durable Wire",
    badge: "Microbiology"
  },

  // ── 3. LIQUID CULTURE (6 items) ──
  {
    _id: "lc-1",
    name: "Lion's Mane Liquid Culture Syringe",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    image: "/box_lions_mane.jpg",
    price: 499,
    unit: "10 ml Syringe",
    description: "Lab-isolated Hericium erinaceus liquid mycelium broth with sterile 18G needle & alcohol pad.",
    benefits: "Fast Colonizing · High Nootropic Yield",
    badge: "Top Seller"
  },
  {
    _id: "lc-2",
    name: "Blue Oyster Liquid Culture Syringe",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    image: "/box_blue_oyster.jpg",
    price: 449,
    unit: "10 ml Syringe",
    description: "Aggressive Pleurotus ostreatus var. columbinus mycelial liquid culture syringe.",
    benefits: "Vigorous Growth · Heavy Yields",
    badge: "Beginner Friendly"
  },
  {
    _id: "lc-3",
    name: "Pink Oyster Liquid Culture Syringe",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    image: "/box_pink_oyster.jpg",
    price: 449,
    unit: "10 ml Syringe",
    description: "Tropical Pink Oyster isolated liquid culture. Fast colonizer suited for warm Indian climates.",
    benefits: "Warm Climate · Fast Mycelium",
    badge: "Exotic Strain"
  },
  {
    _id: "lc-4",
    name: "Reishi Liquid Culture Syringe",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    image: "/cultivar_reishi.jpg",
    price: 549,
    unit: "10 ml Syringe",
    description: "Ganoderma lucidum isolated liquid culture broth for medicinal conk & antler production.",
    benefits: "Adaptogen Pure Strain · Lab Tested",
    badge: "Medicinal Grade"
  },
  {
    _id: "lc-5",
    name: "Cordyceps Militaris LC Syringe",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    image: "/cultivar_cordyceps.jpg",
    price: 649,
    unit: "10 ml Syringe",
    description: "High-cordycepin strain isolated for liquid substrate broth inoculation.",
    benefits: "High Active Cordycepin · Pure Genetics",
    badge: "Potent Strain"
  },
  {
    _id: "lc-6",
    name: "Shiitake LC Syringe (3782 Cultivar)",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    image: "/category_liquid_culture.jpg",
    price: 499,
    unit: "10 ml Syringe",
    description: "Lentinula edodes high-yielding commercial cultivar LC syringe.",
    benefits: "Hardwood Log & Bag Ready · Dense Caps",
    badge: "Gourmet Grade"
  },

  // ── 4. FRESH MUSHROOMS (7 items) ──
  {
    _id: "p1",
    name: "Lion's Mane Mushroom (Fresh Gourmet)",
    category: "Fresh Mushrooms",
    categorySlug: "fresh-mushrooms",
    image: "/box_lions_mane.jpg",
    price: 499,
    unit: "150 Gm",
    description: "Premium gourmet Lion's Mane harvested fresh at dawn. Tender seafood-like flavor when seared.",
    benefits: "Harvested Fresh · Culinary Grade",
    badge: "New Arrival"
  },
  {
    _id: "p2",
    name: "King Oyster Mushroom (Fresh Gourmet)",
    category: "Fresh Mushrooms",
    categorySlug: "fresh-mushrooms",
    image: "/box_king_oyster.jpg",
    price: 349,
    unit: "150 Gm",
    description: "Dense, meaty King Oyster stems harvested fresh. Perfect for plant-based steak rounds.",
    benefits: "Gourmet Culinary Excellence",
    badge: "Chef's Choice"
  },
  {
    _id: "p3",
    name: "Pink Oyster Mushroom (Fresh Gourmet)",
    category: "Fresh Mushrooms",
    categorySlug: "fresh-mushrooms",
    image: "/box_pink_oyster.jpg",
    price: 399,
    unit: "150 Gm",
    description: "Vibrant tropical pink oyster mushroom clusters harvested fresh daily in Indore.",
    benefits: "Crisp Texture · Rich Flavor",
    badge: "Rare Find"
  },
  {
    _id: "p4",
    name: "Blue Oyster Mushroom (Fresh Gourmet)",
    category: "Fresh Mushrooms",
    categorySlug: "fresh-mushrooms",
    image: "/box_blue_oyster.jpg",
    price: 399,
    unit: "150 Gm",
    description: "Artisan-grade steel blue caps with mild anise aroma preferred by gourmet chefs.",
    benefits: "Tender Caps · Unique Flavor",
    badge: "Best Seller"
  },
  {
    _id: "p5",
    name: "Golden Oyster Mushroom (Fresh Gourmet)",
    category: "Fresh Mushrooms",
    categorySlug: "fresh-mushrooms",
    image: "/category_fresh_mushrooms.jpg",
    price: 429,
    unit: "150 Gm",
    description: "Sunshine yellow caps with subtle cashew nutty notes, grown on hardwood sawdust.",
    benefits: "Nutty Notes · Vibrant Color",
    badge: "Exotic Bloom"
  },
  {
    _id: "p6",
    name: "Elm Oyster Mushroom (Fresh Gourmet)",
    category: "Fresh Mushrooms",
    categorySlug: "fresh-mushrooms",
    image: "/category_fresh_mushrooms.jpg",
    price: 349,
    unit: "150 Gm",
    description: "Fleshy white caps with firm texture that hold up brilliantly in stir fries and curries.",
    benefits: "Fleshy Texture · Versatile Cook",
    badge: "Farm Harvest"
  },
  {
    _id: "p7",
    name: "Chestnut Mushroom (Fresh Gourmet)",
    category: "Fresh Mushrooms",
    categorySlug: "fresh-mushrooms",
    image: "/category_fresh_mushrooms.jpg",
    price: 479,
    unit: "150 Gm",
    description: "Crunchy bronze caps with a rich nutty flavor that stays snappy after roasting.",
    benefits: "Nutty & Snap Crunch · High Antioxidant",
    badge: "Gourmet Special"
  },

  // ── 5. DRIED MUSHROOMS (5 items) ──
  {
    _id: "dr-1",
    name: "Dried Shiitake Mushrooms (Whole Caps)",
    category: "Dried Mushrooms",
    categorySlug: "dried-mushrooms",
    image: "/category_dried_mushrooms.jpg",
    price: 399,
    unit: "100 Gm",
    description: "Sun-dried premium Shiitake caps. Rehydrates into intense umami broth for ramen and stews.",
    benefits: "Deep Umami · Long Shelf Life",
    badge: "Pantry Favorite"
  },
  {
    _id: "dr-2",
    name: "Dried Reishi Mushroom Slices",
    category: "Dried Mushrooms",
    categorySlug: "dried-mushrooms",
    image: "/cultivar_reishi.jpg",
    price: 599,
    unit: "100 Gm",
    description: "Sliced organic Red Reishi conks ready for brewing immunity-boosting herbal teas.",
    benefits: "Immune Support · Pure Brew",
    badge: "Wellness Choice"
  },
  {
    _id: "dr-3",
    name: "Dried Cordyceps Militaris Fruitbodies",
    category: "Dried Mushrooms",
    categorySlug: "dried-mushrooms",
    image: "/cultivar_cordyceps.jpg",
    price: 999,
    unit: "25 Gm",
    description: "Lab-cultivated vibrant orange Cordyceps strands rich in adenosine and cordycepin.",
    benefits: "Cellular Energy · VO2 Stamina",
    badge: "Superfood"
  },
  {
    _id: "dr-4",
    name: "Dried Lion's Mane Powder (Nootropic)",
    category: "Dried Mushrooms",
    categorySlug: "dried-mushrooms",
    image: "/box_lions_mane.jpg",
    price: 699,
    unit: "100 Gm",
    description: "Pure 100% Lion's Mane fruitbody powder. Stir into morning coffee or smoothie for focus.",
    benefits: "Brain Focus · 100% Pure Fruitbody",
    badge: "Nootropic"
  },
  {
    _id: "dr-5",
    name: "Dried Chaga Mushroom Tea Chunks",
    category: "Dried Mushrooms",
    categorySlug: "dried-mushrooms",
    image: "/category_dried_mushrooms.jpg",
    price: 799,
    unit: "150 Gm",
    description: "Wild harvested Siberian Chaga conk chunks rich in SOD antioxidants for daily tea infusion.",
    benefits: "Antioxidant Powerhouse · Low Acidity",
    badge: "Wild Harvest"
  },

  // ── 6. SPAWN (6 items) ──
  {
    _id: "spn-1",
    name: "Blue Oyster Grain Spawn",
    category: "Spawn",
    categorySlug: "spawn",
    image: "/box_blue_oyster.jpg",
    price: 399,
    unit: "1 kg Bag",
    description: "100% fully colonized organic grain spawn ready for inoculating straw or sawdust substrate.",
    benefits: "Fast Colonizing · High Yield",
    badge: "Grower Favorite"
  },
  {
    _id: "spn-2",
    name: "Pink Oyster Grain Spawn",
    category: "Spawn",
    categorySlug: "spawn",
    image: "/box_pink_oyster.jpg",
    price: 399,
    unit: "1 kg Bag",
    description: "High-vigor tropical Pink Oyster grain spawn ideal for warm climate cultivation.",
    benefits: "Warm Climate · Rapid Flush",
    badge: "Fast Crop"
  },
  {
    _id: "spn-3",
    name: "Lion's Mane Grain Spawn",
    category: "Spawn",
    categorySlug: "spawn",
    image: "/box_lions_mane.jpg",
    price: 499,
    unit: "1 kg Bag",
    description: "Premium Hericium erinaceus grain spawn for hardwood substrate bags.",
    benefits: "Nootropic Strain · Heavy Pinning",
    badge: "Gourmet Strain"
  },
  {
    _id: "spn-4",
    name: "King Oyster Grain Spawn",
    category: "Spawn",
    categorySlug: "spawn",
    image: "/box_king_oyster.jpg",
    price: 449,
    unit: "1 kg Bag",
    description: "Pleurotus eryngii master grain spawn for thick stem commercial block production.",
    benefits: "Meaty Stems · Dense Mycelium",
    badge: "Commercial Grade"
  },
  {
    _id: "spn-5",
    name: "White Oyster Grain Spawn",
    category: "Spawn",
    categorySlug: "spawn",
    image: "/category_spawn.jpg",
    price: 349,
    unit: "1 kg Bag",
    description: "Pleurotus florida commercial strain grain spawn. High environmental tolerance.",
    benefits: "High Flush Yield · Easy Cultivation",
    badge: "All-Season"
  },
  {
    _id: "spn-6",
    name: "Reishi Grain Spawn",
    category: "Spawn",
    categorySlug: "spawn",
    image: "/cultivar_reishi.jpg",
    price: 499,
    unit: "1 kg Bag",
    description: "Ganoderma lucidum grain spawn for hardwood log inoculation and antler grow bags.",
    benefits: "Medicinal Grade · Dense Colonizer",
    badge: "Adaptogen"
  },

  // ── 7. TOOLS & ACCESSORIES (6 items) ──
  {
    _id: "tool-1",
    name: "PP Bags with 0.2 Micron Filter Patch",
    category: "Tools & Accessories",
    categorySlug: "tools-accessories",
    image: "/prod_filter_bags.jpg",
    price: 399,
    unit: "Pack of 50 Bags",
    description: "Heavy-duty autoclavable polypropylene grow bags with breathable gas-exchange filter patch.",
    benefits: "Autoclavable 121°C · Mold Shield",
    badge: "Commercial Spec"
  },
  {
    _id: "tool-2",
    name: "Digital Thermo-Hygrometer Monitor",
    category: "Tools & Accessories",
    categorySlug: "tools-accessories",
    image: "/prod_hygrometer.jpg",
    price: 499,
    unit: "1 Unit",
    description: "High-precision digital gauge for measuring grow tent temperature & relative humidity.",
    benefits: "LCD Display · Dual Sensor Probe",
    badge: "Precision Gear"
  },
  {
    _id: "tool-3",
    name: "Agricultural Gypsum pH Buffer Powder",
    category: "Tools & Accessories",
    categorySlug: "tools-accessories",
    image: "/category_tools_accessories.jpg",
    price: 149,
    unit: "900 Gm",
    description: "Fine Calcium Sulfate powder to prevent grain clumping and enrich substrate minerals.",
    benefits: "Anti-Clump · Mineral Source",
    badge: "Substrate Additive"
  },
  {
    _id: "tool-4",
    name: "Hydrated Lime Cold Pasteurizer Powder",
    category: "Tools & Accessories",
    categorySlug: "tools-accessories",
    image: "/category_tools_accessories.jpg",
    price: 199,
    unit: "1 kg Bag",
    description: "Low-magnesium Calcium Hydroxide for cold water straw pasteurization without heat.",
    benefits: "Heat-Free Sterilization · Fast Soak",
    badge: "Straw Master"
  },
  {
    _id: "tool-5",
    name: "Sterile Agar Petri Dishes with Parafilm",
    category: "Tools & Accessories",
    categorySlug: "tools-accessories",
    image: "/category_tools_accessories.jpg",
    price: 349,
    unit: "Pack of 10 Dishes",
    description: "Pre-poured sterile Malt Yeast Extract Agar (MYEA) petri dishes ready for tissue cloning.",
    benefits: "Sterile Sealed · High Clarity",
    badge: "Lab Ready"
  },
  {
    _id: "tool-6",
    name: "Autoclavable Self-Healing Injection Ports",
    category: "Tools & Accessories",
    categorySlug: "tools-accessories",
    image: "/category_tools_accessories.jpg",
    price: 249,
    unit: "Pack of 50 Ports",
    description: "20mm heavy silicone self-healing injection ports for liquid culture jar lids.",
    benefits: "100+ Syringe Punctures · High Temp Safe",
    badge: "Jar Mod"
  }
];

const vegetablesList = () => async (dispatch, getState) => {
  dispatch({
    type: actionTypes.VEGETABLE_LIST_REQUEST,
  });
  try {
    let { data } = await axios.get("/api/products");
    if (!data || !Array.isArray(data) || data.length === 0) {
      data = FALLBACK_PRODUCTS;
    }

    if (localStorage.getItem("cartItems")) {
      const cartProducts = getState().cart?.cartData?.vegetablesCart || [];
      cartProducts.forEach((cartItem) => {
        const index = data.findIndex((x) => x._id === cartItem._id);
        if (index > -1) {
          data[index] = { ...data[index], quantity: cartItem.quantity, purchasing: cartItem.purchasing };
        }
      });
    }

    dispatch({
      type: actionTypes.VEGETABLE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.warn("Product list fetch failed, using fallback:", error.message);
    dispatch({
      type: actionTypes.VEGETABLE_LIST_SUCCESS,
      payload: FALLBACK_PRODUCTS,
    });
  }
};

export const filteredProducts = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.VEGETABLE_FILTER_SEARCH,
    payload: value,
  });
};

export default vegetablesList;
