/* ═══════════════════════════════════════════════
   SHROOOMS — MUSHROOM GUIDE CONFIGURATION
   Centralized, safe, evidence-based species data
   ═══════════════════════════════════════════════ */

export const MUSHROOM_GUIDE_DATA = [
  {
    id: "g1",
    slug: "lions-mane",
    commonName: "Lion's Mane",
    scientificName: "Hericium erinaceus",
    category: "gourmet",
    categoryLabel: "Gourmet & Culinary",
    shortDescription: "Distinctive white shaggy clusters with a tender, lobster-like texture and sweet umami aroma.",
    flavor: "Sweet, subtle, seafood-like notes",
    texture: "Meaty, fibrous, tender",
    bestFor: "Pan-searing in garlic butter, roasting, dry-searing steaks",
    image: "/box_lions_mane.jpg",
    imageAlt: "Fresh Lion's Mane mushroom cluster",
    productMatchNames: ["Lion's Mane Mushroom", "Lion's Mane"]
  },
  {
    id: "g2",
    slug: "king-oyster",
    commonName: "King Oyster",
    scientificName: "Pleurotus eryngii",
    category: "gourmet",
    categoryLabel: "Gourmet & Culinary",
    shortDescription: "Regal species featuring thick, dense stems that caramelize beautifully when seared.",
    flavor: "Rich, savory umami",
    texture: "Dense, firm, scallop-like",
    bestFor: "Slicing into thick rounds, scoring, pan-glazing, grilling",
    image: "/box_king_oyster.jpg",
    imageAlt: "Fresh King Oyster mushroom stems",
    productMatchNames: ["King Oyster Mushroom", "King Oyster"]
  },
  {
    id: "g3",
    slug: "pink-oyster",
    commonName: "Pink Oyster",
    scientificName: "Pleurotus djamor",
    category: "oyster",
    categoryLabel: "Oyster Varieties",
    shortDescription: "Striking tropical oyster variety featuring vibrant pink clusters and a pleasant woodsy profile.",
    flavor: "Woodsy, savory, warm notes",
    texture: "Crisp edges, velvety center",
    bestFor: "Crispy pan-frying, tacos, stirring into quick sautés",
    image: "/box_pink_oyster.jpg",
    imageAlt: "Vibrant Pink Oyster mushroom cluster",
    productMatchNames: ["Pink Oyster Mushroom", "Pink Oyster"]
  },
  {
    id: "g4",
    slug: "blue-oyster",
    commonName: "Blue Oyster",
    scientificName: "Pleurotus ostreatus",
    category: "oyster",
    categoryLabel: "Oyster Varieties",
    shortDescription: "Artisan cultivar featuring deep steel-blue caps and tender, quick-cooking clusters.",
    flavor: "Mild, earthy, subtle anise aroma",
    texture: "Soft, silky, tender",
    bestFor: "Cream pastas, risottos, quick pan sautés",
    image: "/box_blue_oyster.jpg",
    imageAlt: "Fresh Blue Oyster mushroom cluster",
    productMatchNames: ["Blue Oyster Mushroom", "Blue Oyster"]
  },
  {
    id: "g5",
    slug: "golden-oyster",
    commonName: "Golden Oyster",
    scientificName: "Pleurotus citrinopileatus",
    category: "oyster",
    categoryLabel: "Oyster Varieties",
    shortDescription: "Eye-catching yellow clusters offering a delicate aroma and gentle nutty finish.",
    flavor: "Nutty, light, delicate",
    texture: "Thin, tender caps",
    bestFor: "Flash sautéing, soup garnishes, light stir-fries",
    image: "/shrooom.jpg",
    imageAlt: "Golden Oyster mushroom cluster",
    productMatchNames: ["Golden Oyster Mushroom", "Golden Oyster"]
  },
  {
    id: "g6",
    slug: "reishi",
    commonName: "Reishi",
    scientificName: "Ganoderma lucidum",
    category: "traditional",
    categoryLabel: "Traditional Use",
    shortDescription: "Traditional species with a firm, lacquered cap, historically prepared as an infused warm brew.",
    flavor: "Deeply earthy, pleasantly bitter",
    texture: "Hard, corky, woody",
    bestFor: "Simmering into health teas, decoctions, warm herbal broths",
    image: "/cultivar_reishi.jpg",
    imageAlt: "Red Reishi mushroom cap",
    productMatchNames: ["Reishi Mushroom", "Reishi"]
  },
  {
    id: "g7",
    slug: "maitake",
    commonName: "Maitake",
    scientificName: "Grifola frondosa",
    category: "gourmet",
    categoryLabel: "Gourmet & Culinary",
    shortDescription: "Feathered cluster formation offering rich, earthy depth and excellent roasting qualities.",
    flavor: "Deeply earthy, rich umami",
    texture: "Feathery, tender-crisp",
    bestFor: "Whole cluster roasting, grilling, woodsy broths",
    image: "/cultivar_maitake.jpg",
    imageAlt: "Fresh Maitake cluster",
    productMatchNames: ["Maitake Mushroom", "Maitake"]
  }
];

export const MUSHROOM_GUIDE_CATEGORIES = [
  { id: "all", label: "All Varieties" },
  { id: "gourmet", label: "Gourmet & Culinary" },
  { id: "oyster", label: "Oyster Varieties" },
  { id: "traditional", label: "Traditional Use" }
];
