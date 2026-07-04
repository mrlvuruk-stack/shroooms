/* src/config/homepageConfig.js */

export const HOMEPAGE_CONFIG = {
  // Hero Copy & Actions (Strictly Factual & Low-Risk Copy)
  hero: {
    badgeText: "Discover SHROOOMS",
    titleLine1: "EXPLORE",
    titleLine2: "GOURMET",
    titleCursive: "Mushrooms",
    subtitle: "Explore mushroom products and grow-at-home offerings available from SHROOOMS.",
    primaryCtaText: "Shop Now",
    primaryCtaAnchor: "#produce-list",
    secondaryCtaText: "Our Story",
    secondaryCtaRoute: "/our-story",
    fallbackImages: [
      { src: "/banner_nourish.jpg", alt: "Mushroom growing blocks in clean cultivation chamber" },
      { src: "/banner_boxes.jpg", alt: "Mushroom clusters packed inside clean cardboard packaging boxes" },
      { src: "/banner_pouches.jpg", alt: "Dried mushroom pieces packed inside sealed pouches" },
      { src: "/banner_doorstep.jpg", alt: "Variety of mushrooms in a woven delivery basket" }
    ]
  },

  // Centralized Category Mapping (Explore Products using verified keywords)
  categories: [
    {
      id: "cat-all",
      name: "All Mushrooms",
      keyword: "",
      image: "/banner_nourish.jpg",
      description: "Browse the complete collection of mushrooms and grow kits."
    },
    {
      id: "cat-oysters",
      name: "Oyster Mushrooms",
      keyword: "oyster",
      image: "/banner_boxes.jpg",
      description: "Explore culinary oyster mushroom cultivars."
    },
    {
      id: "cat-lionsmane",
      name: "Lion's Mane",
      keyword: "lion",
      image: "/banner_pouches.jpg",
      description: "Discover Lion's Mane mushroom offerings."
    }
  ],

  // Featured Products configuration (Phase B)
  featuredProducts: {
    configuredNames: ["Lion's Mane", "King Oyster", "Pink Oyster", "Blue Oyster"],
    sectionTitle: "Featured Curation",
    sectionSubtitle: "Discover our most celebrated gourmet cultivars, harvested fresh at dawn."
  },

  // Featured Mushroom Flagship Config (Phase B)
  featuredMushroom: {
    targetNameKeyword: "Lion's Mane",
    badge: "Flagship Cultivar",
    tagline: "Gourmet Species",
    scientificName: "Hericium erinaceus",
    buttonText: "View Details"
  },

  // Farm Story Process (Phase B)
  farmStory: {
    sectionTitle: "The SHROOOMS Process",
    sectionSubtitle: "From clean cultivation inside our Indore facility to your kitchen.",
    steps: [
      {
        number: "01",
        title: "Vertical Cultivation",
        description: "Grown in a controlled indoor vertical farm in Indore using premium substrates."
      },
      {
        number: "02",
        title: "Careful Selection",
        description: "Clusters are inspected and selected at their optimal shape and density."
      },
      {
        number: "03",
        title: "Hygienic Packing",
        description: "Packed inside food-grade ventilated boxes to protect delicate structures."
      },
      {
        number: "04",
        title: "Direct Delivery",
        description: "Shipped directly to local restaurants, chefs, and kitchens."
      }
    ]
  },

  // Why SHROOOMS Differentiators (Phase B)
  whyChooseUs: {
    sectionTitle: "Why SHROOOMS",
    sectionSubtitle: "Factual commerce experience principles backed by clean vertical indoor farming.",
    points: [
      {
        title: "Indore Vertical Cultivation",
        description: "Cultivated locally in INDORE within fully automated vertical grow chambers."
      },
      {
        title: "Culinary Selection",
        description: "Gourmet cultivars selected for rich texture, shape, and flavor profile."
      },
      {
        title: "Clean Packaging",
        description: "Delivered in structured ventilated containers preserving structural integrity."
      },
      {
        title: "Grow-at-Home Offerings",
        description: "Fully colonized substrate fruiting blocks ready to produce mushrooms at home."
      }
    ]
  }
};
