/* src/config/categoryConfig.js */

export const CANONICAL_CATEGORIES = [
  { id: "all", name: "All", slug: "all", icon: "✨", description: "View complete SHROOOMS collection" },
  { id: "sponges", name: "Sponges", slug: "sponges", icon: "🧽", description: "Bio-cellulose moisture & substrate sponges" },
  { id: "accessories", name: "Accessories", slug: "accessories", icon: "⚙️", description: "Spray misters, scalpels & cultivation tools" },
  { id: "liquid-culture", name: "Liquid Culture", slug: "liquid-culture", icon: "🧪", description: "Pure isolated liquid mycelium syringes" },
  { id: "fresh-mushrooms", name: "Fresh Mushrooms", slug: "fresh-mushrooms", icon: "🍄", description: "Freshly harvested gourmet cultivars" },
  { id: "dried-mushrooms", name: "Dried Mushrooms", slug: "dried-mushrooms", icon: "☀️", description: "Sun-dried caps, slices & tea blends" },
  { id: "spawn", name: "Spawn", slug: "spawn", icon: "🌾", description: "Fully colonized grain spawn bags" },
  { id: "tools-accessories", name: "Tools & Accessories", slug: "tools-accessories", icon: "🛠️", description: "Filter PP bags, hygrometers & supplements" }
];

export const getCanonicalCategoryName = (val) => {
  if (!val || val === "all" || val === "All" || val === "") return "All";
  const s = val.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (s.includes("sponge")) return "Sponges";
  if (s.includes("liquidculture") || s === "lc") return "Liquid Culture";
  if (s.includes("fresh")) return "Fresh Mushrooms";
  if (s.includes("dried")) return "Dried Mushrooms";
  if (s === "spawn" || s.includes("grainspawn")) return "Spawn";
  if (s.includes("tools")) return "Tools & Accessories";
  if (s.includes("accessory") || s.includes("accessories")) return "Accessories";
  return val;
};

export const matchesCategory = (productCategory, selectedCategory) => {
  if (!selectedCategory || selectedCategory === "all" || selectedCategory === "All" || selectedCategory === "") {
    return true;
  }
  const normProduct = getCanonicalCategoryName(productCategory);
  const normSelected = getCanonicalCategoryName(selectedCategory);
  return normProduct === normSelected;
};
