import axios from "axios";
import { supabase, isSupabaseConfigured } from "./supabase";

// Helper to simulate network latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock database for products
const mockProducts = [
  {
    _id: "p1",
    name: "Lion's Mane Mushroom (Premium)",
    image: "/box_lions_mane.jpg",
    price: 499,
    unit: "150 Gm",
    description: "Premium gourmet Lion's Mane. Features a beautiful white, shaggy fluff texture with a mild seafood-like sweet flavor when cooked. Excellent for pan-searing or roasting.",
    purchasing: false,
    quantity: 0,
    benefits: "Premium Harvest · Culinary Grade",
    badge: "New Arrival"
  },
  {
    _id: "p2",
    name: "King Oyster Mushroom (Premium)",
    image: "/box_king_oyster.jpg",
    price: 349,
    unit: "150 Gm",
    description: "Elegant King Oyster Mushrooms, grown for culinary perfection. Dense, meaty stems that slice into scallop-like rounds with a rich, savory umami flavor profile that elevates any gourmet dish.",
    purchasing: false,
    quantity: 0,
    benefits: "Gourmet Culinary Excellence",
    badge: "Chef's Choice"
  },
  {
    _id: "p3",
    name: "Pink Oyster Mushroom (Exotic)",
    image: "/box_pink_oyster.jpg",
    price: 399,
    unit: "150 Gm",
    description: "Vibrant and exotic Pink Oyster Mushrooms. Highly decorative with a rich woodsy flavor and a chewy bacon-like texture when sautéed crisp.",
    purchasing: false,
    quantity: 0,
    benefits: "Rich Flavor · Premium Harvest",
    badge: "Rare Find"
  },
  {
    _id: "p4",
    name: "Blue Oyster Mushroom (Artisan)",
    image: "/box_blue_oyster.jpg",
    price: 399,
    unit: "150 Gm",
    description: "Artisan-grade Blue Oyster Mushrooms. Features beautiful steel-blue caps and dense clustering. Known for its quick-cooking, tender texture and a subtle, mild earthy-anise aroma preferred by gourmet chefs.",
    purchasing: false,
    quantity: 0,
    benefits: "Unique Taste · Artisan Quality",
    badge: "Best Seller"
  },
  {
    _id: "p5",
    name: "Golden Oyster Mushroom (Vibrant)",
    image: "/shrooom.jpg",
    price: 429,
    unit: "150 Gm",
    description: "Stunning yellow Golden Oyster Mushrooms. Offers a delicate aroma with nutty notes and a slightly sweet finish. Grown sustainably on premium hardwood sawdust.",
    purchasing: false,
    quantity: 0,
    benefits: "Nutty Notes · Vibrant Color",
    badge: "Exotic Bloom"
  },
  {
    _id: "p6",
    name: "Reishi Mushroom (Traditional)",
    image: "/cultivar_reishi.jpg",
    price: 599,
    unit: "100 Gm",
    description: "Red Reishi Mushroom. Bitter, woody texture suitable for grinding into culinary tea preparations or stocks.",
    purchasing: false,
    quantity: 0,
    benefits: "Traditional Brew · Hand Picked",
    badge: "Woody Cultivar"
  },
  {
    _id: "p7",
    name: "Shiitake Mushroom (Premium)",
    image: "/cultivar_chaga.jpg",
    price: 299,
    unit: "150 Gm",
    description: "Premium Cultivated Shiitake Mushrooms. Rich in culinary value, carrying deep, smoky-umami profiles that are perfect for pan-frying, soups, or rich broths.",
    purchasing: false,
    quantity: 0,
    benefits: "Traditional Umami · Rich Broths",
    badge: "Chef's Choice"
  },
  {
    _id: "p8",
    name: "Maitake Mushroom (Hen of the Woods)",
    image: "/cultivar_maitake.jpg",
    price: 479,
    unit: "150 Gm",
    description: "Maitake, meaning 'Dancing Mushroom' in Japanese, is prized for its cluster formations resembling feathers. Rich earthy flavor, excellent for roasting, sautéing, or grilling.",
    purchasing: false,
    quantity: 0,
    benefits: "Deep Flavor · Crisp Edges",
    badge: "Premium Cultivated"
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
          if (error) throw error;

          if (!dbProducts || dbProducts.length === 0) {
            console.warn("Supabase products table is empty. Production catalog requires manual DB seeding.");
            if (process.env.NODE_ENV === "production") {
              return Promise.reject(new Error("Catalog temporarily empty. Please contact support."));
            }
            productsData = mockProducts;
          } else {
            productsData = dbProducts;
          }
        } catch (err) {
          console.error("Failed to fetch products from Supabase:", err);
          if (process.env.NODE_ENV === "production") {
            return Promise.reject(new Error("Catalog temporarily unavailable. Database connection issue."));
          }
          productsData = mockProducts;
        }
      } else {
        if (process.env.NODE_ENV === "production") {
          return Promise.reject(new Error("Catalog temporarily unavailable. Supabase is not configured."));
        }
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
    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpHash = hashCode(phone + "_" + otp + "_" + salt);

    config.adapter = async () => {
      // Development-only fallback: log OTP to console for testing without real SMS provider
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
      // Master OTP "1234" is only accepted in development builds for testing convenience
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

      // Filter orders to only return the current logged-in user's orders
      if (userInfo) {
        localOrders = localOrders.filter(o => {
          const emailMatch = userInfo.email && o.customerAddress?.email?.toLowerCase() === userInfo.email.toLowerCase();
          const phoneMatch = userInfo.phone && o.customerAddress?.phone === userInfo.phone;
          return emailMatch || phoneMatch;
        });
      } else {
        localOrders = [];
      }

      // Save user's filtered orders in local mock storage
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

  return config;
}, (error) => {
  return Promise.reject(error);
});
