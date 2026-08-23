import axios from "axios";
import { supabase, isSupabaseConfigured } from "./supabase";

// Helper to simulate network latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock database for products (Covering ALL 7 Canonical Categories with Rich Products)
const mockProducts = [
  // ── 1. SPONGES (5 items) ──
  {
    _id: "spg-1",
    name: "Bio-Cellulose Moisture Sponge",
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
    name: "High-Density Aeration Foam Sponge",
    category: "Sponges",
    categorySlug: "sponges",
    image: "/banner_pouches.jpg",
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
    image: "/shrooom.jpg",
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
    image: "/value_freshness.jpg",
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
    image: "/shroooms_product_showcase.png",
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
  {
    _id: "acc-3",
    name: "Heavy-Duty Alcohol Sterilizer Lamp",
    category: "Accessories",
    categorySlug: "accessories",
    image: "/value_innovation.jpg",
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
    image: "/value_premium_quality.jpg",
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
    image: "/banner_pouches.jpg",
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
    image: "/cultivar_chaga.jpg",
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
    image: "/shrooom.jpg",
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
    image: "/cultivar_chaga.jpg",
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
    image: "/shroooms_product_showcase.png",
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
    image: "/cultivar_chaga.jpg",
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
    image: "/banner_pouches.jpg",
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
  },
  {
    _id: "tool-4",
    name: "Hydrated Lime Cold Pasteurizer Powder",
    category: "Tools & Accessories",
    categorySlug: "tools-accessories",
    image: "/shrooom.jpg",
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
    image: "/shroooms_product_showcase.png",
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
    image: "/value_freshness.jpg",
    price: 249,
    unit: "Pack of 50 Ports",
    description: "20mm heavy silicone self-healing injection ports for liquid culture jar lids.",
    benefits: "100+ Syringe Punctures · High Temp Safe",
    badge: "Jar Mod"
  }
];

const getParsedData = (data) => {
  if (!data) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }
  return data;
};

const salt = "shroooms_sec_salt_9083";

const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

