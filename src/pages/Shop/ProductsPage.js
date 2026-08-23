import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { CANONICAL_CATEGORIES, matchesCategory } from "../../config/categoryConfig";
import "./ProductsPage.css";

// ═══════════════════════════════════════════════════════════════════════════
// COMPLETE MASTER CATALOG DATA (Mushroom Spawn, LC, Farm Supplies, Grow Kits)
// ═══════════════════════════════════════════════════════════════════════════
const MASTER_PRODUCTS = [
  // ── MUSHROOM SPAWN (16 items) ──
  {
    id: "sp-blue-oyster",
    name: "Blue Oyster Spawn",
    scientificName: "Pleurotus ostreatus var. columbinus",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Pleurotus",
    price: 399,
    mrp: 499,
    rating: 4.9,
    reviewsCount: 142,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Cool Climate (15-22°C)",
    tags: ["Edible", "Organic", "Beginner Friendly", "Indoor", "High Yield"],
    image: "/box_blue_oyster.jpg",
    description: "Vibrant ocean-blue clusters known for high yields, tender texture, and mild earthy flavor. Rapid colonization on grain.",
    yield: "800g - 1.2kg per bag",
    temp: "15 - 22°C",
    humidity: "85 - 90%",
    harvestDays: "14 - 18 Days",
    storage: "Cold storage at 4°C for up to 60 days",
    benefits: "Rich in ergothioneine antioxidants, protein, and essential B-vitamins.",
    instructions: [
      "Inoculate sterilized grain or straw substrate under sterile HEPA flow conditions.",
      "Incubate in total darkness at 20-24°C for 12-14 days until fully colonized.",
      "Transfer to fruiting chamber with fresh air exchange and 85-90% relative humidity.",
      "Harvest when cap edges begin to uncurl upwards."
    ],
    faqs: [
      { q: "What substrate works best for Blue Oyster?", a: "Sterilized wheat straw, cotton waste, or hardwood sawdust supplemented with bran." },
      { q: "Is grain spawn ready to use?", a: "Yes, our spawn is 100% fully colonized on organic sorghum/wheat grain." }
    ]
  },
  {
    id: "sp-pink-oyster",
    name: "Pink Oyster Spawn",
    scientificName: "Pleurotus djamor",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Pleurotus",
    price: 399,
    mrp: 499,
    rating: 4.8,
    reviewsCount: 118,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Warm Climate (20-30°C)",
    tags: ["Edible", "Organic", "Beginner Friendly", "Warm Climate", "Fast Growing"],
    image: "/box_pink_oyster.jpg",
    description: "Striking tropical pink bouquet clusters. Extremely fast colonizer perfectly suited for warm Indian climate conditions.",
    yield: "750g - 1.1kg per bag",
    temp: "22 - 30°C",
    humidity: "85 - 95%",
    harvestDays: "10 - 14 Days",
    storage: "Do NOT refrigerate below 10°C; store at room temperature.",
    benefits: "High protein content, cardiovascular support, and culinary versatility.",
    instructions: [
      "Mix spawn evenly with pasteurized straw or sawdust at 10% spawn rate.",
      "Maintain incubation temperature between 24-28°C.",
      "Fruit at high humidity with indirect ambient sunlight.",
      "Harvest early before pink pigmentation turns pale."
    ],
    faqs: [
      { q: "Can I put Pink Oyster spawn in fridge?", a: "No, Pink Oyster is a tropical species and dies below 8°C. Keep at room temperature." }
    ]
  },
  {
    id: "sp-elm-oyster",
    name: "Elm Oyster Spawn",
    scientificName: "Hypsizygus ulmarius",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Hypsizygus",
    price: 349,
    mrp: 449,
    rating: 4.7,
    reviewsCount: 89,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "All-Season (18-28°C)",
    tags: ["Edible", "Organic", "All-Season", "Indoor"],
    image: "/cultivar_chaga.jpg",
    description: "Robust white to cream colored caps with thick stems. Highly resistant to green mold contamination.",
    yield: "900g - 1.3kg per bag",
    temp: "18 - 28°C",
    humidity: "80 - 90%",
    harvestDays: "16 - 20 Days",
    storage: "Store at 4°C for up to 45 days",
    benefits: "High dietary fiber, immune-boosting beta-glucans.",
    instructions: [
      "Mix with pasteurized straw substrate.",
      "Incubate for 14 days at 22-26°C.",
      "Provide clean fresh air during fruiting stage."
    ],
    faqs: [
      { q: "Is Elm Oyster resistant to mold?", a: "Yes, it has strong mycelial vigor and outgrows many common competitors." }
    ]
  },
  {
    id: "sp-white-oyster",
    name: "White Oyster Spawn",
    scientificName: "Pleurotus florida",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Pleurotus",
    price: 349,
    mrp: 449,
    rating: 4.8,
    reviewsCount: 165,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "All-Season (18-26°C)",
    tags: ["Edible", "Organic", "Commercial Favorite", "Indoor"],
    image: "/banner_pouches.jpg",
    description: "Classic commercial white oyster cultivar. Soft fleshy caps, pleasant aroma, and dependable commercial yields.",
    yield: "850g - 1.25kg per bag",
    temp: "18 - 26°C",
    humidity: "85 - 90%",
    harvestDays: "12 - 16 Days",
    storage: "Store at 4°C for up to 60 days",
    benefits: "Supports healthy cholesterol levels and immune function.",
    instructions: ["Spawn to pasteurized straw.", "Fruit under misting conditions."],
    faqs: [{ q: "What is flush gap?", a: "Second flush typically arrives 7-10 days after the first harvest." }]
  },
  {
    id: "sp-golden-oyster",
    name: "Golden Oyster Spawn",
    scientificName: "Pleurotus citrinopileatus",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Pleurotus",
    price: 399,
    mrp: 499,
    rating: 4.7,
    reviewsCount: 94,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Warm Climate (20-28°C)",
    tags: ["Edible", "Organic", "Gourmet Chef Choice", "Exotic"],
    image: "/shroooms_product_showcase.png",
    description: "Bright sunshine-yellow clusters with a fragrant nutty, cashewnut-like aroma upon cooking.",
    yield: "700g - 1.0kg per bag",
    temp: "20 - 28°C",
    humidity: "85 - 92%",
    harvestDays: "12 - 15 Days",
    storage: "Store at 8-12°C",
    benefits: "Rich in niacin, copper, and active antioxidants.",
    instructions: ["Spawn on supplemented sawdust or straw.", "Expose to bright ambient light for vibrant yellow caps."],
    faqs: [{ q: "Why do caps turn pale?", a: "Caps turn pale if fruiting light is insufficient. Provide bright indirect light." }]
  },
  {
    id: "sp-grey-oyster",
    name: "Grey Oyster Spawn",
    scientificName: "Pleurotus sajor-caju",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Pleurotus",
    price: 349,
    mrp: 449,
    rating: 4.9,
    reviewsCount: 210,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "All-Season (20-30°C)",
    tags: ["Edible", "Organic", "Commercial Benchmark", "High Yield"],
    image: "/shrooom.jpg",
    description: "India's most popular commercial cultivation variety. Broad grey-brown caps with incredible environmental adaptability.",
    yield: "900g - 1.4kg per bag",
    temp: "20 - 30°C",
    humidity: "80 - 90%",
    harvestDays: "12 - 16 Days",
    storage: "Store at 4-8°C for 60 days",
    benefits: "Rich source of vegetable protein and essential amino acids.",
    instructions: ["Cultivate on paddy straw or wheat straw.", "Extremely easy for first-time growers."],
    faqs: [{ q: "Can I grow this in summer?", a: "Yes, Sajor-Caju handles ambient temperatures up to 32°C." }]
  },
  {
    id: "sp-king-oyster",
    name: "King Oyster Spawn",
    scientificName: "Pleurotus eryngii",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Pleurotus",
    price: 449,
    mrp: 549,
    rating: 4.9,
    reviewsCount: 135,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Cool Climate (14-18°C)",
    tags: ["Edible", "Organic", "Gourmet Chef Choice", "Thick Stem"],
    image: "/box_king_oyster.jpg",
    description: "Thick meaty stems with rich umami flavor. The king of culinary mushrooms, prized by fine dining chefs.",
    yield: "400g - 600g per bag (dense stem mass)",
    temp: "14 - 18°C",
    humidity: "85 - 90%",
    harvestDays: "22 - 28 Days",
    storage: "Store at 4°C",
    benefits: "Contains lovastatin for lipid management and digestive health.",
    instructions: ["Fruit on supplemented hardwood sawdust bags.", "Top-fruit with bottle or bag neck reduction for thick stems."],
    faqs: [{ q: "Requires casing?", a: "Casing layer with peat moss improves pinhead formation." }]
  },
  {
    id: "sp-button",
    name: "Button Mushroom Spawn",
    scientificName: "Agaricus bisporus",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Agaricus",
    price: 349,
    mrp: 449,
    rating: 4.6,
    reviewsCount: 178,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Cool Climate (16-22°C)",
    tags: ["Edible", "Organic", "Classic White Button"],
    image: "/cultivar_chaga.jpg",
    description: "The world's most widely consumed mushroom. Requires pasteurized compost and casing soil for heavy flushing.",
    yield: "1.2kg - 1.8kg per tray",
    temp: "16 - 22°C",
    humidity: "85 - 95%",
    harvestDays: "24 - 30 Days",
    storage: "Store at 4°C",
    benefits: "Excellent source of selenium, potassium, and vitamin D.",
    instructions: ["Spawn into aerobic wheat straw compost.", "Apply casing soil layer when mycelium runs through compost."],
    faqs: [{ q: "Can I grow without compost?", a: "No, Agaricus requires composted organic matter." }]
  },
  {
    id: "sp-paddy-straw",
    name: "Paddy Straw Spawn",
    scientificName: "Volvariella volvacea",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Volvariella",
    price: 299,
    mrp: 399,
    rating: 4.5,
    reviewsCount: 76,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Hot Climate (30-38°C)",
    tags: ["Edible", "Organic", "Summer Crop", "Tropical"],
    image: "/shroooms_farm_story.png",
    description: "Fastest growing tropical mushroom. Egg-stage button harvest delivers delicate aroma and silky texture.",
    yield: "500g - 800g per bed",
    temp: "30 - 38°C",
    humidity: "85 - 95%",
    harvestDays: "8 - 10 Days",
    storage: "Do NOT refrigerate; store at 15-20°C",
    benefits: "High vitamin C and essential amino acid profile.",
    instructions: ["Build outdoors or indoors on soaked paddy straw bundles.", "Maintain warm ambient temperatures above 30°C."],
    faqs: [{ q: "How fast is harvest?", a: "Pinheads appear in 6-7 days and mature in 9 days!" }]
  },
  {
    id: "sp-enoki",
    name: "Enoki Spawn",
    scientificName: "Flammulina filiformis",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Flammulina",
    price: 449,
    mrp: 549,
    rating: 4.8,
    reviewsCount: 92,
    availability: "In Stock",
    difficulty: "Commercial",
    climate: "Cold Climate (10-15°C)",
    tags: ["Edible", "Organic", "Crispy Asian Noodle", "Cold Climate"],
    image: "/cultivar_lions_mane.jpg",
    description: "Slender velvety white stems with tiny delicate caps. Requires cold temperature and elevated CO2 collars.",
    yield: "400g - 650g per bottle",
    temp: "10 - 15°C",
    humidity: "85 - 90%",
    harvestDays: "25 - 32 Days",
    storage: "Store at 4°C",
    benefits: "Contains flammulin polysaccharide with strong immune support properties.",
    instructions: ["Use plastic collar around jar/bag top to restrict oxygen and stretch stems long and thin."],
    faqs: [{ q: "Why are my caps growing big?", a: "Too much fresh air causes large caps. Restrict fresh air to grow long slender stems." }]
  },
  {
    id: "sp-reishi",
    name: "Reishi Spawn",
    scientificName: "Ganoderma lucidum",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Ganoderma",
    price: 499,
    mrp: 649,
    rating: 4.9,
    reviewsCount: 156,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Warm Climate (22-28°C)",
    tags: ["Medicinal", "Organic", "Immune Tonic", "Adaptogen"],
    image: "/cultivar_reishi.jpg",
    description: "The 'Mushroom of Immortality'. Glossy lacquered red bracket mushroom famous for triterpenes and immune longevity.",
    yield: "200g - 400g dried conk per bag",
    temp: "22 - 28°C",
    humidity: "85 - 95%",
    harvestDays: "60 - 90 Days",
    storage: "Store at 4°C",
    benefits: "Potent adaptogen, anti-inflammatory, stress reducer, and deep sleep enhancer.",
    instructions: ["Grow antlers with elevated CO2, or open top for classic kidney-shaped shiny red conk."],
    faqs: [{ q: "How is Reishi consumed?", a: "Slice dried conk and brew as tea or extract into liquid tincture." }]
  },
  {
    id: "sp-lions-mane",
    name: "Lion's Mane Spawn",
    scientificName: "Hericium erinaceus",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Hericium",
    price: 499,
    mrp: 649,
    rating: 5.0,
    reviewsCount: 245,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Cool Climate (18-24°C)",
    tags: ["Medicinal", "Edible", "Organic", "Nootropic", "Brain Health"],
    image: "/box_lions_mane.jpg",
    description: "Cascade of icy white icicle-like tendrils. World famous brain nootropic with lobster/seafood gourmet flavor.",
    yield: "600g - 1.0kg per bag",
    temp: "18 - 24°C",
    humidity: "85 - 92%",
    harvestDays: "18 - 24 Days",
    storage: "Store at 4°C for up to 45 days",
    benefits: "Stimulates Nerve Growth Factor (NGF), enhances focus, memory, and cognitive nerve regeneration.",
    instructions: ["Fruit on hardwood sawdust supplemented with rice bran.", "Provide constant gentle humidity."],
    faqs: [{ q: "Why is my Lion's Mane turning yellow?", a: "Yellowing indicates low humidity or drying air. Increase misting frequency." }]
  },
  {
    id: "sp-shiitake",
    name: "Shiitake Spawn",
    scientificName: "Lentinula edodes",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Lentinula",
    price: 499,
    mrp: 649,
    rating: 4.9,
    reviewsCount: 188,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Cool Climate (16-22°C)",
    tags: ["Edible", "Medicinal", "Organic", "Rich Umami", "Oak Log"],
    image: "/cultivar_turkey_tail.jpg",
    description: "Rich dark brown umbrella caps with white crackle patterns. The world benchmark for gourmet culinary umami.",
    yield: "500g - 900g per bag",
    temp: "16 - 22°C",
    humidity: "80 - 88%",
    harvestDays: "45 - 60 Days (Incubation)",
    storage: "Store at 4°C",
    benefits: "Contains lentinan polysaccharide and eritadenine for heart health.",
    instructions: ["Incubate block until dark brown bark forms before cold-shocking in water bath to induce fruiting."],
    faqs: [{ q: "What is cold shocking?", a: "Submerging colonized block in ice cold water for 12 hours triggers heavy pinning." }]
  },
  {
    id: "sp-milky",
    name: "Milky Mushroom Spawn",
    scientificName: "Calocybe indica",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Calocybe",
    price: 349,
    mrp: 449,
    rating: 4.8,
    reviewsCount: 140,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Hot Summer (28-38°C)",
    tags: ["Edible", "Organic", "Long Shelf Life", "Summer Crop"],
    image: "/value_freshness.jpg",
    description: "Native Indian white mushroom with robust solid stems and exceptional 10-day fresh shelf life.",
    yield: "1.0kg - 1.5kg per bag",
    temp: "28 - 38°C",
    humidity: "85 - 95%",
    harvestDays: "20 - 25 Days",
    storage: "Store fresh mushrooms up to 10-12 days",
    benefits: "Rich in fiber, calcium, and protein.",
    instructions: ["Spawn on straw substrate, cover with casing soil layer after 14 days of incubation."],
    faqs: [{ q: "Is casing required?", a: "Yes, Milky mushroom requires soil/peat casing to pin." }]
  },
  {
    id: "sp-maitake",
    name: "Maitake Spawn",
    scientificName: "Grifola frondosa",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Grifola",
    price: 549,
    mrp: 699,
    rating: 4.8,
    reviewsCount: 67,
    availability: "Pre-order",
    difficulty: "Commercial",
    climate: "Cool Climate (15-20°C)",
    tags: ["Edible", "Medicinal", "Organic", "Hen of the Woods"],
    image: "/cultivar_maitake.jpg",
    description: "Feathered 'Hen of the Woods' frond clusters with deep woodsy flavor and potent immune D-fraction glucans.",
    yield: "400g - 750g per block",
    temp: "15 - 20°C",
    humidity: "85 - 92%",
    harvestDays: "35 - 45 Days",
    storage: "Store at 4°C",
    benefits: "Regulates blood glucose, blood pressure, and activates killer T-cells.",
    instructions: ["Fruit on sterilized oak/hardwood sawdust with slow, steady air movement."],
    faqs: [{ q: "Why is Maitake slow?", a: "Maitake forms complex fronds requiring steady 4-week fruiting conditions." }]
  },
  {
    id: "sp-cordyceps",
    name: "Cordyceps Militaris Spawn",
    scientificName: "Cordyceps militaris",
    category: "Mushroom Spawn",
    categorySlug: "spawn",
    species: "Cordyceps",
    price: 999,
    mrp: 1299,
    rating: 5.0,
    reviewsCount: 88,
    availability: "In Stock",
    difficulty: "Commercial",
    climate: "Cold Laboratory (18-20°C)",
    tags: ["Adenosine Rich", "Energy Booster", "Superfood"],
    image: "/cordyceps_spawn.jpg",
    description: "Lab-grade grain spawn of Cordyceps militaris. Cultivated under strict temperature control for high cordycepin & adenosine content.",
    yield: "300 - 450 Gm Fresh Fruitbodies per 1kg Spawn",
    temp: "18 - 20°C",
    humidity: "75 - 85%",
    harvestDays: "50 - 65 Days",
    storage: "Store spawn at 4°C under dark conditions",
    benefits: "Boosts ATP cellular energy, VO2 max endurance, and respiratory stamina.",
    instructions: ["Inoculate liquid broth onto sterilized rice media in autoclavable PP containers under 500-1000 lux LED lighting."],
    faqs: [{ q: "Requires insects?", a: "No, Cordyceps militaris is grown on vegan rice broth media!" }]
  },

  // ── LIQUID CULTURE (14 items) ──
  {
    id: "lc-blue-oyster",
    name: "Blue Oyster LC (10ml Syringe)",
    scientificName: "Pleurotus ostreatus var. columbinus",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Pleurotus",
    price: 499,
    mrp: 599,
    rating: 4.9,
    reviewsCount: 110,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Cool Climate (15-22°C)",
    tags: ["Liquid Mycelium", "Sterile Syringe", "Fast Inoculation"],
    image: "/lc_syringe.jpg",
    description: "10ml isolated liquid mycelium syringe with sterile 18G needle & alcohol wipe. Rapid grain colonizer.",
    yield: "Inoculates 5-8kg grain spawn",
    temp: "15 - 22°C",
    humidity: "N/A",
    harvestDays: "Rapid 5-7 day colonization",
    storage: "Store at 4°C for up to 6 months",
    benefits: "Guarantees 100% genetic clone purity without spore variation.",
    instructions: ["Inject 1-2ml into self-healing injection port of grain bag under clean bench conditions."],
    faqs: [{ q: "Includes needle?", a: "Yes, packed with sterile luer-lock 18G needle." }]
  },
  {
    id: "lc-pink-oyster",
    name: "Pink Oyster LC (10ml Syringe)",
    scientificName: "Pleurotus djamor",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Pleurotus",
    price: 499,
    mrp: 599,
    rating: 4.8,
    reviewsCount: 95,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Warm Climate (20-30°C)",
    tags: ["Liquid Mycelium", "Tropical", "Fast Inoculation"],
    image: "/box_pink_oyster.jpg",
    description: "High-density mycelial liquid suspension of tropical Pink Oyster.",
    yield: "Inoculates 5-8kg grain spawn",
    temp: "22 - 30°C",
    humidity: "N/A",
    harvestDays: "Fast 4-6 day colonization",
    storage: "Store at 15-20°C (Do not refrigerate)",
    benefits: "Rapid growth outcompetes mold contaminants.",
    instructions: ["Inject 1-2ml per grain bag."],
    faqs: [{ q: "Storage temperature?", a: "Keep around room temperature." }]
  },
  {
    id: "lc-white-oyster",
    name: "White Oyster LC (10ml Syringe)",
    scientificName: "Pleurotus florida",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Pleurotus",
    price: 449,
    mrp: 549,
    rating: 4.7,
    reviewsCount: 80,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "All-Season (18-26°C)",
    tags: ["Liquid Mycelium", "Commercial"],
    image: "/banner_pouches.jpg",
    description: "Pure isolated White Oyster commercial strain liquid culture.",
    yield: "Inoculates 5-8kg grain spawn",
    temp: "18 - 26°C",
    humidity: "N/A",
    harvestDays: "5-7 days",
    storage: "Store at 4°C",
    benefits: "High commercial vigor.",
    instructions: ["Inject into grain master bags."],
    faqs: []
  },
  {
    id: "lc-golden-oyster",
    name: "Golden Oyster LC (10ml Syringe)",
    scientificName: "Pleurotus citrinopileatus",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Pleurotus",
    price: 499,
    mrp: 599,
    rating: 4.8,
    reviewsCount: 65,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Warm Climate (20-28°C)",
    tags: ["Liquid Mycelium", "Exotic"],
    image: "/shroooms_product_showcase.png",
    description: "Isolated golden oyster liquid culture syringe.",
    yield: "Inoculates 5-8kg grain spawn",
    temp: "20 - 28°C",
    humidity: "N/A",
    harvestDays: "5-7 days",
    storage: "Store at 8-12°C",
    benefits: "Vibrant yellow strain clone.",
    instructions: ["Inject 2ml per grain bag."],
    faqs: []
  },
  {
    id: "lc-grey-oyster",
    name: "Grey Oyster LC (10ml Syringe)",
    scientificName: "Pleurotus sajor-caju",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Pleurotus",
    price: 449,
    mrp: 549,
    rating: 4.9,
    reviewsCount: 120,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "All-Season (20-30°C)",
    tags: ["Liquid Mycelium", "Commercial Favorite"],
    image: "/shrooom.jpg",
    description: "Resilient Grey Oyster isolated liquid culture.",
    yield: "Inoculates 5-8kg grain spawn",
    temp: "20 - 30°C",
    humidity: "N/A",
    harvestDays: "5-7 days",
    storage: "Store at 4°C",
    benefits: "Extremely forgiving strain.",
    instructions: ["Inject 1-2ml into grain bag."],
    faqs: []
  },
  {
    id: "lc-king-oyster",
    name: "King Oyster LC (10ml Syringe)",
    scientificName: "Pleurotus eryngii",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Pleurotus",
    price: 549,
    mrp: 649,
    rating: 4.9,
    reviewsCount: 88,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Cool Climate (14-18°C)",
    tags: ["Liquid Mycelium", "Gourmet Chef Choice"],
    image: "/box_king_oyster.jpg",
    description: "Heavy-yielding King Oyster stem clone liquid culture.",
    yield: "Inoculates 5-8kg grain spawn",
    temp: "14 - 18°C",
    humidity: "N/A",
    harvestDays: "7-10 days",
    storage: "Store at 4°C",
    benefits: "Thick meaty stem genetics.",
    instructions: ["Inject into sterilized wheat/rye grain."],
    faqs: []
  },
  {
    id: "lc-paddy-straw",
    name: "Paddy Straw LC (10ml Syringe)",
    scientificName: "Volvariella volvacea",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Volvariella",
    price: 399,
    mrp: 499,
    rating: 4.6,
    reviewsCount: 42,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Hot Climate (30-38°C)",
    tags: ["Liquid Mycelium", "Tropical"],
    image: "/shroooms_farm_story.png",
    description: "Tropical Paddy Straw liquid mycelium syringe.",
    yield: "Inoculates 5kg grain",
    temp: "30 - 38°C",
    humidity: "N/A",
    harvestDays: "4-6 days",
    storage: "Keep at 20°C",
    benefits: "Fast high-temp growth.",
    instructions: ["Inoculate paddy grain master."],
    faqs: []
  },
  {
    id: "lc-enoki",
    name: "Enoki LC (10ml Syringe)",
    scientificName: "Flammulina filiformis",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Flammulina",
    price: 549,
    mrp: 649,
    rating: 4.8,
    reviewsCount: 50,
    availability: "In Stock",
    difficulty: "Commercial",
    climate: "Cold Climate (10-15°C)",
    tags: ["Liquid Mycelium", "Cold Climate"],
    image: "/cultivar_lions_mane.jpg",
    description: "Velvety white Enoki liquid culture clone.",
    yield: "Inoculates 5-8kg grain spawn",
    temp: "10 - 15°C",
    humidity: "N/A",
    harvestDays: "7-9 days",
    storage: "Store at 4°C",
    benefits: "Long stem strain clone.",
    instructions: ["Inoculate grain master jars."],
    faqs: []
  },
  {
    id: "lc-reishi",
    name: "Reishi LC (10ml Syringe)",
    scientificName: "Ganoderma lucidum",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Ganoderma",
    price: 599,
    mrp: 699,
    rating: 4.9,
    reviewsCount: 105,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Warm Climate (22-28°C)",
    tags: ["Liquid Mycelium", "Medicinal", "Adaptogen"],
    image: "/cultivar_reishi.jpg",
    description: "Potent Red Reishi isolated liquid culture.",
    yield: "Inoculates 5-8kg grain spawn",
    temp: "22 - 28°C",
    humidity: "N/A",
    harvestDays: "8-12 days",
    storage: "Store at 4°C",
    benefits: "High triterpene genetics.",
    instructions: ["Inject into sterilized grain master."],
    faqs: []
  },
  {
    id: "lc-lions-mane",
    name: "Lion's Mane LC (10ml Syringe)",
    scientificName: "Hericium erinaceus",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Hericium",
    price: 599,
    mrp: 699,
    rating: 5.0,
    reviewsCount: 210,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Cool Climate (18-24°C)",
    tags: ["Liquid Mycelium", "Medicinal", "Nootropic"],
    image: "/box_lions_mane.jpg",
    description: "Top-tier isolated Lion's Mane liquid culture syringe. Rapid dense white cloud growth.",
    yield: "Inoculates 5-8kg grain spawn",
    temp: "18 - 24°C",
    humidity: "N/A",
    harvestDays: "6-8 days",
    storage: "Store at 4°C",
    benefits: "Maximized Hericenones & Erinacines yield.",
    instructions: ["Inject 1-2ml into sterilized grain bag."],
    faqs: []
  },
  {
    id: "lc-shiitake",
    name: "Shiitake LC (10ml Syringe)",
    scientificName: "Lentinula edodes",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Lentinula",
    price: 599,
    mrp: 699,
    rating: 4.9,
    reviewsCount: 130,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Cool Climate (16-22°C)",
    tags: ["Liquid Mycelium", "Umami Gourmet"],
    image: "/cultivar_turkey_tail.jpg",
    description: "Proven commercial Shiitake 3782 liquid culture clone.",
    yield: "Inoculates 5-8kg grain spawn",
    temp: "16 - 22°C",
    humidity: "N/A",
    harvestDays: "8-12 days",
    storage: "Store at 4°C",
    benefits: "Fast popcorn brown bark formation.",
    instructions: ["Inoculate grain master bags."],
    faqs: []
  },
  {
    id: "lc-milky",
    name: "Milky LC (10ml Syringe)",
    scientificName: "Calocybe indica",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Calocybe",
    price: 449,
    mrp: 549,
    rating: 4.8,
    reviewsCount: 75,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Hot Summer (28-38°C)",
    tags: ["Liquid Mycelium", "Summer Crop"],
    image: "/value_freshness.jpg",
    description: "Isolated Indian Milky Mushroom liquid culture.",
    yield: "Inoculates 5-8kg grain spawn",
    temp: "28 - 38°C",
    humidity: "N/A",
    harvestDays: "5-7 days",
    storage: "Store at 15°C",
    benefits: "Sturdy thick stem clone.",
    instructions: ["Inject into grain master."],
    faqs: []
  },
  {
    id: "lc-maitake",
    name: "Maitake LC (10ml Syringe)",
    scientificName: "Grifola frondosa",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Grifola",
    price: 649,
    mrp: 799,
    rating: 4.8,
    reviewsCount: 40,
    availability: "Pre-order",
    difficulty: "Commercial",
    climate: "Cool Climate (15-20°C)",
    tags: ["Liquid Mycelium", "Medicinal"],
    image: "/cultivar_maitake.jpg",
    description: "Hen of the Woods isolated liquid culture.",
    yield: "Inoculates 5-8kg grain spawn",
    temp: "15 - 20°C",
    humidity: "N/A",
    harvestDays: "10-14 days",
    storage: "Store at 4°C",
    benefits: "D-fraction glucan strain.",
    instructions: ["Inoculate supplemented sawdust substrate."],
    faqs: []
  },
  {
    id: "lc-cordyceps",
    name: "Cordyceps LC (10ml Syringe)",
    scientificName: "Cordyceps militaris",
    category: "Liquid Culture",
    categorySlug: "liquid-culture",
    species: "Cordyceps",
    price: 1299,
    mrp: 1599,
    rating: 5.0,
    reviewsCount: 95,
    availability: "In Stock",
    difficulty: "Commercial",
    climate: "Cold Laboratory (18-20°C)",
    tags: ["Liquid Mycelium", "High Cordycepin", "Lab Grade"],
    image: "/cultivar_cordyceps.jpg",
    description: "High-cordycepin strain liquid broth culture. Optimized for heavy orange fruiting on rice substrate.",
    yield: "Inoculates 20-25 rice cultivation jars",
    temp: "18 - 20°C",
    humidity: "N/A",
    harvestDays: "7-10 days broth expansion",
    storage: "Store at 4°C",
    benefits: "Tested cordycepin & adenosine potency.",
    instructions: ["Expand in liquid nutrient broth or inoculate sterile liquid rice jars."],
    faqs: []
  },

  // ── FARM EQUIPMENT & SUPPLIES (13 items) ──
  {
    id: "eq-sawdust",
    name: "High Quality Sawdust 1kg",
    scientificName: "Substrate Base Material",
    category: "Substrates",
    categorySlug: "equipment",
    species: "N/A",
    price: 149,
    mrp: 199,
    rating: 4.7,
    reviewsCount: 160,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Universal",
    tags: ["Substrates", "Hardwood", "Supplements"],
    image: "/value_sustainability.jpg",
    description: "100% pure untreated un-resinous hardwood sawdust. Ideal substrate base for Shiitake, Lion's Mane & Oyster.",
    yield: "Fills 2-3 substrate bags",
    temp: "N/A",
    humidity: "N/A",
    harvestDays: "N/A",
    storage: "Keep in dry room",
    benefits: "Optimal carbon to nitrogen C:N C-ratio.",
    instructions: ["Mix with wheat bran/gypsum, hydrate to 60-65% moisture, autoclave at 121°C for 2 hours."],
    faqs: []
  },
  {
    id: "eq-pp-bags-normal",
    name: "PP Bags (Normal) 1kg Pack",
    scientificName: "Polypropylene Cultivation Bags",
    category: "Farm Equipment",
    categorySlug: "equipment",
    species: "N/A",
    price: 199,
    mrp: 249,
    rating: 4.8,
    reviewsCount: 220,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Universal",
    tags: ["Farm Equipment", "Autoclavable", "PP Bags"],
    image: "/filter_pp_bags.jpg",
    description: "High temperature autoclavable 121°C Polypropylene bags (8x12 inches). Pack of 100 bags.",
    yield: "N/A",
    temp: "Withstands up to 135°C",
    humidity: "N/A",
    harvestDays: "N/A",
    storage: "Dry room",
    benefits: "Heavy duty non-tear plastic.",
    instructions: ["Fill with substrate, collar with neck ring or fold top before autoclaving."],
    faqs: []
  },
  {
    id: "eq-pp-bags-filter",
    name: "PP Bags (Filter Patch) 50 Pcs",
    scientificName: "Autoclavable 0.2 Micron Filter Bags",
    category: "Farm Equipment",
    categorySlug: "equipment",
    species: "N/A",
    price: 399,
    mrp: 499,
    rating: 4.9,
    reviewsCount: 310,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Universal",
    tags: ["Farm Equipment", "0.2 Micron Filter", "Autoclavable"],
    image: "/banner_pouches.jpg",
    description: "Professional mushroom grow bags with 0.2 micron breathable gas exchange filter patch. 50 pcs.",
    yield: "N/A",
    temp: "Withstands 121°C for 3 hours",
    humidity: "N/A",
    harvestDays: "N/A",
    storage: "Dry room",
    benefits: "Prevents airborne mold contamination while allowing gas exchange.",
    instructions: ["Seal bag top with impulse sealer or zip tie after inoculation."],
    faqs: []
  },
  {
    id: "eq-gypsum",
    name: "Gypsum 900gm",
    scientificName: "Calcium Sulfate Dihydrate (CaSO4·2H2O)",
    category: "Supplements",
    categorySlug: "equipment",
    species: "N/A",
    price: 129,
    mrp: 179,
    rating: 4.8,
    reviewsCount: 145,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Universal",
    tags: ["Supplements", "pH Buffer", "Grain Anti-Clump"],
    image: "/value_premium_quality.jpg",
    description: "Agricultural grade fine gypsum powder. Prevents grain clumping and supplies essential Calcium & Sulfur.",
    yield: "Treats 50kg substrate",
    temp: "N/A",
    humidity: "N/A",
    harvestDays: "N/A",
    storage: "Dry airtight container",
    benefits: "Stabilizes substrate pH and enhances mineral uptake.",
    instructions: ["Add 1-2% by dry weight to grain or compost substrate."],
    faqs: []
  },
  {
    id: "eq-chuna",
    name: "Chuna 900gm",
    scientificName: "Calcium Hydroxide / Hydrated Lime",
    category: "Chemicals",
    categorySlug: "equipment",
    species: "N/A",
    price: 99,
    mrp: 149,
    rating: 4.6,
    reviewsCount: 180,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Universal",
    tags: ["Chemicals", "Cold Water Pasteurization", "pH Elevation"],
    image: "/value_trust.jpg",
    description: "High-purity hydrated lime for cold water chemical pasteurization of straw substrate without boiling.",
    yield: "Treats 100kg straw",
    temp: "N/A",
    humidity: "N/A",
    harvestDays: "N/A",
    storage: "Sealed container away from moisture",
    benefits: "Raises water pH to 12+, killing competing spores in 16 hours.",
    instructions: ["Dissolve 100g Chuna per 50L water, soak dry straw for 16-18 hours, drain well before spawning."],
    faqs: []
  },
  {
    id: "eq-chalk-powder",
    name: "Chalk Powder 1kg",
    scientificName: "Calcium Carbonate (CaCO3)",
    category: "Supplements",
    categorySlug: "equipment",
    species: "N/A",
    price: 119,
    mrp: 159,
    rating: 4.7,
    reviewsCount: 90,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Universal",
    tags: ["Supplements", "pH Adjuster", "Casing Prep"],
    image: "/value_innovation.jpg",
    description: "Fine precipitating Calcium Carbonate powder for casing soil neutralization and spawn production.",
    yield: "Treats 60kg casing",
    temp: "N/A",
    humidity: "N/A",
    harvestDays: "N/A",
    storage: "Dry room",
    benefits: "Neutralizes acidity in peat moss casing.",
    instructions: ["Mix into peat moss or coir casing until pH reaches 7.2 - 7.5."],
    faqs: []
  },
  {
    id: "eq-wheat-straw",
    name: "Wheat Straw Sterilized 2kg",
    scientificName: "Chopped & Cleaned Wheat Straw",
    category: "Substrates",
    categorySlug: "equipment",
    species: "N/A",
    price: 249,
    mrp: 329,
    rating: 4.9,
    reviewsCount: 260,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Universal",
    tags: ["Substrates", "Pre-cut 2-3cm", "Oyster Favorite"],
    image: "/shroooms_farm_story.png",
    description: "Dust-free, pre-chopped 2-3cm golden wheat straw. Ideal substrate for Oyster & Milky mushrooms.",
    yield: "Fills 4-5 fruiting bags when hydrated",
    temp: "N/A",
    humidity: "N/A",
    harvestDays: "N/A",
    storage: "Dry storage",
    benefits: "Optimal fiber length for high mycelial colonization speed.",
    instructions: ["Pasteurize with hot water (65°C for 2h) or chemical Chuna soak."],
    faqs: []
  },
  {
    id: "eq-neem-oil",
    name: "Pure Neem Oil 100ml",
    scientificName: "Azadirachta indica Cold Pressed",
    category: "Chemicals",
    categorySlug: "equipment",
    species: "N/A",
    price: 179,
    mrp: 229,
    rating: 4.8,
    reviewsCount: 115,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Universal",
    tags: ["Organic Pest Control", "Mite Control", "Fungi-Safe"],
    image: "/cultivar_turkey_tail.jpg",
    description: "100% cold-pressed organic neem oil. Natural repellent for fungus gnats, phorid flies, and crop mites.",
    yield: "Makes 20-30 liters spray",
    temp: "N/A",
    humidity: "N/A",
    harvestDays: "N/A",
    storage: "Cool dark place",
    benefits: "Zero chemical residue organic pest shield.",
    instructions: ["Mix 5ml Neem Oil + 2ml liquid soap per liter of warm water, spray growing room walls and floor."],
    faqs: []
  },
  {
    id: "eq-bavistin",
    name: "Bavistin 100gm",
    scientificName: "Carbendazim 50% WP Systemic Fungicide",
    category: "Chemicals",
    categorySlug: "equipment",
    species: "N/A",
    price: 199,
    mrp: 249,
    rating: 4.7,
    reviewsCount: 205,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Universal",
    tags: ["Chemicals", "Green Mold Shield", "Substrate Treatment"],
    image: "/cultivar_chaga.jpg",
    description: "Broad-spectrum systemic fungicide specifically used in Indian Oyster farming to prevent green mold (Trichoderma).",
    yield: "Treats 200kg wet straw",
    temp: "N/A",
    humidity: "N/A",
    harvestDays: "N/A",
    storage: "Sealed dry cabinet",
    benefits: "Prevents loss from Trichoderma green mold infection.",
    instructions: ["Add 7.5g Bavistin per 100L water during hot/cold straw soaking process."],
    faqs: []
  },
  {
    id: "eq-formaldehyde",
    name: "Formaldehyde Solution 500ml",
    scientificName: "37% Formalin Disinfectant",
    category: "Chemicals",
    categorySlug: "equipment",
    species: "N/A",
    price: 249,
    mrp: 299,
    rating: 4.6,
    reviewsCount: 130,
    availability: "In Stock",
    difficulty: "Commercial",
    climate: "Universal",
    tags: ["Chemicals", "Lab Disinfectant", "Fumigation"],
    image: "/cultivar_reishi.jpg",
    description: "37% lab grade Formalin solution for room fumigation and chemical straw pasteurization.",
    yield: "Fumigates 500 sq ft room",
    temp: "N/A",
    humidity: "N/A",
    harvestDays: "N/A",
    storage: "Cool locked chemical cabinet",
    benefits: "Eliminates airborne bacterial and fungal spores.",
    instructions: ["Use with respirator mask: mix 40ml Formalin + 15g Potassium Permanganate for room gas fumigation."],
    faqs: []
  },
  {
    id: "eq-plantomycin",
    name: "Plantomycin 25gm",
    scientificName: "Streptomycin Sulfate + Tetracycline Antibiotic",
    category: "Chemicals",
    categorySlug: "equipment",
    species: "N/A",
    price: 159,
    mrp: 199,
    rating: 4.8,
    reviewsCount: 88,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Universal",
    tags: ["Chemicals", "Anti-Bacterial", "Biotch Control"],
    image: "/value_freshness.jpg",
    description: "Agricultural bactericide formula to prevent bacterial blotch and yellowing on mushroom caps.",
    yield: "Treats 500L spray water",
    temp: "N/A",
    humidity: "N/A",
    harvestDays: "N/A",
    storage: "Dry dark place",
    benefits: "Protects white caps from brown bacterial spots.",
    instructions: ["Dissolve 5g in 100L water, mist on casing layer or straw substrate."],
    faqs: []
  },
  {
    id: "eq-indofil",
    name: "INDOFIL M-45 100gm",
    scientificName: "Mancozeb 75% WP Contact Fungicide",
    category: "Chemicals",
    categorySlug: "equipment",
    species: "N/A",
    price: 189,
    mrp: 239,
    rating: 4.6,
    reviewsCount: 75,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Universal",
    tags: ["Chemicals", "Fungicide", "Spore Shield"],
    image: "/cultivar_maitake.jpg",
    description: "Protective contact fungicide to safeguard mushroom compost and casing beds from fungal competitors.",
    yield: "Treats 150L solution",
    temp: "N/A",
    humidity: "N/A",
    harvestDays: "N/A",
    storage: "Sealed container",
    benefits: "Broad spectrum protection against competitor molds.",
    instructions: ["Spray 2g/L on growing chamber walls prior to cropping."],
    faqs: []
  },
  {
    id: "eq-waste-decomposer",
    name: "Waste Decomposer 50g",
    scientificName: "NCOF Bio-Fertilizer Culture",
    category: "Substrates",
    categorySlug: "equipment",
    species: "N/A",
    price: 99,
    mrp: 149,
    rating: 4.9,
    reviewsCount: 290,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Universal",
    tags: ["Substrates", "Organic Decomposer", "Bio-Culture"],
    image: "/value_sustainability.jpg",
    description: "National Centre of Organic Farming bio-culture for rapid breakdown of agricultural waste and post-harvest compost.",
    yield: "Prepares 200L solution",
    temp: "N/A",
    humidity: "N/A",
    harvestDays: "N/A",
    storage: "Room temp",
    benefits: "Converts spent mushroom substrate into high-value organic manure.",
    instructions: ["Mix 50g in 200L water with 2kg jaggery, ferment for 7 days before applying to compost pile."],
    faqs: []
  },

  // ── GROW KITS (11 items) ──
  {
    id: "gk-blue-oyster",
    name: "Blue Oyster Grow Kit",
    scientificName: "Pleurotus ostreatus var. columbinus",
    category: "Grow Kits",
    categorySlug: "grow-kits",
    species: "Pleurotus",
    price: 699,
    mrp: 899,
    rating: 4.9,
    reviewsCount: 310,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Cool Climate (15-22°C)",
    tags: ["Grow Kit", "Beginner Friendly", "Guaranteed Harvest", "Gift Pack"],
    image: "/box_blue_oyster.jpg",
    description: "All-in-one ready to fruit countertop grow box. Includes fully colonized block, spray mister bottle & setup guide.",
    yield: "600g - 1.0kg total over 3 flushes",
    temp: "15 - 22°C",
    humidity: "Mist 2-3 times daily",
    harvestDays: "First flush in 10-14 days",
    storage: "Start immediately or refrigerate box up to 3 weeks",
    benefits: "Fun, educational, 100% organic home-grown gourmet fresh mushrooms.",
    instructions: [
      "Cut an 'X' in the plastic plastic window on front of box.",
      "Mist the cut opening twice daily with included spray bottle.",
      "Watch pins pop out in 7 days and double in size every 24 hours!",
      "Twist and pull cluster to harvest; soak block in water for flush 2."
    ],
    faqs: [
      { q: "Is it guaranteed to grow?", a: "Yes, 100% harvest guarantee! If your kit doesn't fruit, we send a replacement free." }
    ]
  },
  {
    id: "gk-pink-oyster",
    name: "Pink Oyster Grow Kit",
    scientificName: "Pleurotus djamor",
    category: "Grow Kits",
    categorySlug: "grow-kits",
    species: "Pleurotus",
    price: 699,
    mrp: 899,
    rating: 4.9,
    reviewsCount: 280,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Warm Climate (20-30°C)",
    tags: ["Grow Kit", "Beginner Friendly", "Tropical", "Fast Growing"],
    image: "/box_pink_oyster.jpg",
    description: "Vibrant tropical pink mushroom grow kit. Grows insanely fast in warm Indian weather!",
    yield: "550g - 900g total over 2-3 flushes",
    temp: "22 - 30°C",
    humidity: "Mist 2-3 times daily",
    harvestDays: "First flush in 7-10 days",
    storage: "Do NOT refrigerate; open and start immediately",
    benefits: "Beautiful pink clusters cook into crisp savory bacon-flavored bites.",
    instructions: ["Slit plastic 'X', spray mist twice daily, harvest pink bouquets!"],
    faqs: []
  },
  {
    id: "gk-white-oyster",
    name: "White Oyster Grow Kit",
    scientificName: "Pleurotus florida",
    category: "Grow Kits",
    categorySlug: "grow-kits",
    species: "Pleurotus",
    price: 649,
    mrp: 799,
    rating: 4.8,
    reviewsCount: 190,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "All-Season (18-26°C)",
    tags: ["Grow Kit", "Beginner Friendly", "All-Season"],
    image: "/banner_pouches.jpg",
    description: "Classic White Oyster desktop grow box.",
    yield: "650g - 1.0kg over 3 flushes",
    temp: "18 - 26°C",
    humidity: "Mist twice daily",
    harvestDays: "10-14 days",
    storage: "Start within 3 weeks",
    benefits: "High yield, mild versatile culinary taste.",
    instructions: ["Cut opening, spray mist, harvest."],
    faqs: []
  },
  {
    id: "gk-golden-oyster",
    name: "Golden Oyster Grow Kit",
    scientificName: "Pleurotus citrinopileatus",
    category: "Grow Kits",
    categorySlug: "grow-kits",
    species: "Pleurotus",
    price: 699,
    mrp: 899,
    rating: 4.8,
    reviewsCount: 145,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Warm Climate (20-28°C)",
    tags: ["Grow Kit", "Beginner Friendly", "Bright Yellow"],
    image: "/shroooms_product_showcase.png",
    description: "Sunshine yellow golden oyster desktop grow box.",
    yield: "500g - 850g total",
    temp: "20 - 28°C",
    humidity: "Mist 3 times daily",
    harvestDays: "8-12 days",
    storage: "Keep at room temp",
    benefits: "Eye-catching yellow cluster display.",
    instructions: ["Expose to ambient light and spray mist."],
    faqs: []
  },
  {
    id: "gk-grey-oyster",
    name: "Grey Oyster Grow Kit",
    scientificName: "Pleurotus sajor-caju",
    category: "Grow Kits",
    categorySlug: "grow-kits",
    species: "Pleurotus",
    price: 649,
    mrp: 799,
    rating: 4.9,
    reviewsCount: 230,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "All-Season (20-30°C)",
    tags: ["Grow Kit", "Beginner Friendly", "Resilient"],
    image: "/shrooom.jpg",
    description: "Heavy flushing Grey Oyster kitchen grow box.",
    yield: "700g - 1.1kg total",
    temp: "20 - 30°C",
    humidity: "Mist twice daily",
    harvestDays: "10-14 days",
    storage: "Start within 1 month",
    benefits: "Super resilient all-climate home kit.",
    instructions: ["Mist front opening daily."],
    faqs: []
  },
  {
    id: "gk-king-oyster",
    name: "King Oyster Grow Kit",
    scientificName: "Pleurotus eryngii",
    category: "Grow Kits",
    categorySlug: "grow-kits",
    species: "Pleurotus",
    price: 799,
    mrp: 999,
    rating: 4.9,
    reviewsCount: 160,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Cool Climate (14-18°C)",
    tags: ["Grow Kit", "Gourmet King", "Thick Stem"],
    image: "/box_king_oyster.jpg",
    description: "Premium King Oyster stem grow box with casing layer included.",
    yield: "400g - 650g dense thick stems",
    temp: "14 - 18°C",
    humidity: "High misting",
    harvestDays: "18-22 days",
    storage: "Refrigerate until setup",
    benefits: "Slice into gourmet plant-based steak medallions.",
    instructions: ["Top open bag, apply casing peat, mist daily."],
    faqs: []
  },
  {
    id: "gk-lions-mane",
    name: "Lion's Mane Grow Kit",
    scientificName: "Hericium erinaceus",
    category: "Grow Kits",
    categorySlug: "grow-kits",
    species: "Hericium",
    price: 899,
    mrp: 1099,
    rating: 5.0,
    reviewsCount: 420,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Cool Climate (18-24°C)",
    tags: ["Grow Kit", "Nootropic", "Brain Health", "Bestseller"],
    image: "/box_lions_mane.jpg",
    description: "Grow your own fresh brain-boosting Lion's Mane pom-pom mushrooms right on your office desk or kitchen counter!",
    yield: "500g - 900g total over 2-3 flushes",
    temp: "18 - 24°C",
    humidity: "Mist 3 times daily",
    harvestDays: "14-18 days",
    storage: "Refrigerate up to 4 weeks before opening",
    benefits: "Fresh home harvest delivers peak bioactive NGF nerve growth factors.",
    instructions: ["Slit 2-inch line in bag, mist daily, harvest when icicles are 1/2 inch long!"],
    faqs: [{ q: "How to cook?", a: "Sauté in butter and garlic for seafood lobster flavor!" }]
  },
  {
    id: "gk-reishi",
    name: "Reishi Grow Kit",
    scientificName: "Ganoderma lucidum",
    category: "Grow Kits",
    categorySlug: "grow-kits",
    species: "Ganoderma",
    price: 899,
    mrp: 1099,
    rating: 4.9,
    reviewsCount: 115,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Warm Climate (22-28°C)",
    tags: ["Grow Kit", "Medicinal", "Adaptogen", "Decorative"],
    image: "/cultivar_reishi.jpg",
    description: "Grow magnificent glossy red Reishi antler or conk sculptures at home. Medicinal tea source.",
    yield: "200g - 350g dried medicinal conk",
    temp: "22 - 28°C",
    humidity: "Mist daily",
    harvestDays: "45-60 days",
    storage: "Keep in cool dry spot",
    benefits: "Long-term home wellness decor & organic tea supply.",
    instructions: ["Open top bag, watch red glossy antlers form over weeks."],
    faqs: []
  },
  {
    id: "gk-shiitake",
    name: "Shiitake Grow Kit",
    scientificName: "Lentinula edodes",
    category: "Grow Kits",
    categorySlug: "grow-kits",
    species: "Lentinula",
    price: 899,
    mrp: 1099,
    rating: 4.9,
    reviewsCount: 210,
    availability: "In Stock",
    difficulty: "Intermediate",
    climate: "Cool Climate (16-22°C)",
    tags: ["Grow Kit", "Gourmet Umami", "Log Style Block"],
    image: "/cultivar_turkey_tail.jpg",
    description: "Ready-to-burst browned Shiitake log block. Dip in cold water to initiate instant 360° mushroom eruption!",
    yield: "500g - 800g total",
    temp: "16 - 22°C",
    humidity: "Mist humidity dome",
    harvestDays: "7-10 days after cold shock",
    storage: "Refrigerate up to 2 weeks",
    benefits: "Unmatched rich umami broth flavor.",
    instructions: ["Soak block in cold ice water for 10 hours, place on tray, mist daily."],
    faqs: []
  },
  {
    id: "gk-milky",
    name: "Milky Grow Kit",
    scientificName: "Calocybe indica",
    category: "Grow Kits",
    categorySlug: "grow-kits",
    species: "Calocybe",
    price: 649,
    mrp: 799,
    rating: 4.7,
    reviewsCount: 90,
    availability: "In Stock",
    difficulty: "Beginner",
    climate: "Hot Summer (28-38°C)",
    tags: ["Grow Kit", "Summer Crop", "Long Shelf Life"],
    image: "/value_freshness.jpg",
    description: "Indian Summer Milky Mushroom Grow Kit. Comes with pre-mixed casing soil bag.",
    yield: "650g - 1.1kg total",
    temp: "28 - 38°C",
    humidity: "Mist casing soil",
    harvestDays: "14-18 days",
    storage: "Keep at room temp",
    benefits: "Heavy yield during peak hot summer months.",
    instructions: ["Apply casing soil layer on top of block, mist daily."],
    faqs: []
  },
  {
    id: "gk-enoki",
    name: "Enoki Grow Kit",
    scientificName: "Flammulina filiformis",
    category: "Grow Kits",
    categorySlug: "grow-kits",
    species: "Flammulina",
    price: 799,
    mrp: 999,
    rating: 4.8,
    reviewsCount: 85,
    availability: "In Stock",
    difficulty: "Commercial",
    climate: "Cold Climate (10-15°C)",
    tags: ["Grow Kit", "Cold Climate", "Asian Noodle"],
    image: "/cultivar_lions_mane.jpg",
    description: "Countertop Enoki Jar kit with tall collar to produce long velvety white stems.",
    yield: "350g - 550g total",
    temp: "10 - 15°C",
    humidity: "Mist inside collar",
    harvestDays: "20-25 days",
    storage: "Refrigerate block before use",
    benefits: "Crispy delicious salad and soup topping.",
    instructions: ["Keep in cold room, pull collar up, mist inside collar."],
    faqs: []
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PRODUCTS PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const ProductsPage = () => {
  const dispatch = useDispatch();
  
  // Theme Toggle State (Light vs Dark)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSpecies, setSelectedSpecies] = useState("all");
  const [priceMax, setPriceMax] = useState(1500);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedClimate, setSelectedClimate] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  // UI Interactive States
  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showImageSearchModal, setShowImageSearchModal] = useState(false);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Canvas Parallax Particles Ref
  const canvasRef = useRef(null);

  // Trigger Toast Notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3200);
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    showToast(!isDarkMode ? "🌙 Dark Mode Activated" : "☀️ Light Mode Activated");
  };

  // Voice Search Simulation
  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      showToast("Voice Search not supported on this browser. Try Chrome.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    setIsVoiceSearching(true);
    showToast("🎙 Listening... Speak product name now");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsVoiceSearching(false);
      showToast(`Searching for: "${transcript}"`);
    };

    recognition.onerror = () => {
      setIsVoiceSearching(false);
      showToast("Voice recognition error. Try typing.");
    };

    recognition.onend = () => {
      setIsVoiceSearching(false);
    };

    recognition.start();
  };

  // Canvas Floating Spore Particle Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? "rgba(200, 155, 93, " : "rgba(230, 126, 140, ",
      alpha: Math.random() * 0.5 + 0.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#C89B5D";
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Filter & Sort Logic
  const filteredProductsList = useMemo(() => {
    return MASTER_PRODUCTS.filter((prod) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = prod.name.toLowerCase().includes(q);
        const matchSci = prod.scientificName.toLowerCase().includes(q);
        const strokeCat = prod.category.toLowerCase().includes(q);
        if (!matchName && !matchSci && !strokeCat) return false;
      }

      // Strict Category Filtering
      if (!matchesCategory(prod.category, selectedCategory) && selectedCategory !== "all") {
        return false;
      }

      // Species
      if (selectedSpecies !== "all" && prod.species !== selectedSpecies) {
        return false;
      }

      // Price Max
      if (prod.price > priceMax) return false;

      // Difficulty
      if (selectedDifficulty !== "all" && prod.difficulty !== selectedDifficulty) {
        return false;
      }

      // Climate
      if (selectedClimate !== "all" && !prod.climate.toLowerCase().includes(selectedClimate.toLowerCase())) {
        return false;
      }

      // Tags
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((t) => prod.tags.includes(t));
        if (!hasAllTags) return false;
      }

      // In Stock Only
      if (inStockOnly && prod.availability !== "In Stock") return false;

      // Min Rating
      if (prod.rating < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "popular") return b.reviewsCount - a.reviewsCount;
      return 0; // "featured"
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedSpecies,
    priceMax,
    selectedDifficulty,
    selectedClimate,
    selectedTags,
    inStockOnly,
    minRating,
    sortBy
  ]);

  // Handle Add to Cart
  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    dispatch({
      type: "PURCHASING_STATE",
      payload: {
        _id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.availability === "In Stock" ? 20 : 0
      },
      id: product.id
    });
    showToast(`🛒 Added "${product.name}" to cart!`);
  };

  // Toggle Wishlist
  const toggleWishlist = (id, e) => {
    if (e) e.stopPropagation();
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id));
      showToast("Removed from Wishlist");
    } else {
      setWishlist([...wishlist, id]);
      showToast("❤️ Saved to Wishlist!");
    }
  };

  // Toggle Compare
  const toggleCompare = (prod, e) => {
    if (e) e.stopPropagation();
    if (compareList.some((item) => item.id === prod.id)) {
      setCompareList(compareList.filter((item) => item.id !== prod.id));
      showToast("Removed from Compare drawer");
    } else {
      if (compareList.length >= 4) {
        showToast("Maximum 4 products can be compared at once.");
        return;
      }
      setCompareList([...compareList, prod]);
      showToast(`⚖️ Added "${prod.name}" to Compare!`);
    }
  };

  // Toggle Tag Filter Chip
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Reset All Filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSpecies("all");
    setPriceMax(1500);
    setSelectedDifficulty("all");
    setSelectedClimate("all");
    setSelectedTags([]);
    setInStockOnly(false);
    setMinRating(0);
    setSortBy("featured");
    showToast("Filters reset to default.");
  };

  return (
    <div className={`shroooms-products-page ${isDarkMode ? "shroooms-dark-mode" : ""}`}>
      {/* Toast Notification Floating Pill */}
      {toastMessage && <div className="shroooms-toast-pill">{toastMessage}</div>}

      {/* Dark/Light Floating Toggle Button */}
      <button className="shroooms-theme-toggle-btn" onClick={toggleDarkMode} title="Toggle Dark/Light Mode">
        {isDarkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      {/* ═════════════════════════════════════════════════════════════════════
          1. HERO SECTION (3D Floating Spore Canvas Background)
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="shop-hero-section">
        <canvas ref={canvasRef} className="hero-spore-canvas" />

        <div className="shop-hero-container">
          <span className="shop-hero-badge">
            <span className="badge-pulse-dot" /> INDIA'S #1 MUSHROOM MARKETPLACE
          </span>

          <h1 className="shop-hero-title">
            Premium Mushroom Spawn, <br />
            <em className="hero-title-italic">Liquid Culture</em> & Farm Supplies
          </h1>

          <p className="shop-hero-subtitle">
            Everything a mushroom grower needs in one place. Lab-isolated strains, 
            autoclavable supplies, and guaranteed harvest grow kits.
          </p>

          <div className="shop-hero-actions">
            <a href="#catalog-grid" className="btn-hero-primary">
              Shop Now <i className="fa fa-arrow-right" />
            </a>
            <a href="#category-nav" className="btn-hero-secondary">
              Browse Categories
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hero-metrics-bar">
            <div className="metric-item">
              <span className="metric-num">50+</span>
              <span className="metric-label">Isolated Strains</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-num">99.8%</span>
              <span className="metric-label">Lab Purity</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-num">100%</span>
              <span className="metric-label">Harvest Guarantee</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-num">15,000+</span>
              <span className="metric-label">Growers Served</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          2. CATEGORY NAVIGATION (Animated Cards with 3D Glass Icons)
          ═════════════════════════════════════════════════════════════════════ */}
      <section id="category-nav" className="shop-categories-section">
        <div className="category-section-head">
          <span className="cat-eyebrow">EXPLORE BY CATEGORY</span>
          <h2 className="cat-section-title">Curated Mushroom Cultivation Essentials</h2>
        </div>

        <div className="shop-category-grid">
          {[
            { id: "spawn", icon: "🍄", name: "Mushroom Spawn", count: "16 Strains", desc: "Grain spawn ready for substrate inoculation." },
            { id: "liquid-culture", icon: "🧪", name: "Liquid Culture", count: "14 Syringes", desc: "Pure isolated liquid mycelium syringes." },
            { id: "grow-kits", icon: "🌱", name: "Grow Kits", count: "11 All-In-One", desc: "Countertop ready-to-fruit gourmet blocks." },
            { id: "equipment", icon: "🪵", name: "Substrates", count: "4 Products", desc: "Hardwood sawdust, straw & supplements." },
            { id: "equipment", icon: "🛍", name: "Farm Equipment", count: "5 Products", desc: "0.2 micron filter patch PP bags & supplies." },
            { id: "equipment", icon: "🌿", name: "Supplements", count: "4 Products", desc: "Gypsum, chalk powder & mineral nutrients." },
            { id: "equipment", icon: "⚗", name: "Chemicals", count: "4 Products", desc: "Hydrated lime, Bavistin & lab disinfectants." }
          ].map((cat, idx) => (
            <button
              key={idx}
              className={`category-nav-card ${selectedCategory === cat.id ? "active-cat" : ""}`}
              onClick={() => {
                setSelectedCategory(cat.id);
                const gridElem = document.getElementById("catalog-grid");
                if (gridElem) gridElem.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="cat-card-glass-glow" />
              <div className="cat-3d-icon">{cat.icon}</div>
              <h3 className="cat-card-name">{cat.name}</h3>
              <span className="cat-card-count">{cat.count}</span>
              <p className="cat-card-desc">{cat.desc}</p>
              <span className="cat-card-link">Explore Category →</span>
            </button>
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          3. SEARCH & CONTROLS TOOLBAR (Animated Search + Voice Search)
          ═════════════════════════════════════════════════════════════════════ */}
      <section id="catalog-grid" className="shop-toolbar-section">
        <div className="shop-search-bar-wrapper">
          <div className={`search-input-capsule ${isVoiceSearching ? "voice-listening" : ""}`}>
            <i className="fa fa-search search-icon" />
            <input
              type="text"
              className="shop-search-input"
              placeholder="Search Blue Oyster, Lion's Mane, Grow Kit, Bavistin, PP Bags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                ✕
              </button>
            )}
            <button
              className={`voice-search-btn ${isVoiceSearching ? "active" : ""}`}
              onClick={handleVoiceSearch}
              title="Voice Search"
            >
              🎙
            </button>
            <button
              className="image-search-btn"
              onClick={() => setShowImageSearchModal(true)}
              title="Search by Mushroom Photo"
            >
              📷
            </button>
          </div>

          {/* Instant Suggestions Chips */}
          <div className="search-suggestions-row">
            <span className="sugg-label">Popular Searches:</span>
            {["Lion's Mane", "Blue Oyster", "Pink LC", "Grow Kit", "Bavistin", "Filter Bags"].map((sugg, i) => (
              <button key={i} className="sugg-chip" onClick={() => setSearchQuery(sugg)}>
                {sugg}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode & Sort Row */}
        <div className="toolbar-controls-row">
          <button className="mobile-filter-drawer-btn" onClick={() => setIsFilterMobileOpen(true)}>
            <i className="fa fa-sliders" /> Filters ({selectedTags.length + (selectedCategory !== "all" ? 1 : 0)})
          </button>

          <div className="results-counter">
            Showing <strong>{filteredProductsList.length}</strong> of {MASTER_PRODUCTS.length} products
          </div>

          <div className="controls-right-group">
            <div className="sort-dropdown-wrapper">
              <label htmlFor="sort-select">Sort by:</label>
              <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured Strains</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated (★ 5.0)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="view-mode-toggle">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                田
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List View"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          4. MAIN CATALOG LAYOUT (Sidebar Filters + Products Grid)
          ═════════════════════════════════════════════════════════════════════ */}
      <div className="shop-main-layout">
        {/* ── FILTER SIDEBAR ── */}
        <aside className={`shop-sidebar-filters ${isFilterMobileOpen ? "mobile-drawer-open" : ""}`}>
          <div className="sidebar-header-row">
            <h3><i className="fa fa-filter" /> Filter Catalog</h3>
            <button className="mobile-close-drawer" onClick={() => setIsFilterMobileOpen(false)}>✕</button>
          </div>

          {/* Filter Group: Category */}
          <div className="filter-group">
            <h4 className="filter-group-title">Category Isolation</h4>
            <div className="filter-options-stack">
              {CANONICAL_CATEGORIES.map((c, i) => (
                <label key={i} className="filter-radio-label">
                  <input
                    type="radio"
                    name="category-radio"
                    checked={selectedCategory.toLowerCase() === c.name.toLowerCase() || (selectedCategory === "all" && c.name === "All")}
                    onChange={() => setSelectedCategory(c.name)}
                  />
                  <span>{c.icon} {c.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Group: Species */}
          <div className="filter-group">
            <h4 className="filter-group-title">Mushroom Species</h4>
            <select
              className="filter-select-input"
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
            >
              <option value="all">All Genus Species</option>
              <option value="Pleurotus">Pleurotus (Oyster Family)</option>
              <option value="Hericium">Hericium (Lion's Mane)</option>
              <option value="Ganoderma">Ganoderma (Reishi)</option>
              <option value="Lentinula">Lentinula (Shiitake)</option>
              <option value="Flammulina">Flammulina (Enoki)</option>
              <option value="Calocybe">Calocybe (Milky)</option>
              <option value="Cordyceps">Cordyceps (Militaris)</option>
              <option value="Agaricus">Agaricus (Button)</option>
              <option value="Volvariella">Volvariella (Paddy Straw)</option>
              <option value="Hypsizygus">Hypsizygus (Elm)</option>
              <option value="Grifola">Grifola (Maitake)</option>
            </select>
          </div>

          {/* Filter Group: Price Range */}
          <div className="filter-group">
            <div className="filter-title-row">
              <h4 className="filter-group-title">Price Range</h4>
              <span className="price-val-tag">Up to ₹{priceMax}</span>
            </div>
            <input
              type="range"
              min="99"
              max="1500"
              step="50"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="price-slider"
            />
            <div className="slider-labels">
              <span>₹99</span>
              <span>₹1,500+</span>
            </div>
          </div>

          {/* Filter Group: Growing Difficulty */}
          <div className="filter-group">
            <h4 className="filter-group-title">Difficulty Level</h4>
            <div className="filter-chips-row">
              {["all", "Beginner", "Intermediate", "Commercial"].map((diff, i) => (
                <button
                  key={i}
                  className={`chip-btn ${selectedDifficulty === diff ? "active" : ""}`}
                  onClick={() => setSelectedDifficulty(diff)}
                >
                  {diff === "all" ? "Any" : diff}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Group: Climate */}
          <div className="filter-group">
            <h4 className="filter-group-title">Growing Climate</h4>
            <select
              className="filter-select-input"
              value={selectedClimate}
              onChange={(e) => setSelectedClimate(e.target.value)}
            >
              <option value="all">All Climates</option>
              <option value="Cool">Cool Climate (14-22°C)</option>
              <option value="Warm">Warm Climate (20-30°C)</option>
              <option value="Hot">Hot Summer (28-38°C)</option>
              <option value="All-Season">All-Season</option>
            </select>
          </div>

          {/* Filter Group: Attributes & Tags */}
          <div className="filter-group">
            <h4 className="filter-group-title">Special Attributes</h4>
            <div className="filter-checkbox-grid">
              {["Organic", "Edible", "Medicinal", "Beginner Friendly", "Indoor", "High Yield"].map((tag, i) => (
                <label key={i} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Group: Availability & Rating */}
          <div className="filter-group">
            <h4 className="filter-group-title">Availability & Ratings</h4>
            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>In Stock Only</span>
            </label>

            <div className="rating-filter-buttons">
              {[0, 4.0, 4.5, 4.8].map((rate, i) => (
                <button
                  key={i}
                  className={`rate-chip ${minRating === rate ? "active" : ""}`}
                  onClick={() => setMinRating(rate)}
                >
                  {rate === 0 ? "All Ratings" : `${rate}★ & Above`}
                </button>
              ))}
            </div>
          </div>

          <button className="reset-filters-btn" onClick={resetFilters}>
            🔄 Reset All Filters
          </button>
        </aside>

        {/* ── PRODUCTS DISPLAY GRID ── */}
        <main className={`shop-products-container ${viewMode === "list" ? "list-view-active" : ""}`}>
          {filteredProductsList.length === 0 ? (
            <div className="no-products-found-box">
              <div className="no-prod-icon">🍄</div>
              <h3>No Mushroom Products Found</h3>
              <p>Try adjusting your search query, price slider, or difficulty filters.</p>
              <button className="btn-hero-primary" onClick={resetFilters}>Reset All Filters</button>
            </div>
          ) : (
            <div className="products-grid-wrapper">
              {filteredProductsList.map((product) => (
                <article
                  key={product.id}
                  className="product-luxury-card"
                  onClick={() => setQuickViewProduct(product)}
                >
                  {/* Top Badges & Wishlist Heart */}
                  <div className="card-top-strip">
                    <span className={`prod-cat-badge badge-${product.categorySlug}`}>
                      {product.category}
                    </span>
                    <button
                      className={`card-wishlist-btn ${wishlist.includes(product.id) ? "active" : ""}`}
                      onClick={(e) => toggleWishlist(product.id, e)}
                      title="Add to Wishlist"
                    >
                      ♥
                    </button>
                  </div>

                  {/* High Quality Product Image Container */}
                  <div className="product-card-media-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-card-image"
                      loading="lazy"
                    />
                    <div className="card-media-overlay-glow" />

                    {/* Quick View Floating Action Overlay */}
                    <div className="card-hover-actions">
                      <button
                        className="btn-card-quickview"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewProduct(product);
                        }}
                      >
                        👁 Quick View
                      </button>
                      <button
                        className={`btn-card-compare ${compareList.some(c => c.id === product.id) ? "active" : ""}`}
                        onClick={(e) => toggleCompare(product, e)}
                      >
                        ⚖️ Compare
                      </button>
                    </div>
                  </div>

                  {/* Product Card Body Details */}
                  <div className="product-card-body">
                    <span className="prod-scientific-name">{product.scientificName}</span>
                    <h3 className="prod-title-name">{product.name}</h3>

                    <div className="prod-meta-tags-row">
                      <span className="meta-tag-pill">{product.difficulty}</span>
                      <span className="meta-tag-pill">{product.climate}</span>
                    </div>

                    <div className="prod-rating-row">
                      <span className="stars-fill">★★★★★</span>
                      <span className="rating-num">{product.rating}</span>
                      <span className="reviews-count">({product.reviewsCount})</span>
                    </div>

                    {/* Price & Add to Cart Action Row */}
                    <div className="prod-price-action-row">
                      <div className="price-block">
                        <span className="price-current">₹{product.price}</span>
                        <span className="price-mrp">₹{product.mrp}</span>
                      </div>

                      <button
                        className="btn-card-addtocart"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          5. STICKY COMPARE DRAWER
          ═════════════════════════════════════════════════════════════════════ */}
      {compareList.length > 0 && (
        <div className="shop-compare-sticky-drawer">
          <div className="compare-drawer-header">
            <h4>⚖️ Compare Products ({compareList.length}/4)</h4>
            <button className="close-compare" onClick={() => setCompareList([])}>Clear All</button>
          </div>
          <div className="compare-items-row">
            {compareList.map((item) => (
              <div key={item.id} className="compare-item-chip">
                <img src={item.image} alt={item.name} />
                <div className="compare-item-info">
                  <span className="c-item-name">{item.name}</span>
                  <span className="c-item-price">₹{item.price}</span>
                </div>
                <button className="remove-c-item" onClick={(e) => toggleCompare(item, e)}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          6. QUICK VIEW & FULL PRODUCT DETAILS MODAL
          ═════════════════════════════════════════════════════════════════════ */}
      {quickViewProduct && (
        <div className="shroooms-modal-backdrop" onClick={() => setQuickViewProduct(null)}>
          <div className="shroooms-product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setQuickViewProduct(null)}>✕</button>

            <div className="modal-content-grid">
              {/* Left Column: Image Gallery & 360 View */}
              <div className="modal-media-col">
                <div className="modal-main-image-container">
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="modal-main-img" />
                  <span className="badge-360">360° Interactive View</span>
                </div>
                <div className="modal-thumbs-row">
                  <img src={quickViewProduct.image} alt="Thumb 1" className="thumb-active" />
                  <img src="/shroooms_product_showcase.png" alt="Thumb 2" />
                  <img src="/value_freshness.jpg" alt="Thumb 3" />
                </div>
              </div>

              {/* Right Column: Specifications & Instructions */}
              <div className="modal-details-col">
                <span className="modal-cat-tag">{quickViewProduct.category}</span>
                <h2 className="modal-prod-title">{quickViewProduct.name}</h2>
                <span className="modal-sci-name">{quickViewProduct.scientificName}</span>

                <div className="modal-rating-row">
                  <span className="stars-fill">★★★★★</span>
                  <span className="modal-rate-num">{quickViewProduct.rating}</span>
                  <span className="modal-rev-count">({quickViewProduct.reviewsCount} customer reviews)</span>
                  <span className="stock-status-pill">{quickViewProduct.availability}</span>
                </div>

                <div className="modal-price-box">
                  <span className="modal-price-now">₹{quickViewProduct.price}</span>
                  <span className="modal-price-mrp">₹{quickViewProduct.mrp}</span>
                  <span className="modal-discount-tag">
                    Save {Math.round(((quickViewProduct.mrp - quickViewProduct.price) / quickViewProduct.mrp) * 100)}%
                  </span>
                </div>

                <p className="modal-prod-desc">{quickViewProduct.description}</p>

                {/* Growing Parameters Specs Grid */}
                <div className="modal-specs-dashboard">
                  <div className="spec-tile">
                    <span className="spec-tile-icon">🌡 Temperature</span>
                    <span className="spec-tile-val">{quickViewProduct.temp}</span>
                  </div>
                  <div className="spec-tile">
                    <span className="spec-tile-icon">💧 Humidity</span>
                    <span className="spec-tile-val">{quickViewProduct.humidity}</span>
                  </div>
                  <div className="spec-tile">
                    <span className="spec-tile-icon">🌾 Expected Yield</span>
                    <span className="spec-tile-val">{quickViewProduct.yield}</span>
                  </div>
                  <div className="spec-tile">
                    <span className="spec-tile-icon">⏱ Harvest Time</span>
                    <span className="spec-tile-val">{quickViewProduct.harvestDays}</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="modal-section-block">
                  <h4>🧠 Benefits & Properties</h4>
                  <p>{quickViewProduct.benefits}</p>
                </div>

                {/* Growing Instructions */}
                {quickViewProduct.instructions && (
                  <div className="modal-section-block">
                    <h4>🌱 Growing Instructions</h4>
                    <ol className="modal-instructions-list">
                      {quickViewProduct.instructions.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Modal Action CTA */}
                <div className="modal-action-row">
                  <button
                    className="btn-modal-addtocart"
                    onClick={() => handleAddToCart(quickViewProduct)}
                  >
                    🛒 Add to Cart — ₹{quickViewProduct.price}
                  </button>
                  <Link to={`/product/${quickViewProduct.id}`} className="btn-modal-fullpage">
                    Full Product Page →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          7. IMAGE SEARCH MODAL PLACEHOLDER
          ═════════════════════════════════════════════════════════════════════ */}
      {showImageSearchModal && (
        <div className="shroooms-modal-backdrop" onClick={() => setShowImageSearchModal(false)}>
          <div className="shroooms-image-search-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowImageSearchModal(false)}>✕</button>
            <h3>📷 AI Mushroom Photo Search</h3>
            <p>Upload or drag & drop a photo of any mushroom strain to instantly identify and find matching spawn/kits.</p>
            <div className="image-dropzone">
              <div className="dropzone-icon">📁</div>
              <p>Drag photo here or <strong>browse files</strong></p>
              <span className="dropzone-hint">Supports JPG, PNG, WEBP (Max 10MB)</span>
            </div>
            <button className="btn-hero-secondary" onClick={() => setShowImageSearchModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
