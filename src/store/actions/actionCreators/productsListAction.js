import axios from "axios";
import * as actionTypes from "../actionTypes/productsListTypes";

const FALLBACK_PRODUCTS = [
  // ── 1. SPONGES ──
  {
    _id: "spg-1",
    name: "Bio-Cellulose Mushroom Growing Sponge",
    category: "Sponges",
    categorySlug: "sponges",
    image: "/banner_nourish.jpg",
    price: 199,
    unit: "Pack of 5",
    description: "Eco-friendly high-retention bio-cellulose moisture sponge designed for humidity control in grow chambers.",
    benefits: "100% Biodegradable · High Moisture Retention",
    badge: "Eco Essential"
  },
  {
    _id: "spg-2",
    name: "High-Density Substrate Aeration Sponge",
    category: "Sponges",
    categorySlug: "sponges",
    image: "/banner_pouches.jpg",
    price: 249,
    unit: "Pack of 10",
    description: "Autoclavable open-cell foam sponges for jar lid breathability and sterile filter plugs.",
    benefits: "Sterile Plug · High Temp Safe",
    badge: "Lab Favorite"
  },

  // ── 2. ACCESSORIES ──
  {
    _id: "acc-1",
    name: "Ultra-Fine Continuous Spray Mister",
    category: "Accessories",
    categorySlug: "accessories",
    image: "/box_blue_oyster.jpg",
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
    image: "/cultivar_chaga.jpg",
    price: 349,
    unit: "1 Handle + 10 Blades",
    description: "Sterile stainless steel scalpel set for agar tissue transfer, cloning, and clean culture work.",
    benefits: "Surgical Grade · Individually Wrapped",
    badge: "Pro Tool"
  },

  // ── 3. LIQUID CULTURE ──
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

  // ── 4. FRESH MUSHROOMS ──
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
    image: "/shrooom.jpg",
    price: 429,
    unit: "150 Gm",
    description: "Sunshine yellow caps with subtle cashew nutty notes, grown on hardwood sawdust.",
    benefits: "Nutty Notes · Vibrant Color",
    badge: "Exotic Bloom"
  },

  // ── 5. DRIED MUSHROOMS ──
  {
    _id: "dr-1",
    name: "Dried Shiitake Mushrooms (Whole Caps)",
    category: "Dried Mushrooms",
    categorySlug: "dried-mushrooms",
    image: "/cultivar_chaga.jpg",
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

  // ── 6. SPAWN ──
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

  // ── 7. TOOLS & ACCESSORIES ──
  {
    _id: "tool-1",
    name: "PP Bags with 0.2 Micron Filter Patch",
    category: "Tools & Accessories",
    categorySlug: "tools-accessories",
    image: "/banner_pouches.jpg",
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
    image: "/value_innovation.jpg",
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
    image: "/value_premium_quality.jpg",
    price: 149,
    unit: "900 Gm",
    description: "Fine Calcium Sulfate powder to prevent grain clumping and enrich substrate minerals.",
    benefits: "Anti-Clump · Mineral Source",
    badge: "Substrate Additive"
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