axios.interceptors.request.use(async (config) => {
  const { url, method, data } = config;
  
  // 1. GET /api/products
  if (url.includes("/api/products") && method === "get") {
    await delay(300);
    config.adapter = async () => {
      let productsData = [];

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: dbProducts, error } = await supabase
            .from("products")
            .select("*");
          if (!error && dbProducts && dbProducts.length > 0) {
            productsData = dbProducts;
          } else {
            productsData = mockProducts;
          }
        } catch (err) {
          console.error("Failed to fetch products from Supabase, using fallback:", err);
          productsData = mockProducts;
        }
      } else {
        productsData = mockProducts;
      }

      return Promise.resolve({
        data: productsData,
        status: 200,
        statusText: "OK",
        headers: {},
        config
      });
    };
  }

  // 1b. POST /api/products
  else if (url.endsWith("/api/products") && method === "post") {
    await delay(300);
    config.adapter = async () => {
      return Promise.reject(new Error("Catalog modification is disabled."));
    };
  }

  // 1c. PUT /api/products/:id
  else if (url.includes("/api/products/") && method === "put") {
    await delay(300);
    config.adapter = async () => {
      return Promise.reject(new Error("Catalog modification is disabled."));
    };
  }

  // 1d. DELETE /api/products/:id
  else if (url.includes("/api/products/") && method === "delete") {
    await delay(300);
    config.adapter = async () => {
      return Promise.reject(new Error("Catalog modification is disabled."));
    };
  }

  // 2. POST /api/users/sendOTP
  else if (url.includes("/api/users/sendOTP") && method === "post") {
    await delay(300);
    const parsedData = getParsedData(data);
    const phone = parsedData.phone || "9999999999";
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpHash = hashCode(phone + "_" + otp + "_" + salt);

    config.adapter = async () => {
      if (process.env.NODE_ENV === "development") {
        console.log(`%c[Dev OTP Fallback] OTP for ${phone} is: ${otp}`, "color: #ff9900; font-size: 16px; font-weight: bold;");
      }

      return Promise.resolve({
        data: {
          hash: otpHash,
          phone: phone
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config
      });
    };
  }

  // 3. POST /api/users/verifyOTP
  else if (url.includes("/api/users/verifyOTP") && method === "post") {
    await delay(300);
    const parsedData = getParsedData(data);
    const phone = parsedData.phone;
    const submittedHash = parsedData.hash;
    const submittedOtp = parsedData.otp;

    const expectedHash = hashCode(phone + "_" + submittedOtp + "_" + salt);

    config.adapter = () => {
      const isDev = process.env.NODE_ENV === "development";
      if (expectedHash === submittedHash || (isDev && submittedOtp === "1234")) {
        const name = localStorage.getItem("userName_" + phone) || "Gourmet Customer";
        return Promise.resolve({
          data: {
            _id: "usr_" + phone,
            phone: phone,
            userName: name,
            token: "mock_jwt_token_" + phone + "_" + Date.now()
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config
        });
      } else {
        const error = new Error("Request failed with status code 400");
        error.response = {
          status: 400,
          statusText: "Bad Request",
          data: { message: "Invalid OTP code. Please try again." },
          headers: {},
          config
        };
        error.config = config;
        return Promise.reject(error);
      }
    };
  }

  // 4. POST /api/users/testuser
  else if (url.includes("/api/users/testuser") && method === "post") {
    await delay(300);
    config.adapter = () => {
      return Promise.resolve({
        data: {
          _id: "mock_guest_id_202",
          phone: "9999999999",
          userName: "Guest User",
          token: "mock_jwt_token_guest_67890"
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config
      });
    };
  }

  // 4b. PUT /api/users/username
  else if (url.includes("/api/users/username") && method === "put") {
    await delay(100);
    const parsedData = getParsedData(data);
    const name = parsedData.name || "Gourmet Customer";
    config.adapter = () => {
      let activePhone = "9999999999";
      const cachedInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (cachedInfo.phone) {
        activePhone = cachedInfo.phone;
      }
      
      localStorage.setItem("userName_" + activePhone, name);
      
      const updatedUserInfo = {
        ...cachedInfo,
        userName: name
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      return Promise.resolve({
        data: updatedUserInfo,
        status: 200,
        statusText: "OK",
        headers: {},
        config
      });
    };
  }

  // 5. GET /api/wishlist/mywishlist
  else if (url.includes("/api/wishlist/mywishlist") && method === "get") {
    await delay(100);
    config.adapter = async () => {
      let localWishlist = JSON.parse(localStorage.getItem("mock_wishlist") || "[]");
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from("wishlists").select("*");
          if (error) throw error;
          localWishlist = data || [];
          localStorage.setItem("mock_wishlist", JSON.stringify(localWishlist));
        } catch (err) {
          console.error("Failed to fetch wishlist from Supabase:", err);
        }
      }
      return Promise.resolve({
        data: localWishlist,
        status: 200,
        statusText: "OK",
        headers: {},
        config
      });
    };
  }

  // 6. POST /api/wishlist
  else if (url.includes("/api/wishlist") && method === "post") {
    await delay(100);
    const parsedData = getParsedData(data);
    config.adapter = async () => {
      const localWishlist = JSON.parse(localStorage.getItem("mock_wishlist") || "[]");
      const newItem = {
        _id: "wish_" + Date.now(),
        product: parsedData.id
      };
      if (isSupabaseConfigured && supabase) {
        try {
          const { error } = await supabase.from("wishlists").insert([
            {
              _id: newItem._id,
              product: newItem.product,
              created_at: new Date().toISOString()
            }
          ]);
          if (error) throw error;
        } catch (err) {
          console.error("Failed to save wishlist to Supabase:", err);
        }
      }
      if (!localWishlist.some(x => x.product === newItem.product)) {
        localWishlist.push(newItem);
        localStorage.setItem("mock_wishlist", JSON.stringify(localWishlist));
      }
      return Promise.resolve({
        data: newItem,
        status: 200,
        statusText: "OK",
        headers: {},
        config
      });
    };
  }

  // 7. DELETE /api/wishlist/remove
  else if (url.includes("/api/wishlist/remove") && method === "delete") {
    await delay(100);
    const parsedData = getParsedData(config.data);
    const prodId = parsedData ? parsedData.id : null;
    config.adapter = async () => {
      let localWishlist = JSON.parse(localStorage.getItem("mock_wishlist") || "[]");
      if (isSupabaseConfigured && supabase) {
        try {
          const { error } = await supabase.from("wishlists").delete().eq("product", prodId);
          if (error) throw error;
        } catch (err) {
          console.error("Failed to delete wishlist item from Supabase:", err);
        }
      }
      localWishlist = localWishlist.filter(x => x.product !== prodId);
      localStorage.setItem("mock_wishlist", JSON.stringify(localWishlist));
      return Promise.resolve({
        data: { success: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config
      });
    };
  }

  // 8. GET /api/orders/myorders
  else if (url.includes("/api/orders/myorders") && method === "get") {
    await delay(100);
    config.adapter = async () => {
      let localOrders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });
          if (error) throw error;
          localOrders = (data || []).map((row) => {
            return {
              ...row.order_data,
              _id: row._id,
              createdAt: row.created_at
            };
          });
        } catch (err) {
          console.error("Failed to fetch orders from Supabase:", err);
        }
      }

      if (userInfo) {
        localOrders = localOrders.filter(o => {
          const emailMatch = userInfo.email && o.customerAddress?.email?.toLowerCase() === userInfo.email.toLowerCase();
          const phoneMatch = userInfo.phone && o.customerAddress?.phone === userInfo.phone;
          return emailMatch || phoneMatch;
        });
      } else {
        localOrders = [];
      }

      localStorage.setItem("mock_orders", JSON.stringify(localOrders));

      return Promise.resolve({
        data: localOrders,
        status: 200,
        statusText: "OK",
        headers: {},
        config
      });
    };
  }

  // 9. POST /api/orders
  else if (url.includes("/api/orders") && method === "post") {
    await delay(100);
    const parsedData = getParsedData(data);
    config.adapter = async () => {
      const localOrders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
      const newOrder = {
        ...parsedData,
        _id: "ord_" + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      };
      if (isSupabaseConfigured && supabase) {
        try {
          const { error } = await supabase.from("orders").insert([
            {
              _id: newOrder._id,
              created_at: newOrder.createdAt,
              order_data: newOrder
            }
          ]);
          if (error) throw error;
        } catch (err) {
          console.error("Failed to save order to Supabase:", err);
        }
      }
      localOrders.push(newOrder);
      localStorage.setItem("mock_orders", JSON.stringify(localOrders));
      return Promise.resolve({
        data: newOrder,
        status: 201,
        statusText: "Created",
        headers: {},
        config
      });
    };
  }

  // 10. POST /api/create-order
  else if (url.includes("/api/create-order") && method === "post") {
    await delay(200);
    const parsedData = getParsedData(data);
    const amount = parsedData.amount || 10000;
    const currency = parsedData.currency || "INR";
    const mockOrderId = "order_" + Math.random().toString(36).substr(2, 12);
    config.adapter = async () => {
      return Promise.resolve({
        data: {
          order_id: mockOrderId,
          amount: amount,
          currency: currency
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config
      });
    };
  }

  // 11. POST /api/verify-payment
  else if (url.includes("/api/verify-payment") && method === "post") {
    await delay(200);
    const parsedData = getParsedData(data);
    config.adapter = async () => {
      return Promise.resolve({
        data: {
          success: true,
          message: "Payment verified successfully",
          order_id: parsedData.razorpay_order_id || "order_mock",
          payment_id: parsedData.razorpay_payment_id || "pay_mock"
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config
      });
    };
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
