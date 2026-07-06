/* ═══════════════════════════════════════════════
   SHROOOMS — MUSHROOM GUIDE CONFIGURATION
   Centralized, safe, evidence-based species data
   ═══════════════════════════════════════════════ */

export const MUSHROOM_GUIDE_CONFIG = {
  featuredSpeciesSlug: "lions-mane"
};

export const MUSHROOM_GUIDE_DATA = [
  {
    id: "g1",
    slug: "lions-mane",
    commonName: "Lion's Mane",
    scientificName: "Hericium erinaceus",
    category: "gourmet",
    categoryLabel: "Gourmet & Culinary",
    choiceGroup: "meaty-substantial",
    shortDescription: "Distinctive white shaggy clusters with a tender, lobster-like texture and sweet umami aroma.",
    flavor: "Sweet, subtle, seafood-like notes",
    texture: "Meaty, fibrous, tender",
    bestFor: "Pan-searing in garlic butter, roasting, dry-searing steaks",
    image: "/cultivar_lions_mane.jpg",
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
    choiceGroup: "meaty-substantial",
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
    choiceGroup: "delicate-distinctive",
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
    choiceGroup: "mild-versatile",
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
    choiceGroup: "delicate-distinctive",
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
    choiceGroup: "traditional-prep",
    shortDescription: "Traditional species with a firm, lacquered cap, historically prepared as an infused warm brew.",
    flavor: "Deeply earthy, pleasantly bitter",
    texture: "Hard, corky, woody",
    bestFor: "Simmering into warm bitter infusions, traditional decoctions, and herbal broths",
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
    choiceGroup: "meaty-substantial",
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

export const MUSHROOM_GUIDE_CHOICE_GROUPS = [
  {
    id: "mild-versatile",
    title: "Mild & Versatile",
    description: "Accessible varieties with delicate flavors that pair effortlessly with everyday pasta, grain, and sauté dishes."
  },
  {
    id: "meaty-substantial",
    title: "Meaty & Substantial",
    description: "Dense, firm cultivars that hold their structure and sear beautifully into steaks, thick rounds, or hearty roasts."
  },
  {
    id: "delicate-distinctive",
    title: "Delicate & Distinctive",
    description: "Vibrant, eye-catching clusters featuring unique aromas and light textures best suited for gentle flash sautés."
  },
  {
    id: "traditional-prep",
    title: "Traditional Preparation",
    description: "Woody, structured species historically sliced, dried, and simmered into warm infused teas and herbal broths."
  }
];

export const MUSHROOM_GUIDE_FAQS = [
  {
    id: "faq-choose",
    question: "How do I choose between different gourmet mushroom varieties?",
    answer: "Consider your cooking method and desired texture. Dense species like King Oyster and Lion's Mane sear into thick steak-like rounds, while Blue and Pink Oyster clusters cook quickly in stir-fries, pastas, and sautés."
  },
  {
    id: "faq-cleaning",
    question: "How should fresh gourmet mushrooms be cleaned before cooking?",
    answer: "Avoid soaking fresh mushrooms in water, as they absorb moisture easily. Instead, trim the base of the stems and gently wipe away substrate with a damp cloth or soft brush shortly before cooking."
  },
  {
    id: "faq-storage",
    question: "What is the best way to store fresh mushrooms after purchase?",
    answer: "Store fresh mushrooms refrigerated in a cool environment inside breathable paper bags or ventilated containers. Keeping them dry and allowing airflow helps preserve natural texture and aroma."
  },
  {
    id: "faq-products",
    question: "Where can I find SHROOOMS products and detailed cooking recipes?",
    answer: "Each species card in this guide links directly to available SHROOOMS products. You can also explore our dedicated Kitchen Recipes page for chef-curated cooking techniques and serving suggestions."
  }
];

