import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { supabase, isSupabaseConfigured } from "../../supabase";
import vegetablesList from "../../store/actions/actionCreators/productsListAction";
import "./Admin.css";

// ─────────────────────────────────────────────────
// INITIAL DATA
// ─────────────────────────────────────────────────
const INITIAL_TYPES = [
  { id: "T001", name: "Lion's Mane",  scientificName: "Hericium erinaceus", tempRange: "16–19°C", humidity: "85–95%", difficulty: "Medium", flavorProfile: "Seafood-like, mild, tender",    color: "#c4a870", icon: "🦁", visible: true,  daysToFruit: "14–21" },
  { id: "T002", name: "Blue Oyster",  scientificName: "Pleurotus ostreatus",  tempRange: "10–16°C", humidity: "90–95%", difficulty: "Easy",   flavorProfile: "Mild, earthy, savory",           color: "##60a5fa", icon: "🫐", visible: true,  daysToFruit: "7–14"  },
  { id: "T003", name: "Pink Oyster",  scientificName: "Pleurotus djamor",     tempRange: "18–30°C", humidity: "85–95%", difficulty: "Easy",   flavorProfile: "Meaty, bacon-like when cooked",  color: "#d96f7c", icon: "🌸", visible: true,  daysToFruit: "5–10"  },
  { id: "T004", name: "King Oyster",  scientificName: "Pleurotus eryngii",    tempRange: "15–18°C", humidity: "85–90%", difficulty: "Hard",   flavorProfile: "Umami-rich, firm, nutty",         color: "#a28a5c", icon: "👑", visible: true,  daysToFruit: "20–30" },
  { id: "T005", name: "Shiitake",     scientificName: "Lentinula edodes",     tempRange: "10–18°C", humidity: "80–90%", difficulty: "Hard",   flavorProfile: "Smoky, woodsy, deep umami",       color: "#6b7280", icon: "🍄", visible: false, daysToFruit: "30–60" },
];

const FIREBASE_PROJECT = { id: "shroooms", number: "1024943326650" };

const DEFAULT_BLOG_POSTS = [
  {
    id: "adaptogens-stress-relief",
    title: "Demystifying Adaptogens: How Reishi & Lion's Mane Balance Stress",
    category: "science",
    author: "Dr. Elena Rostova",
    date: "June 18, 2026",
    readTime: "5 min read",
    icon: "fa-flask",
    summary: "An in-depth look at beta-glucans, triterpenes, and how functional mushrooms help the nervous system adapt to physical and mental stressors.",
    paragraphs: [
      "In our fast-paced modern world, chronic stress has become a silent epidemic. While the body's stress response is vital for survival, prolonged activation of the fight-or-flight pathway can lead to fatigue, cognitive decline, and weakened immunity. Enter adaptogens—a unique class of natural herbs and fungi that assist the body in maintaining homeostasis under stress.",
      "Reishi (Ganoderma lucidum), often called the 'Mushroom of Immortality', is a primary adaptogen. Scientifically, Reishi contains active triterpenoids called ganoderic acids. These compounds have been shown in laboratory studies to bind to pathways in the central nervous system, calming neuronal excitability and modulating the adrenal response to lower cortisol levels. Many users report improved sleep quality and a feeling of groundedness after regular consumption.",
      "Simultaneously, Lion's Mane (Hericium erinaceus) addresses stress from a cognitive standpoint. It contains two unique families of compounds: hericenones and erinacines. These low-molecular-weight molecules cross the blood-brain barrier to stimulate the synthesis of Nerve Growth Factor (NGF). By encouraging the growth, maintenance, and repair of brain cells, Lion's Mane helps mitigate the neuro-inflammatory markers associated with chronic stress, improving mental clarity and reducing 'brain fog'.",
      "Integrating these functional adaptogens into your routine is simple. Consistent daily intake—whether through fresh sautéed culinary cultivars or concentrated hot water extracts—is key. Adaptogens do not offer a temporary stimulant spike; instead, they build cumulative cellular resilience over weeks of consistent use, empowering your body to stand strong against stress."
    ]
  },
  {
    id: "dry-sear-culinary-science",
    title: "Culinary Masterclass: The Science of the Dry Sear",
    category: "culinary",
    author: "Chef Sanjay Kapoor",
    date: "May 24, 2026",
    readTime: "4 min read",
    icon: "fa-cutlery",
    summary: "Why dry-searing mushrooms in a piping hot skillet before adding butter or oils yields the best texture and maximizes caramelization.",
    paragraphs: [
      "For years, standard culinary school advice suggested melting butter or heating oil in a pan before adding mushrooms. However, if you've ever cooked mushrooms this way, you've likely noticed a common issue: they immediately absorb the fat like tiny sponges, turn soggy, and then release a pool of water, leaving them boiling in their own juices rather than browning.",
      "The science of mushroom structure explains this. Mushrooms are roughly 85% to 92% water, and their cell walls are made of chitin (a tough polymer also found in the shells of crustaceans) rather than cellulose. chintin does not break down easily under heat, meaning mushrooms can withstand high temperatures without turning mushy. To get a perfect brown sear, we must first collapse these cell walls and evaporate the internal moisture.",
      "The dry sear method is simple. Place your sliced mushrooms into a hot, completely dry cast-iron or stainless steel skillet over medium-high heat. Do not add oil, butter, or salt. Spread them in a single layer. Within 2-3 minutes, you will hear a loud sizzling as the mushrooms begin to steam and shrink, releasing their cell-bound water.",
      "Continue cooking for another 3-4 minutes, letting the liquid evaporate. Once the pan is dry again and the edges of the mushrooms start to take on a golden color, it's time to add your fat—butter, olive oil, or ghee—along with minced garlic, shallots, and fresh herbs. The mushrooms, now deflated and partially cooked, will no longer absorb excessive grease. Instead, the fat will coat the outside, crisping the edges and triggering the Maillard reaction for an incredibly rich, caramelized umami flavor."
    ]
  },
  {
    id: "substrate-growing-efficiency",
    title: "Substrate Selection: Hardwood vs. Agricultural Byproducts",
    category: "cultivation",
    author: "Aarav Sharma (Head Grower)",
    date: "April 12, 2026",
    readTime: "7 min read",
    icon: "fa-pagelines",
    summary: "How choosing sawdust, wheat bran, or agricultural straw changes colonization rates and biological efficiency in commercial mushroom farms.",
    paragraphs: [
      "In commercial mushroom cultivation, the media on which your mycelium feeds—known as the substrate—is the single most critical factor determining your crop's yield, speed, and nutritional content. Unlike plants that rely on soil and photosynthesis, mushrooms are saprotrophic, meaning they secrete enzymes to decompose complex organic matter for food.",
      "Wood-decay fungi like Lion's Mane, Shiitake, and Oyster mushrooms naturally decompose lignin and cellulose found in trees. In our automated greenhouse, we replicate this by using sterilized hardwood sawdust (primarily oak or maple) as our base substrate. However, sawdust alone lacks the high nitrogen levels required to produce heavy, dense fruiting bodies.",
      "To solve this, we practice 'substrate formulation' by adding organic agricultural byproducts. We blend the sawdust with wheat bran at a ratio of 80% wood to 20% bran. The wheat bran acts as a nutritional supplement, providing nitrogen, vitamins, and minerals that boost the biological efficiency (the ratio of fresh mushroom weight to dry substrate weight) from a meager 40% to over 100%.",
      "Other farms use agricultural straw (like wheat or paddy straw) which is pasteurized rather than sterilized. Straw is cheaper and excellent for fast-growing Oyster mushrooms, but it doesn't support the slower, wood-loving species like Shiitake or Reishi. By sourcing organic, local hardwood and grain byproducts, we ensure Shroooms' crops grow in a premium, chemical-free environment, yielding the highest concentrations of active health compounds."
    ]
  },
  {
    id: "wood-wide-web-mycelium",
    title: "The Wood Wide Web: Mycelial Networks in Forest Ecosystems",
    category: "science",
    author: "Dr. Elena Rostova",
    date: "March 29, 2026",
    readTime: "6 min read",
    icon: "fa-globe",
    summary: "Exploring the symbiotic underground networks connecting trees, facilitating nutrient exchange, and maintaining soil health.",
    paragraphs: [
      "Beneath the forest floor lies a complex, hidden network that challenges our traditional views of plant competition and individuality. Often referred to as the 'Wood Wide Web', this subterranean infrastructure is constructed by mycorrhizal fungi—underground mycelial threads that weave into and around the roots of trees and plants.",
      "This association is highly symbiotic. Trees, through photosynthesis, produce carbon-rich sugars and share them with the fungi. In exchange, the microscopic mycelial threads, which can navigate tiny soil crevices inaccessible to tree roots, supply the trees with essential water, phosphorus, and nitrogen. A single teaspoon of healthy forest soil can contain miles of these fungal filaments.",
      "More fascinatingly, this network operates as an active communication and distribution channel. If a mature tree has access to abundant sunlight, it can send surplus sugars through the mycelial network to support younger saplings growing in the shade. Furthermore, if a tree is attacked by pests, it can transmit chemical warning signals through the fungus to neighboring trees, allowing them to synthesize defensive toxins before the pests arrive.",
      "Understanding these mycelial networks shifts our perspective of the forest from a collection of competing trees to a cooperative, super-organism. Fungi are not merely decomposers; they are the connectors, neural pathways, and caretakers of the terrestrial biosphere, proving that life thrives best when connected in mutual support."
    ]
  }
];

const DEFAULT_BENEFITS = [
  {
    id: "lions-mane",
    name: "Lion's Mane",
    scientificName: "Hericium erinaceus",
    category: "brain",
    icon: "fa-lightbulb-o",
    summary: "The ultimate natural cognitive enhancer supporting neurogenesis and mental clarity.",
    compounds: ["Hericenones", "Erinacines", "Beta-Glucans"],
    details: [
      "Stimulates Nerve Growth Factor (NGF) synthesis, critical for brain health and memory retention.",
      "Improves focus, concentration, and cognitive speed by supporting myelin sheath health.",
      "Reduces mild symptoms of anxiety and brain fog, promoting emotional balance."
    ],
    color: "#e6dfd1"
  },
  {
    id: "reishi",
    name: "Reishi",
    scientificName: "Ganoderma lucidum",
    category: "immunity",
    icon: "fa-shield",
    summary: "The 'Mushroom of Immortality' known for deep stress relief, sleep, and immune defense.",
    compounds: ["Ganoderic Acids", "Triterpenes", "Polysaccharides"],
    details: [
      "Acts as a powerful adaptogen that modulates the adrenal system to reduce stress hormones.",
      "Enhances deep sleep cycles (REM sleep) by calming the central nervous system.",
      "Supports natural killer (NK) cell activity, enhancing the body's immune surveillance."
    ],
    color: "#d96f7c"
  },
  {
    id: "cordyceps",
    name: "Cordyceps",
    scientificName: "Cordyceps militaris",
    category: "energy",
    icon: "fa-bolt",
    summary: "Natural athletic booster that optimizes oxygen delivery and cellular energy production.",
    compounds: ["Cordycepin", "Adenosine", "Polysaccharides"],
    details: [
      "Increases ATP (adenosine triphosphate) production, the primary fuel for muscle cells.",
      "Optimizes VO2 max (maximum oxygen intake) to reduce fatigue during exertion.",
      "Supports respiratory health by improving pulmonary function and airway dilation."
    ],
    color: "#dcae1d"
  }
];

const DEFAULT_RECIPES = [
  {
    id: "lions-mane-steaks",
    name: "Pan-Seared Lion's Mane Steaks",
    mushroom: "Lion's Mane",
    category: "main",
    time: "20 mins",
    difficulty: "Easy",
    icon: "fa-cutlery",
    summary: "Thick-cut Lion's Mane steaks seared to golden perfection in herb-infused garlic butter.",
    ingredients: [
      "250g fresh Lion's Mane mushroom",
      "2 tbsp unsalted butter (or vegan alternative)",
      "3 garlic cloves, crushed",
      "2 sprigs fresh rosemary",
      "Coarse sea salt & cracked black pepper to taste"
    ],
    steps: [
      "Slice the Lion's Mane mushroom into 1-inch thick slabs.",
      "Heat a dry cast-iron skillet over medium-high heat. Place the mushroom slabs in the pan and sear for 2-3 minutes, using a heavy press or second pan to compress out excess moisture.",
      "Lower the heat to medium. Add butter, crushed garlic, and rosemary sprigs to the skillet.",
      "Tilt the pan and baste the melted butter over the steaks continuously for 4-5 minutes until golden brown and caramelized.",
      "Season generously with sea salt and black pepper. Serve hot."
    ]
  },
  {
    id: "king-oyster-scallops",
    name: "King Oyster Mushroom 'Scallops'",
    mushroom: "King Oyster",
    category: "main",
    time: "25 mins",
    difficulty: "Medium",
    icon: "fa-glass",
    summary: "Thick rounds of King Oyster stems scored, seared, and glazed in white wine and soy sauce.",
    ingredients: [
      "3 large King Oyster mushroom stems",
      "1.5 tbsp olive oil",
      "1 tbsp butter",
      "1 tbsp soy sauce",
      "2 tbsp dry white wine",
      "1 sprig fresh thyme"
    ],
    steps: [
      "Slice the mushroom stems into 1-inch rounds. Score a crosshatch pattern on both flat sides of each round.",
      "Heat olive oil in a skillet over high heat. Add the mushroom rounds scored-side down.",
      "Sear for 3 minutes on each side until a deep golden crust forms.",
      "Reduce heat to medium. Deglaze the pan with white wine and soy sauce.",
      "Add butter and thyme. Baste the scallops in the pan glaze for 2 minutes until tender and juicy. Plate immediately."
    ]
  }
];

const DEFAULT_WHOLESALE = [
  {
    id: "bulk-lions-mane",
    name: "Fresh Lion's Mane (Bulk)",
    packaging: "5kg / 10kg insulated crates",
    suitability: "Fine Dining, Apothecary Extractors, Grocers",
    description: "Hand-picked daily, dense clusters with clean icicle spines. Shipped in temperature-controlled boxes."
  },
  {
    id: "bulk-king-oyster",
    name: "Chef Grade King Oyster (Bulk)",
    packaging: "5kg / 10kg boxes",
    suitability: "culinary Chefs, High-end Vegan Restaurants",
    description: "Thick, firm, clean stems with minimal cap taper. Ideal for scoring, grilling, and meat-replacements."
  }
];

const DEFAULT_CONTACT = {
  address: "77, Phoenix Township, Kelod Hala, Dewas Naka, Indore, Madhya Pradesh, India",
  phone: "+91 92389 09365",
  email: "customar@shrooom.in",
  supportHours: "Fruiting Chamber misting cycles run hourly. Offices closed on National Holidays.",
  helplineHours: "Mon - Sat, 8:00 AM - 6:00 PM"
};

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────
const now = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// ─────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────
const Admin = () => {
  const dispatch = useDispatch();
  const vegetablesData = useSelector((state) => state.products);
  const { vegetables } = vegetablesData;

  // ── Active tab ──
  const [tab, setTab] = useState("overview");

  // ── Admin Security (Supabase Auth & admin_users RLS) ──
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null); // null = checking/unauth, true = verified admin, false = unauth/denied
  const [authLoading, setAuthLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const isMountedRef = useRef(true);

  // ── Blogs ──
  const [blogs, setBlogs] = useState(() => {
    const saved = localStorage.getItem("mock_blogs");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("mock_blogs", JSON.stringify(DEFAULT_BLOG_POSTS));
    return DEFAULT_BLOG_POSTS;
  });
  const [blogModal, setBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    author: "",
    category: "science",
    readTime: "5 min read",
    icon: "fa-flask",
    summary: "",
    content: "",
  });

  // ── Benefits State ──
  const [benefits, setBenefits] = useState(() => {
    const saved = localStorage.getItem("mock_benefits");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("mock_benefits", JSON.stringify(DEFAULT_BENEFITS));
    return DEFAULT_BENEFITS;
  });
  const [benefitsModal, setBenefitsModal] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState(null);
  const [benefitForm, setBenefitForm] = useState({
    name: "",
    scientificName: "",
    category: "brain",
    icon: "fa-lightbulb-o",
    summary: "",
    compounds: "",
    details: "",
    color: "#e6dfd1"
  });

  // ── Recipes State ──
  const [recipesState, setRecipesState] = useState(() => {
    const saved = localStorage.getItem("mock_recipes");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("mock_recipes", JSON.stringify(DEFAULT_RECIPES));
    return DEFAULT_RECIPES;
  });
  const [recipeModal, setRecipeModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipeForm, setRecipeForm] = useState({
    name: "",
    mushroom: "",
    category: "main",
    time: "",
    difficulty: "Easy",
    icon: "fa-cutlery",
    summary: "",
    ingredients: "",
    steps: ""
  });

  // ── Wholesale State ──
  const [wholesaleState, setWholesaleState] = useState(() => {
    const saved = localStorage.getItem("mock_wholesale");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("mock_wholesale", JSON.stringify(DEFAULT_WHOLESALE));
    return DEFAULT_WHOLESALE;
  });
  const [wholesaleModal, setWholesaleModal] = useState(false);
  const [editingWholesale, setEditingWholesale] = useState(null);
  const [wholesaleForm, setWholesaleForm] = useState({
    name: "",
    packaging: "",
    suitability: "",
    description: ""
  });

  const [contactState, setContactState] = useState(() => {
    const saved = localStorage.getItem("mock_contact");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("mock_contact", JSON.stringify(DEFAULT_CONTACT));
    return DEFAULT_CONTACT;
  });

  // ── Inquiries State ──
  const [inquiries, setInquiries] = useState([]);

  // ── Customer Accounts State ──
  const [usersListState, setUsersListState] = useState([]);

  // ── Track component mount state ──
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ── Admin Security & Session restoration ──
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      setIsAdmin(false);
      return;
    }

    const checkInitialSession = async () => {
      try {
        const session = supabase.auth.session();
        if (session && session.user) {
          if (isMountedRef.current) {
            setUser(session.user);
          }
          await verifyAdminMembership(session.user.id);
        } else {
          if (isMountedRef.current) {
            setAuthLoading(false);
            setIsAdmin(null);
          }
        }
      } catch (err) {
        console.error("Initial session check error:", err);
        if (isMountedRef.current) {
          setAuthLoading(false);
          setIsAdmin(false);
        }
      }
    };

    checkInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session && session.user) {
        if (isMountedRef.current) {
          setUser(session.user);
        }
        await verifyAdminMembership(session.user.id);
      } else if (event === "SIGNED_OUT") {
        if (isMountedRef.current) {
          setUser(null);
          setIsAdmin(null);
          setAuthLoading(false);
        }
      }
    });

    return () => {
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  const verifyAdminMembership = async (userId) => {
    if (!supabase) {
      if (isMountedRef.current) {
        setIsAdmin(false);
        setAuthLoading(false);
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userId);

      if (isMountedRef.current) {
        if (!error && data && data.length > 0) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false); // Auth user exists, but is not in admin_users list
        }
      }
    } catch (err) {
      console.error("Admin verification error:", err);
      if (isMountedRef.current) {
        setIsAdmin(false); // Fail closed on DB exception
      }
    } finally {
      if (isMountedRef.current) {
        setAuthLoading(false);
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError("Please enter both email and password.");
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      setLoginError("Supabase connection is not configured.");
      return;
    }

    setLoginSubmitting(true);
    setLoginError("");

    try {
      const { user: authUser, error } = await supabase.auth.signIn({
        email,
        password,
      });

      if (error) {
        if (isMountedRef.current) {
          setLoginError("Invalid credentials. Access Denied.");
        }
      } else if (authUser) {
        if (isMountedRef.current) {
          setUser(authUser);
        }
        await verifyAdminMembership(authUser.id);
      }
    } catch (err) {
      console.error("Login submission error:", err);
      if (isMountedRef.current) {
        setLoginError("An unexpected error occurred during authorization.");
      }
    } finally {
      if (isMountedRef.current) {
        setLoginSubmitting(false);
      }
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Logout error:", err);
      }
    }
    if (isMountedRef.current) {
      setUser(null);
      setIsAdmin(null);
      setAuthLoading(false);
    }
  };

  // ── Sync with Supabase on mount (Admin-only gated) ──
  useEffect(() => {
    const fetchAllSupabaseData = async () => {
      // LocalStorage fallback loads first
      const savedInqs = localStorage.getItem("mock_inquiries");
      if (savedInqs) setInquiries(JSON.parse(savedInqs));
      const savedUsers = localStorage.getItem("mock_users");
      if (savedUsers) setUsersListState(JSON.parse(savedUsers));

      if (isSupabaseConfigured && supabase) {
        try {
          // Fetch Blogs
          const { data: dbBlogs, error: blogErr } = await supabase.from("blogs").select("*");
          if (!blogErr && dbBlogs && dbBlogs.length > 0) {
            const formattedBlogs = dbBlogs.map(b => ({
              ...b,
              readTime: b.read_time || b.readTime,
              content: Array.isArray(b.paragraphs) ? b.paragraphs.join("\n\n") : b.content
            }));
            setBlogs(formattedBlogs);
          }

          // Fetch Benefits
          const { data: dbBenefits, error: benErr } = await supabase.from("benefits").select("*");
          if (!benErr && dbBenefits && dbBenefits.length > 0) {
            setBenefits(dbBenefits);
          }

          // Fetch Recipes
          const { data: dbRecipes, error: recErr } = await supabase.from("recipes").select("*");
          if (!recErr && dbRecipes && dbRecipes.length > 0) {
            setRecipesState(dbRecipes);
          }

          // Fetch Wholesale
          const { data: dbWholesale, error: wholErr } = await supabase.from("wholesale").select("*");
          if (!wholErr && dbWholesale && dbWholesale.length > 0) {
            setWholesaleState(dbWholesale);
          }

          // Fetch Contact
          const { data: dbContact, error: contErr } = await supabase.from("contact").select("*").eq("id", "coordinates");
          if (!contErr && dbContact && dbContact.length > 0) {
            setContactState(dbContact[0]);
          }

          // Fetch Inquiries
          const { data: dbInquiries, error: inqErr } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
          if (!inqErr && dbInquiries) {
            setInquiries(dbInquiries);
          }

          // Fetch Customer Accounts
          const { data: dbUsers, error: userErr } = await supabase.from("users").select("*").order("created_at", { ascending: false });
          if (!userErr && dbUsers) {
            setUsersListState(dbUsers);
          }

          // Fetch Orders
          const { data: dbOrders, error: orderErr } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
          if (!orderErr && dbOrders) {
            const formattedOrders = dbOrders.map(o => {
              const orderDetails = o.order_data || {};
              const customerAddress = orderDetails.customerAddress || {};
              const derivedName = customerAddress.userName || orderDetails.customerDetails?.fullName || "Guest";
              const derivedAddress = [
                customerAddress.flatNumber,
                customerAddress.streetName,
                customerAddress.locality,
                customerAddress.city,
                customerAddress.state
              ].filter(Boolean).join(", ") || orderDetails.customerDetails?.address || "—";

              return {
                ...orderDetails,
                _id: o._id,
                created_at: o.created_at,
                createdAt: orderDetails.createdAt || o.created_at,
                customerDetails: {
                  fullName: derivedName,
                  address: derivedAddress
                },
                orderItems: orderDetails.orderItems || [],
                totalPrice: orderDetails.totalPrice || 0,
                status: orderDetails.status || o.status || 'Paid'
              };
            });
            setOrders(formattedOrders);
          }
        } catch (err) {
          console.error("Error loading data from Supabase in Admin Panel:", err);
        }
      }
    };

    if (isAdmin === true) {
      fetchAllSupabaseData();
    }
  }, [isAdmin]);

  // ── Inquiries Helpers ──
  const handleInquiryStatusChange = async (id, newStatus) => {
    const updated = inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i);
    setInquiries(updated);
    localStorage.setItem("mock_inquiries", JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("inquiries").update({ status: newStatus }).eq("id", id);
      } catch (err) {
        console.error("Supabase update inquiry status error:", err);
      }
    }
  };

  const handleInquiryDelete = async (id) => {
    if (!window.confirm("Delete this customer inquiry permanently?")) return;
    const updated = inquiries.filter(i => i.id !== id);
    setInquiries(updated);
    localStorage.setItem("mock_inquiries", JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("inquiries").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase delete inquiry error:", err);
      }
    }
  };

  const handleUserDelete = async (id) => {
    if (!window.confirm("Delete this customer account permanently?")) return;
    const updated = usersListState.filter(u => u._id !== id);
    setUsersListState(updated);
    localStorage.setItem("mock_users", JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("users").delete().eq("_id", id);
      } catch (err) {
        console.error("Supabase delete user account error:", err);
      }
    }
  };

  // ── Benefits Helpers ──
  const openAddBenefit = () => {
    setEditingBenefit(null);
    setBenefitForm({ name: "", scientificName: "", category: "brain", icon: "fa-lightbulb-o", summary: "", compounds: "", details: "", color: "#e6dfd1" });
    setBenefitsModal(true);
  };
  const openEditBenefit = (b) => {
    setEditingBenefit(b);
    setBenefitForm({
      name: b.name,
      scientificName: b.scientificName || "",
      category: b.category,
      icon: b.icon || "fa-lightbulb-o",
      summary: b.summary || "",
      compounds: (b.compounds || []).join(", "),
      details: (b.details || []).join("\n"),
      color: b.color || "#e6dfd1"
    });
    setBenefitsModal(true);
  };
  const handleBenefitDelete = async (id) => {
    if (!window.confirm("Delete this health benefit entry?")) return;
    const updated = benefits.filter(b => b.id !== id);
    setBenefits(updated);
    localStorage.setItem("mock_benefits", JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("benefits").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase benefit delete error:", err);
      }
    }
  };
  const handleBenefitSave = async (e) => {
    e.preventDefault();
    const formatted = {
      id: editingBenefit ? editingBenefit.id : generateSlug(benefitForm.name),
      name: benefitForm.name,
      scientificName: benefitForm.scientificName,
      category: benefitForm.category,
      icon: benefitForm.icon,
      summary: benefitForm.summary,
      compounds: benefitForm.compounds.split(",").map(c => c.trim()).filter(Boolean),
      details: benefitForm.details.split("\n").map(d => d.trim()).filter(Boolean),
      color: benefitForm.color
    };
    let updated;
    if (editingBenefit) {
      updated = benefits.map(b => b.id === editingBenefit.id ? formatted : b);
    } else {
      updated = [...benefits, formatted];
    }
    setBenefits(updated);
    localStorage.setItem("mock_benefits", JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        const dbFormat = {
          id: formatted.id,
          name: formatted.name,
          scientific_name: formatted.scientificName,
          category: formatted.category,
          icon: formatted.icon,
          summary: formatted.summary,
          compounds: formatted.compounds,
          details: formatted.details,
          color: formatted.color
        };
        await supabase.from("benefits").upsert(dbFormat);
      } catch (err) {
        console.error("Supabase benefit save error:", err);
      }
    }
    setBenefitsModal(false);
  };

  // ── Recipes Helpers ──
  const openAddRecipe = () => {
    setEditingRecipe(null);
    setRecipeForm({ name: "", mushroom: "", category: "main", time: "", difficulty: "Easy", icon: "fa-cutlery", summary: "", ingredients: "", steps: "" });
    setRecipeModal(true);
  };
  const openEditRecipe = (r) => {
    setEditingRecipe(r);
    setRecipeForm({
      name: r.name,
      mushroom: r.mushroom || "",
      category: r.category || "main",
      time: r.time || "",
      difficulty: r.difficulty || "Easy",
      icon: r.icon || "fa-cutlery",
      summary: r.summary || "",
      ingredients: (r.ingredients || []).join("\n"),
      steps: (r.steps || []).join("\n")
    });
    setRecipeModal(true);
  };
  const handleRecipeDelete = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    const updated = recipesState.filter(r => r.id !== id);
    setRecipesState(updated);
    localStorage.setItem("mock_recipes", JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("recipes").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase recipe delete error:", err);
      }
    }
  };
  const handleRecipeSave = async (e) => {
    e.preventDefault();
    const formatted = {
      id: editingRecipe ? editingRecipe.id : generateSlug(recipeForm.name),
      name: recipeForm.name,
      mushroom: recipeForm.mushroom,
      category: recipeForm.category,
      time: recipeForm.time,
      difficulty: recipeForm.difficulty,
      icon: recipeForm.icon,
      summary: recipeForm.summary,
      ingredients: recipeForm.ingredients.split("\n").map(i => i.trim()).filter(Boolean),
      steps: recipeForm.steps.split("\n").map(s => s.trim()).filter(Boolean)
    };
    let updated;
    if (editingRecipe) {
      updated = recipesState.map(r => r.id === editingRecipe.id ? formatted : r);
    } else {
      updated = [...recipesState, formatted];
    }
    setRecipesState(updated);
    localStorage.setItem("mock_recipes", JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("recipes").upsert(formatted);
      } catch (err) {
        console.error("Supabase recipe save error:", err);
      }
    }
    setRecipeModal(false);
  };

  // ── Wholesale Helpers ──
  const openAddWholesale = () => {
    setEditingWholesale(null);
    setWholesaleForm({ name: "", packaging: "", suitability: "", description: "" });
    setWholesaleModal(true);
  };
  const openEditWholesale = (w) => {
    setEditingWholesale(w);
    setWholesaleForm({
      name: w.name,
      packaging: w.packaging || "",
      suitability: w.suitability || "",
      description: w.description || ""
    });
    setWholesaleModal(true);
  };
  const handleWholesaleDelete = async (id) => {
    if (!window.confirm("Delete this wholesale offering?")) return;
    const updated = wholesaleState.filter(w => w.id !== id);
    setWholesaleState(updated);
    localStorage.setItem("mock_wholesale", JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("wholesale").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase wholesale delete error:", err);
      }
    }
  };
  const handleWholesaleSave = async (e) => {
    e.preventDefault();
    const formatted = {
      id: editingWholesale ? editingWholesale.id : generateSlug(wholesaleForm.name),
      name: wholesaleForm.name,
      packaging: wholesaleForm.packaging,
      suitability: wholesaleForm.suitability,
      description: wholesaleForm.description
    };
    let updated;
    if (editingWholesale) {
      updated = wholesaleState.map(w => w.id === editingWholesale.id ? formatted : w);
    } else {
      updated = [...wholesaleState, formatted];
    }
    setWholesaleState(updated);
    localStorage.setItem("mock_wholesale", JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("wholesale").upsert(formatted);
      } catch (err) {
        console.error("Supabase wholesale save error:", err);
      }
    }
    setWholesaleModal(false);
  };

  // ── Contact Helpers ──
  const handleContactSave = async (e) => {
    e.preventDefault();
    localStorage.setItem("mock_contact", JSON.stringify(contactState));
    if (isSupabaseConfigured && supabase) {
      try {
        const dbFormat = {
          id: "coordinates",
          address: contactState.address,
          phone: contactState.phone,
          email: contactState.email,
          support_hours: contactState.supportHours,
          helpline_hours: contactState.helplineHours
        };
        await supabase.from("contact").upsert(dbFormat);
      } catch (err) {
        console.error("Supabase contact save error:", err);
      }
    }
    alert("Contact Details updated successfully!");
  };

  // ── Blog Helpers ──
  const handleBlogSave = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.author || !blogForm.content) {
      return alert("Title, Author, and Content are required.");
    }

    const paragraphs = blogForm.content
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const blogData = {
      title: blogForm.title,
      author: blogForm.author,
      category: blogForm.category,
      readTime: blogForm.readTime || "5 min read",
      icon: blogForm.icon || "fa-book",
      summary: blogForm.summary || (paragraphs[0] ? paragraphs[0].substring(0, 150) + "..." : ""),
      paragraphs: paragraphs,
    };

    let updatedBlogs;
    if (editingBlog) {
      blogData.id = editingBlog.id;
      blogData.date = blogForm.date || editingBlog.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      updatedBlogs = blogs.map(b => b.id === editingBlog.id ? blogData : b);
    } else {
      blogData.id = generateSlug(blogForm.title) || `blog-${Date.now()}`;
      const existingIds = new Set(blogs.map(b => b.id));
      let uniqueId = blogData.id;
      let counter = 1;
      while (existingIds.has(uniqueId)) {
        uniqueId = `${blogData.id}-${counter}`;
        counter++;
      }
      blogData.id = uniqueId;
      blogData.date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      updatedBlogs = [...blogs, blogData];
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const dbFormat = {
          id: blogData.id,
          title: blogData.title,
          author: blogData.author,
          category: blogData.category,
          read_time: blogData.readTime,
          icon: blogData.icon,
          summary: blogData.summary,
          paragraphs: blogData.paragraphs,
          date: blogData.date
        };
        const { error } = await supabase.from("blogs").upsert(dbFormat);
        if (error) {
          console.error("Supabase blog save error:", error);
          alert(`Database save failed: ${error.message}`);
          return;
        }
      } catch (err) {
        console.error("Supabase blog save error:", err);
        alert("Unexpected database error saving blog.");
        return;
      }
    }

    localStorage.setItem("mock_blogs", JSON.stringify(updatedBlogs));
    setBlogs(updatedBlogs);
    setBlogModal(false);
  };

  const handleBlogDelete = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("blogs").delete().eq("id", id);
        if (error) {
          console.error("Supabase blog delete error:", error);
          alert(`Database delete failed: ${error.message}`);
          return;
        }
      } catch (err) {
        console.error("Supabase blog delete error:", err);
        alert("Unexpected database error deleting blog.");
        return;
      }
    }

    const updatedBlogs = blogs.filter(b => b.id !== id);
    localStorage.setItem("mock_blogs", JSON.stringify(updatedBlogs));
    setBlogs(updatedBlogs);
  };

  const handleResetBlogs = async () => {
    if (!window.confirm("Reset blog posts to defaults? This will erase custom posts.")) return;

    if (isSupabaseConfigured && supabase) {
      try {
        for (const post of DEFAULT_BLOG_POSTS) {
          const dbFormat = {
            id: post.id,
            title: post.title,
            author: post.author,
            category: post.category,
            read_time: post.readTime,
            icon: post.icon,
            summary: post.summary,
            paragraphs: post.paragraphs,
            date: post.date
          };
          const { error } = await supabase.from("blogs").upsert(dbFormat);
          if (error) {
            console.error("Supabase reset blogs error:", error);
            alert(`Database reset failed at article "${post.title}": ${error.message}`);
            return;
          }
        }
      } catch (err) {
        console.error("Supabase reset blogs error:", err);
        alert("Unexpected database error resetting blogs.");
        return;
      }
    }

    localStorage.setItem("mock_blogs", JSON.stringify(DEFAULT_BLOG_POSTS));
    setBlogs(DEFAULT_BLOG_POSTS);
  };

  const openAddBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: "",
      author: "",
      category: "science",
      readTime: "5 min read",
      icon: "fa-flask",
      summary: "",
      content: "",
    });
    setBlogModal(true);
  };

  const openEditBlog = (b) => {
    setEditingBlog(b);
    setBlogForm({
      title: b.title,
      author: b.author,
      category: b.category,
      readTime: b.readTime,
      icon: b.icon,
      summary: b.summary,
      content: b.paragraphs ? b.paragraphs.join("\n\n") : "",
      date: b.date || "",
    });
    setBlogModal(true);
  };

  // ── Time ──
  const [clock, setClock] = useState(now());
  useEffect(() => {
    const t = setInterval(() => setClock(now()), 30000);
    return () => clearInterval(t);
  }, []);

  // ── Products ──
  useEffect(() => { dispatch(vegetablesList()); }, [dispatch]);
  const [productModal, setProductModal]   = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: "", price: "", unit: "150 Gm", image: "", benefits: "", badge: "100% Organic", description: "" });
  const [imageUploading, setImageUploading] = useState(false);
  const [imageDragOver, setImageDragOver]   = useState(false);
  const [imageError, setImageError]         = useState("");
  const fileInputRef = useRef(null);

  const uploadImageToSupabase = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setImageError("Sirf image files allowed hain (JPG, PNG, WebP)"); return; }
    if (file.size > 5 * 1024 * 1024) { setImageError("Image 5MB se chhoti honi chahiye"); return; }
    setImageError("");
    setImageUploading(true);
    try {
      const ext  = file.name.split(".").pop();
      const path = `products/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData, publicURL } = supabase.storage.from("product-images").getPublicUrl(path);
      const finalUrl = publicURL || (urlData && (urlData.publicURL || urlData.publicUrl));
      setProductForm(f => ({ ...f, image: finalUrl }));
    } catch (err) {
      console.error("Upload error full details:", err);
      setImageError(`Upload error: ${err.message || err.error || JSON.stringify(err)}`);
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault(); setImageDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadImageToSupabase(file);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", price: "", unit: "150 Gm", image: "", benefits: "", badge: "100% Organic", description: "" });
    setImageError("");
    setProductModal(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({ name: p.name, price: p.price, unit: p.unit, image: p.image, benefits: p.benefits || "", badge: p.badge || "100% Organic", description: p.description || "" });
    setImageError("");
    setProductModal(true);
  };

  const handleProductSave = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return alert("Name & price required.");
    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, { ...productForm, price: Number(productForm.price) });
      } else {
        await axios.post("/api/products", { ...productForm, price: Number(productForm.price) });
      }
      setProductModal(false);
      dispatch(vegetablesList());
    } catch { alert("Save failed — API offline. Changes are local only."); setProductModal(false); dispatch(vegetablesList()); }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      dispatch(vegetablesList());
    } catch {
      alert("Delete failed — API offline.");
    }
  };

  const handleResetCatalog = () => {
    if (!window.confirm("Reset catalog to original 8 default products? This cannot be undone.")) return;
    localStorage.removeItem("mock_products");
    localStorage.removeItem("mock_products_seeded");  // clear seed flag so it re-seeds
    dispatch(vegetablesList());
  };

  // ── Mushroom Types ──
  const [types, setTypes] = useState(INITIAL_TYPES);
  const [typeModal, setTypeModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [typeForm, setTypeForm] = useState({ name: "", scientificName: "", tempRange: "", humidity: "", difficulty: "Easy", flavorProfile: "", color: "#a28a5c", icon: "🍄", daysToFruit: "", visible: true });

  const openAddType = () => {
    setEditingType(null);
    setTypeForm({ name: "", scientificName: "", tempRange: "", humidity: "", difficulty: "Easy", flavorProfile: "", color: "#a28a5c", icon: "🍄", daysToFruit: "", visible: true });
    setTypeModal(true);
  };

  const openEditType = (t) => { setEditingType(t); setTypeForm({ ...t }); setTypeModal(true); };

  const handleTypeSave = (e) => {
    e.preventDefault();
    if (!typeForm.name) return alert("Type name required.");
    if (editingType) {
      setTypes(prev => prev.map(t => t.id === editingType.id ? { ...typeForm, id: editingType.id } : t));
    } else {
      const newId = "T" + String(types.length + 1).padStart(3, "0");
      setTypes(prev => [...prev, { ...typeForm, id: newId }]);
    }
    setTypeModal(false);
  };

  const handleTypeDelete = (id) => {
    if (!window.confirm("Delete this mushroom type?")) return;
    setTypes(prev => prev.filter(t => t.id !== id));
  };

  const toggleTypeVisible = (id) => setTypes(prev => prev.map(t => t.id === id ? { ...t, visible: !t.visible } : t));

  // ── Orders ──
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem("mock_orders") || "[]"));

  const updateOrderStatus = async (id, status) => {
    const updated = orders.map(o => o._id === id ? { ...o, status } : o);
    localStorage.setItem("mock_orders", JSON.stringify(updated));
    setOrders(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existing, error: fetchErr } = await supabase
          .from("orders")
          .select("order_data")
          .eq("_id", id)
          .single();
        
        if (!fetchErr && existing) {
          const currentOrderData = existing.order_data || {};
          currentOrderData.status = status;
          
          const { error: updErr } = await supabase
            .from("orders")
            .update({ order_data: currentOrderData })
            .eq("_id", id);
          if (updErr) throw updErr;
        }
      } catch (err) {
        console.error("Failed to update order status in Supabase:", err);
      }
    }
  };

  // ── Sensors ──
  const [sensors, setSensors] = useState({ t1: 16.4, h1: 92.5, c1: 650, t2: 18.2, h2: 89.8, c2: 710, tI: 22.8, hI: 84.6, cI: 920 });

  useEffect(() => {
    const id = setInterval(() => {
      setSensors(s => ({
        ...s,
        t1: +(s.t1 + (Math.random() - 0.5) * 0.1).toFixed(1),
        h1: +(s.h1 + (Math.random() - 0.5) * 0.2).toFixed(1),
        c1: Math.round(s.c1 + (Math.random() - 0.5) * 6),
        t2: +(s.t2 + (Math.random() - 0.5) * 0.1).toFixed(1),
        h2: +(s.h2 + (Math.random() - 0.5) * 0.2).toFixed(1),
        c2: Math.round(s.c2 + (Math.random() - 0.5) * 8),
      }));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const warn1 = sensors.t1 > 18.5 || sensors.h1 < 88 || sensors.c1 > 850;
  const warn2 = sensors.t2 > 19.5 || sensors.h2 < 83 || sensors.c2 > 950;
  const warnI = sensors.tI > 24.5 || sensors.hI < 78 || sensors.cI > 1100 || sensors.cI < 700;
  const anyWarn = warn1 || warn2 || warnI;

  // ─────────────────────────────────────────────────
  // NAV ITEMS
  // ─────────────────────────────────────────────────
  const navSections = [
    {
      label: "Operations",
      items: [
        { id: "overview",    icon: "⬡", label: "Overview" },
        { id: "batches",     icon: "🌱", label: "Cultivation Batches" },
      ],
    },
    {
      label: "Store",
      items: [
        { id: "products",    icon: "📦", label: "Products",       badge: vegetables ? vegetables.length : 0 },
        { id: "types",       icon: "🍄", label: "Mushroom Types", badge: types.length },
        { id: "orders",      icon: "🛒", label: "Orders",         badge: orders.length || null },
        { id: "blogs",       icon: "📰", label: "Blogs",          badge: blogs.length },
        { id: "inquiries",   icon: "💬", label: "Customer Inquiries", badge: inquiries.filter(i => i.status === "Pending").length || null },
        { id: "users",       icon: "👥", label: "Customer Accounts", badge: usersListState.length || null },
      ],
    },
    {
      label: "Page Content",
      items: [
        { id: "benefits",    icon: "✨", label: "Health Benefits", badge: benefits.length },
        { id: "recipes",     icon: "🍳", label: "Recipes",         badge: recipesState.length },
        { id: "wholesale",   icon: "🤝", label: "Wholesale Info",  badge: wholesaleState.length },
        { id: "contact",     icon: "📞", label: "Contact Details" },
      ],
    }

  ];

  // ─────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────


  const DiffPill = ({ d }) => {
    const colors = { Easy: "green", Medium: "yellow", Hard: "red", Expert: "purple" };
    return <span className={`adm-pill ${colors[d] || "gray"}`}>{d}</span>;
  };

  // ─────────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────────
  if (isAdmin !== true) {
    return (
      <div className="passkey-overlay">
        <style>{`
          .passkey-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at center, #1b281f 0%, #0d120e 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            font-family: 'Outfit', sans-serif;
            color: #e6dfd1;
          }
          .passkey-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(224, 201, 138, 0.15);
            padding: 3.5rem;
            border-radius: 2rem;
            width: 420px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          }
          .passkey-logo {
            height: 5.5rem;
            margin-bottom: 1.5rem;
            object-fit: contain;
          }
          .passkey-title {
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 0.8rem;
            color: #e0c98a;
            letter-spacing: 1px;
          }
          .passkey-desc {
            font-size: 1.2rem;
            opacity: 0.7;
            margin-bottom: 2rem;
            line-height: 1.5;
          }
          .login-input-group {
            text-align: left;
            margin-bottom: 1.5rem;
          }
          .login-label {
            font-size: 1.1rem;
            font-weight: 600;
            color: #e0c98a;
            margin-bottom: 0.5rem;
            display: block;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .login-input {
            width: 100%;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(224, 201, 138, 0.3);
            border-radius: 1rem;
            padding: 1.2rem;
            font-size: 1.4rem;
            color: #fff;
            outline: none;
            transition: all 0.3s ease;
            box-sizing: border-box;
          }
          .login-input:focus {
            border-color: #e0c98a;
            box-shadow: 0 0 10px rgba(224, 201, 138, 0.2);
          }
          .passkey-btn {
            width: 100%;
            background: linear-gradient(135deg, #e0c98a 0%, #b89b5c 100%);
            color: #0d120e;
            border: none;
            border-radius: 1rem;
            padding: 1.2rem;
            font-size: 1.3rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-sizing: border-box;
          }
          .passkey-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(224, 201, 138, 0.3);
          }
          .passkey-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .passkey-error {
            color: #ff6b6b;
            font-size: 1.1rem;
            margin-top: 1.2rem;
            font-weight: 500;
          }
          .shake-animation {
            animation: shake 0.5s;
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-10px); }
            40%, 80% { transform: translateX(10px); }
          }
        `}</style>

        {authLoading ? (
          <div className="passkey-card">
            <img src="/shroooms_logo_full.png" alt="Shroooms" className="passkey-logo" />
            <h2 className="passkey-title font-serif">Verifying Session...</h2>
            <div style={{ padding: "2rem 0" }}>
              <i className="fa fa-spinner fa-spin" style={{ fontSize: "3rem", color: "#e0c98a" }}></i>
            </div>
          </div>
        ) : isAdmin === false ? (
          <div className="passkey-card animate__animated animate__zoomIn">
            <img src="/shroooms_logo_full.png" alt="Shroooms" className="passkey-logo" />
            <h2 className="passkey-title font-serif" style={{ color: "#ff6b6b" }}>Access Denied</h2>
            <p className="passkey-desc">Your account is successfully authenticated but does not possess administrative privileges.</p>
            <div style={{ margin: "2rem 0" }}>
              <i className="fa fa-ban" style={{ fontSize: "4rem", color: "#ff6b6b" }}></i>
            </div>
            <button className="passkey-btn" onClick={handleLogout}>Back to Login</button>
          </div>
        ) : (
          <div className="passkey-card animate__animated animate__zoomIn">
            <img src="/shroooms_logo_full.png" alt="Shroooms" className="passkey-logo" />
            <h2 className="passkey-title font-serif">Security Portal</h2>
            <p className="passkey-desc">Sign in with registered administrative credentials to access the console.</p>
            <form onSubmit={handleLoginSubmit}>
              <div className="login-input-group">
                <label className="login-label">Email Address</label>
                <input
                  type="email"
                  className="login-input"
                  placeholder="admin@shrooom.in"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLoginError("");
                  }}
                  required
                />
              </div>
              <div className="login-input-group" style={{ marginBottom: "2.5rem" }}>
                <label className="login-label">Security Password</label>
                <input
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError("");
                  }}
                  required
                />
              </div>
              <button type="submit" className="passkey-btn" disabled={loginSubmitting}>
                {loginSubmitting ? "Authorizing..." : "Authorize Access"}
              </button>
            </form>
            {loginError && (
              <div className="passkey-error animate__animated animate__headShake">
                <i className="fa fa-exclamation-circle"></i> {loginError}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="admin-page-root">

      {/* ══ SIDEBAR ══ */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo">
          <div className="adm-logo-img-wrap">
            <img src="/shroooms_logo_full.png" alt="Shroooms" className="adm-logo-img" style={{ height:"5.5rem", objectFit:"contain" }} />
          </div>
          <span style={{ fontSize: "1rem", color: "var(--adm-text-muted)", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>Admin Panel</span>
        </div>

        {navSections.map(sec => (
          <div className="adm-sidebar-section" key={sec.label}>
            <div className="adm-sidebar-section-label">{sec.label}</div>
            {sec.items.map(item => (
              <button
                key={item.id}
                className={`adm-nav-btn${tab === item.id ? " active" : ""}`}
                onClick={() => setTab(item.id)}
              >
                <span className="adm-nav-icon">{item.icon}</span>
                {item.label}
                {item.warn && <span className="adm-nav-badge">!</span>}
                {item.badge != null && !item.warn && <span className="adm-nav-badge" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}

        <div className="adm-sidebar-footer">
          <div className="adm-system-status">
            <div className="adm-status-dot"></div>
            System {anyWarn ? "⚠ ALERT" : "Nominal"} · {clock}
          </div>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div className="adm-main">

        {/* TOP BAR */}
        <div className="adm-topbar">
          <div className="adm-topbar-title">
            <h1>
              {tab === "overview"    && "Operations Overview"}
              {tab === "batches"     && "Cultivation Batches"}
              {tab === "products"    && "Product Catalog"}
              {tab === "types"       && "Mushroom Types"}
              {tab === "orders"      && "Customer Orders"}
              {tab === "blogs"       && "Blog Management"}
              {tab === "inquiries"   && "Customer Inquiries"}
              {tab === "users"       && "Customer Accounts"}
              {tab === "benefits"    && "Health Benefits Management"}
              {tab === "recipes"     && "Recipes Management"}
              {tab === "wholesale"   && "Wholesale Offerings"}
              {tab === "contact"     && "Contact Details"}
            </h1>
            <p>Project: <b style={{ color: "#e0c98a" }}>{FIREBASE_PROJECT.id}</b> · #{FIREBASE_PROJECT.number}</p>
          </div>
          <div className="adm-topbar-actions">
            <span className="adm-topbar-chip online">● Live</span>
            {user && <span className="adm-topbar-chip" style={{ textTransform: "none" }}>{user.email}</span>}
            <span className="adm-topbar-chip">{clock}</span>
            <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => window.location.href = "/"}>← Store</button>
            <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={handleLogout} style={{ marginLeft: "1rem", borderColor: "rgba(239, 68, 68, 0.4)", color: "#ef4444" }}>Logout</button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="adm-content">

          {/* ══════════════════ OVERVIEW ══════════════════ */}
          {tab === "overview" && (
            <div className="adm-tab-content">
              {/* Metric Cards */}
              <div className="adm-metrics-row">
                {/* Monthly Revenue */}
                <div className="adm-metric-card" style={{ "--accent": "linear-gradient(90deg,#2b7a4b,#4aad70)" }}>
                  <div className="adm-metric-label">Monthly Revenue</div>
                  <div className="adm-metric-val">₹0</div>
                  <div className="adm-metric-sub">
                    0 orders
                    <span className="adm-metric-badge neu">0%</span>
                  </div>
                </div>

                {/* Active Batches */}
                <div className="adm-metric-card" style={{ "--accent": "linear-gradient(90deg,#b08850,#d4a55c)" }}>
                  <div className="adm-metric-label">Active Batches</div>
                  <div className="adm-metric-val">4</div>
                  <div className="adm-metric-sub">
                    54.0 kg est. yield
                    <span className="adm-metric-badge neu">1 Pinning</span>
                  </div>
                </div>

                {/* Start New Batch */}
                <div className="adm-metric-card dashed" onClick={() => setTab("batches")}>
                  <div className="adm-metric-card-add-icon">+</div>
                  <div className="adm-metric-card-add-label">Start New Batch</div>
                </div>
              </div>

              {/* Charts */}
              <div className="adm-charts-grid">
                {/* Weekly Revenue SVG Chart */}
                <div className="adm-chart-card">
                  <h4>
                    Weekly Revenue — Jun 2026
                    <button className="adm-chart-menu-btn" title="Options">···</button>
                  </h4>
                  <svg className="adm-svg-chart" viewBox="0 0 440 170">
                    {/* Grid lines */}
                    {[30, 75, 120, 150].map(y => (
                      <line key={y} x1="0" y1={y} x2="440" y2={y} stroke="#ede9e0" strokeWidth="1" />
                    ))}
                    <defs>
                      <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2b7a4b" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#2b7a4b" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Flat line (no revenue yet) */}
                    <path d="M 30 150 L 110 150 L 190 150 L 270 150 L 350 150 L 420 150"
                      fill="none" stroke="#2b7a4b" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 30 150 L 110 150 L 190 150 L 270 150 L 350 150 L 420 150 L 420 165 L 30 165 Z"
                      fill="url(#sg1)" />
                    {[[30,150],[110,150],[190,150],[270,150],[350,150],[420,150]].map(([x,y],i) => (
                      <circle key={i} cx={x} cy={y} r="4" fill="#2b7a4b" stroke="#fff" strokeWidth="2" />
                    ))}
                    {["W1","W2","W3","W4","W5"].map((l,i) => (
                      <text key={l} x={30 + i * 98} y="166" fill="#a08c75" fontSize="10" textAnchor="middle">{l}</text>
                    ))}
                  </svg>
                </div>

                {/* Harvest Yield bars */}
                <div className="adm-chart-card">
                  <h4>Harvest Yield by Variety <span>30 days</span></h4>
                  <div className="adm-yield-rows">
                    {[
                      { name: "Oyster Mushroom", kg: 12.4, max: 20, color: "#2b7a4b" },
                      { name: "Lion's Mane",      kg: 8.2,  max: 20, color: "#b08850" },
                      { name: "Shiitake",          kg: 18.5, max: 20, color: "#8b2929" },
                    ].map(v => (
                      <div className="adm-yield-row" key={v.name}>
                        <div className="adm-yield-row-head">
                          <span className="adm-yield-name">{v.name}</span>
                          <span className="adm-yield-kg">{v.kg} kg</span>
                        </div>
                        <div className="adm-yield-bar-track">
                          <div className="adm-yield-bar-fill" style={{ width: `${(v.kg/v.max)*100}%`, background: v.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="adm-yield-view-btn" onClick={() => setTab("batches")}>View Detailed Report</button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="adm-quick-actions-card">
                <h4>Quick Actions</h4>
                <div className="adm-quick-actions-grid">
                  {[
                    { icon: "➕", label: "Add Product",    sub: "Listing & Inventory",  action: () => { setTab("products"); setTimeout(openAddProduct, 100); } },
                    { icon: "🍄", label: "Add Type",       sub: "Botanical Taxonomy",    action: () => { setTab("types");   setTimeout(openAddType, 100); } },
                    { icon: "🛒", label: "Orders",         sub: "Pending Processing",    action: () => setTab("orders") },
                    { icon: "📰", label: "Manage Blogs",   sub: "Journal Entries",       action: () => setTab("blogs") },
                  ].map(q => (
                    <button key={q.label} className="adm-quick-action-btn" onClick={q.action}>
                      <div className="adm-qa-icon-box">{q.icon}</div>
                      <div className="adm-qa-text">
                        <span className="adm-qa-label">{q.label}</span>
                        <span className="adm-qa-sub">{q.sub}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* ══════════════════ BATCHES ══════════════════ */}
          {tab === "batches" && (
            <div className="adm-tab-content">
              <div className="adm-section">
                <div className="adm-section-header"><h2>Active Cultivation Batches</h2></div>
                <div className="adm-section-body adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        {["Batch ID","Variety","Stage","Progress","Env Target","Age","Harvest ETA"].map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id:"B204", variety:"Lion's Mane",  stage:"Fruiting",     prog:75, env:"16°C / 92%", age:"18 days", eta:"in 6 days" },
                        { id:"B205", variety:"King Oyster",  stage:"Pinning",      prog:55, env:"16.5°C / 90%", age:"12 days", eta:"in 12 days" },
                        { id:"B206", variety:"Pink Oyster",  stage:"Colonization", prog:35, env:"22.5°C / 85%", age:"7 days",  eta:"in 18 days" },
                        { id:"B207", variety:"Blue Oyster",  stage:"Spawning",     prog:15, env:"22.8°C / 84%", age:"3 days",  eta:"in 22 days" },
                      ].map(b => {
                        const stageColor = { Fruiting:"#4ade80", Pinning:"#fbbf24", Colonization:"#60a5fa", Spawning:"#a78bfa" }[b.stage] || "#6b7280";
                        return (
                          <tr key={b.id}>
                            <td><span className="adm-mono">{b.id}</span></td>
                            <td><b>{b.variety}</b></td>
                            <td><span className="adm-pill" style={{ background: stageColor + "22", color: stageColor }}>{b.stage}</span></td>
                            <td>
                              <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                                <div style={{ flex:1, height:"6px", background:"rgba(255,255,255,0.08)", borderRadius:"3px" }}>
                                  <div style={{ width:`${b.prog}%`, height:"100%", background:"#a28a5c", borderRadius:"3px" }} />
                                </div>
                                <span style={{ fontSize:"1.2rem", color:"rgba(255,255,255,0.5)", minWidth:"3.5rem" }}>{b.prog}%</span>
                              </div>
                            </td>
                            <td>{b.env}</td>
                            <td>{b.age}</td>
                            <td><span className="adm-pill gold">{b.eta}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ PRODUCTS ══════════════════ */}
          {tab === "products" && (
            <div className="adm-tab-content">
              <div className="adm-actions-bar">
                <h3>Store Catalog ({vegetables ? vegetables.length : 0} products)</h3>
                <div style={{ display:"flex", gap:"1rem" }}>
                  <button className="adm-btn adm-btn-ghost" onClick={handleResetCatalog} title="Restore original 8 default products">↺ Reset Catalog</button>
                  <button className="adm-btn adm-btn-primary" onClick={openAddProduct}>➕ Add Product</button>
                </div>
              </div>
              <div className="adm-section">
                <div className="adm-section-body adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>{["Image","Name","Price","Unit","Badge","Benefits","Actions"].map(h => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {vegetables && vegetables.map(p => (
                        <tr key={p._id}>
                          <td><img src={p.image} alt={p.name} className="adm-thumb" /></td>
                          <td><b>{p.name}</b></td>
                          <td><b style={{ color:"#e0c98a" }}>₹{p.price}</b></td>
                          <td>{p.unit}</td>
                          <td>{p.badge && <span className="adm-pill gold">{p.badge}</span>}</td>
                          <td style={{ fontSize:"1.2rem", color:"rgba(255,255,255,0.4)" }}>{p.benefits || "—"}</td>
                          <td>
                            <div style={{ display:"flex", gap:"0.8rem" }}>
                              <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEditProduct(p)}>Edit</button>
                              <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleProductDelete(p._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ TYPES ══════════════════ */}
          {tab === "types" && (
            <div className="adm-tab-content">
              <div className="adm-actions-bar">
                <h3>Mushroom Variety Catalog ({types.length} types)</h3>
                <button className="adm-btn adm-btn-primary" onClick={openAddType}>➕ Add Type</button>
              </div>
              <div className="adm-cards-grid">
                {types.map(t => (
                  <div key={t.id} className={`adm-type-card${!t.visible ? " hidden-card" : ""}`} style={{ "--card-accent": t.color }}>
                    <div className="adm-type-card-top">
                      <span className="adm-type-emoji">{t.icon}</span>
                      <div>
                        <DiffPill d={t.difficulty} />
                        {" "}
                        <span className={`adm-pill ${t.visible ? "green" : "gray"}`} style={{ fontSize:"1.1rem" }}>{t.visible ? "Live" : "Hidden"}</span>
                      </div>
                    </div>
                    <div className="adm-type-name">{t.name}</div>
                    {t.scientificName && <div className="adm-type-sci">{t.scientificName}</div>}
                    <div className="adm-type-details">
                      {[["🌡 Temp", t.tempRange],["💧 Humidity",t.humidity],["📅 Days",t.daysToFruit],["🍽 Flavor",t.flavorProfile]].map(([l,v]) => (
                        <div className="adm-type-row" key={l}>
                          <span className="adm-type-row-label">{l}</span>
                          <span className="adm-type-row-val">{v || "—"}</span>
                        </div>
                      ))}
                    </div>
                    <div className="adm-type-actions">
                      <button className="adm-btn adm-btn-ghost adm-btn-sm" style={{ flex:1 }} onClick={() => toggleTypeVisible(t.id)}>
                        {t.visible ? "Hide" : "Show"}
                      </button>
                      <button className="adm-btn adm-btn-ghost adm-btn-sm" style={{ flex:1 }} onClick={() => openEditType(t)}>Edit</button>
                      <button className="adm-btn adm-btn-danger adm-btn-sm" style={{ flex:1 }} onClick={() => handleTypeDelete(t.id)}>Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════ ORDERS ══════════════════ */}
          {tab === "orders" && (
            <div className="adm-tab-content">
              <div className="adm-section">
                <div className="adm-section-header"><h2>Customer Orders ({orders.length})</h2></div>
                <div className="adm-section-body">
                  {orders.length === 0 ? (
                    <div className="adm-empty">
                      <span className="adm-empty-icon">🛒</span>
                      <p>No orders yet. Place a purchase from the storefront to see it here.</p>
                    </div>
                  ) : (
                    <div className="adm-table-wrap">
                      <table className="adm-table">
                        <thead>
                          <tr>{["Order ID","Customer","Items","Total","Date","Status"].map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {orders.map(o => (
                            <tr key={o._id}>
                              <td><span className="adm-mono">{o._id?.substr(0,8)}…</span></td>
                              <td>
                                <b>{o.customerDetails?.fullName || "Guest"}</b><br />
                                <span style={{ fontSize:"1.2rem", color:"rgba(0,0,0,0.65)" }}>{o.customerDetails?.address || "—"}</span>
                              </td>
                              <td style={{ fontSize:"1.25rem" }}>{o.orderItems?.map((i,n) => <div key={n}>• {i.name} ×{i.qty}</div>)}</td>
                              <td><b style={{ color:"#5a1827" }}>₹{o.totalPrice}</b></td>
                              <td>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                              <td>
                                <select
                                  value={o.status || "Paid"}
                                  onChange={e => updateOrderStatus(o._id, e.target.value)}
                                  style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", borderRadius:"8px", padding:"0.5rem 0.8rem", fontFamily:"inherit", fontSize:"1.25rem", cursor:"pointer" }}
                                >
                                  {["Paid","Processing","Shipped","Delivered"].map(s => <option key={s} value={s} style={{ background:"#1a1d27" }}>{s}</option>)}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ BLOGS ══════════════════ */}
          {tab === "blogs" && (
            <div className="adm-tab-content">
              <div className="adm-actions-bar">
                <h3>Chronicles / Blog Posts ({blogs.length} articles)</h3>
                <div style={{ display:"flex", gap:"1rem" }}>
                  <button className="adm-btn adm-btn-ghost" onClick={handleResetBlogs} title="Restore default blog articles">↺ Reset Blogs</button>
                  <button className="adm-btn adm-btn-primary" onClick={openAddBlog}>➕ Add Blog Post</button>
                </div>
              </div>
              <div className="adm-section">
                <div className="adm-section-body adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        {["Icon", "Title", "Author", "Category", "Date", "Read Time", "Actions"].map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map(b => (
                        <tr key={b.id}>
                          <td style={{ fontSize: "1.8rem", textAlign: "center" }}>
                            <i className={`fa ${b.icon}`} style={{ color: "#a28a5c" }}></i>
                          </td>
                          <td>
                            <b style={{ fontSize: "1.4rem" }}>{b.title}</b>
                            <div style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.3)", marginTop: "0.2rem" }}>
                              {b.summary}
                            </div>
                          </td>
                          <td>{b.author}</td>
                          <td>
                            <span className={`adm-pill ${b.category === "science" ? "blue" : b.category === "cultivation" ? "green" : "yellow"}`}>
                              {b.category}
                            </span>
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>{b.date}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{b.readTime}</td>
                          <td>
                            <div style={{ display:"flex", gap:"0.8rem" }}>
                              <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEditBlog(b)}>Edit</button>
                              <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleBlogDelete(b.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ CUSTOMER INQUIRIES ══════════════════ */}
          {tab === "inquiries" && (
            <div className="adm-tab-content animate__animated animate__fadeIn">
              <div className="adm-actions-bar">
                <h3>Customer Inquiries ({inquiries.length} received)</h3>
                <span className="adm-topbar-chip online" style={{ fontSize: "1.1rem", padding: "0.5rem 1rem" }}>
                  Pending: {inquiries.filter(i => i.status === "Pending").length}
                </span>
              </div>
              <div className="adm-section">
                <div className="adm-section-body adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        {["Date", "Type", "Contact Details", "Business Info", "Message Query", "Status", "Actions"].map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "3rem", opacity: 0.5 }}>
                            No customer inquiries received yet.
                          </td>
                        </tr>
                      ) : (
                        inquiries.map(i => (
                          <tr key={i.id} style={{ background: i.status === "Pending" ? "rgba(224, 201, 138, 0.03)" : "" }}>
                            <td style={{ fontSize: "1.15rem", whiteSpace: "nowrap" }}>
                              {new Date(i.created_at || Date.now()).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </td>
                            <td>
                              <span className={`adm-pill ${i.type === "wholesale" ? "blue" : "yellow"}`}>
                                {i.type === "wholesale" ? "🤝 Partnership" : "✉ Direct"}
                              </span>
                            </td>
                            <td>
                              <b style={{ fontSize: "1.3rem" }}>{i.name}</b>
                              <div style={{ fontSize: "1.15rem", opacity: 0.7 }}>Email: {i.email}</div>
                              {i.phone && <div style={{ fontSize: "1.15rem", opacity: 0.7 }}>Phone: {i.phone}</div>}
                            </td>
                            <td>
                              {i.type === "wholesale" ? (
                                <>
                                  <b>{i.business_name || i.businessName || "—"}</b>
                                  <div style={{ fontSize: "1.15rem", opacity: 0.7 }}>Type: {i.business_type || i.businessType || "—"}</div>
                                  <div style={{ fontSize: "1.15rem", opacity: 0.7 }}>Vol: {i.volume || "—"}</div>
                                </>
                              ) : (
                                <span style={{ opacity: 0.3 }}>—</span>
                              )}
                            </td>
                            <td style={{ minWidth: "220px" }}>
                              {i.subject && <div style={{ fontSize: "1.1rem", fontWeight: "bold", opacity: 0.8 }}>Subject: {i.subject}</div>}
                              <div style={{ fontSize: "1.2rem", whiteSpace: "pre-wrap", opacity: 0.9 }}>{i.message}</div>
                            </td>
                            <td>
                              <select
                                className="adm-pill"
                                value={i.status}
                                onChange={(e) => handleInquiryStatusChange(i.id, e.target.value)}
                                style={{
                                  background: i.status === "Pending" ? "#5a3d1b" : i.status === "Reviewed" ? "#1b4d3e" : "#1a3b5c",
                                  color: "#fff",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "0.4rem 0.8rem",
                                  borderRadius: "0.4rem"
                                }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Replied">Replied</option>
                              </select>
                            </td>
                            <td>
                              <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleInquiryDelete(i.id)}>Delete</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ CUSTOMER ACCOUNTS ══════════════════ */}
          {tab === "users" && (
            <div className="adm-tab-content animate__animated animate__fadeIn">
              <div className="adm-actions-bar">
                <h3>Registered Customer Accounts ({usersListState.length} users)</h3>
              </div>
              <div className="adm-section">
                <div className="adm-section-body adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        {["Joined Date", "User ID", "Customer Name", "Phone Number", "Email Address", "Wishlist Items", "Actions"].map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {usersListState.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "3rem", opacity: 0.5 }}>
                            No registered customer accounts found.
                          </td>
                        </tr>
                      ) : (
                        usersListState.map(u => (
                          <tr key={u._id}>
                            <td style={{ fontSize: "1.15rem", whiteSpace: "nowrap" }}>
                              {new Date(u.created_at || Date.now()).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })}
                            </td>
                            <td style={{ fontSize: "1.05rem", fontFamily: "monospace", opacity: 0.5 }}>
                              {u._id ? u._id.substring(0, 8) + "..." : "—"}
                            </td>
                            <td>
                              <b style={{ fontSize: "1.3rem" }}>{u.name || "—"}</b>
                            </td>
                            <td>
                              <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{u.phone || "—"}</span>
                            </td>
                            <td>
                              <span style={{ fontSize: "1.2rem" }}>{u.email || "—"}</span>
                            </td>
                            <td>
                              {Array.isArray(u.wishlist) ? (
                                <span className="adm-pill green">{u.wishlist.length} items</span>
                              ) : (
                                <span style={{ opacity: 0.3 }}>0 items</span>
                              )}
                            </td>
                            <td>
                              <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleUserDelete(u._id)}>Delete Account</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ HEALTH BENEFITS ══════════════════ */}
          {tab === "benefits" && (
            <div className="adm-tab-content">
              <div className="adm-actions-bar">
                <h3>Mushroom Benefits Directory ({benefits.length} entries)</h3>
                <div style={{ display:"flex", gap:"1rem" }}>
                  <button className="adm-btn adm-btn-ghost" onClick={() => {
                    if (window.confirm("Reset all health benefits to defaults?")) {
                      setBenefits(DEFAULT_BENEFITS);
                      localStorage.setItem("mock_benefits", JSON.stringify(DEFAULT_BENEFITS));
                    }
                  }}>↺ Reset Benefits</button>
                  <button className="adm-btn adm-btn-primary" onClick={openAddBenefit}>➕ Add Benefit Entry</button>
                </div>
              </div>
              <div className="adm-section">
                <div className="adm-section-body adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        {["Icon", "Mushroom Name", "Category", "Active Compounds", "Details Items", "Actions"].map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {benefits.map(b => (
                        <tr key={b.id}>
                          <td style={{ fontSize: "1.8rem", textAlign: "center" }}>
                            <i className={`fa ${b.icon}`} style={{ color: b.color || "#a28a5c" }}></i>
                          </td>
                          <td>
                            <b style={{ fontSize: "1.4rem" }}>{b.name}</b>
                            {b.scientificName && <div style={{ fontStyle: "italic", fontSize: "1.1rem", opacity: 0.5 }}>{b.scientificName}</div>}
                          </td>
                          <td>
                            <span className="adm-pill yellow">{b.category}</span>
                          </td>
                          <td>{b.compounds?.join(", ") || "—"}</td>
                          <td>{b.details?.length || 0} items</td>
                          <td>
                            <div style={{ display:"flex", gap:"0.8rem" }}>
                              <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEditBenefit(b)}>Edit</button>
                              <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleBenefitDelete(b.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ RECIPES ══════════════════ */}
          {tab === "recipes" && (
            <div className="adm-tab-content">
              <div className="adm-actions-bar">
                <h3>Storefront Recipes Kitchen ({recipesState.length} recipes)</h3>
                <div style={{ display:"flex", gap:"1rem" }}>
                  <button className="adm-btn adm-btn-ghost" onClick={() => {
                    if (window.confirm("Reset all recipes to defaults?")) {
                      setRecipesState(DEFAULT_RECIPES);
                      localStorage.setItem("mock_recipes", JSON.stringify(DEFAULT_RECIPES));
                    }
                  }}>↺ Reset Recipes</button>
                  <button className="adm-btn adm-btn-primary" onClick={openAddRecipe}>➕ Add New Recipe</button>
                </div>
              </div>
              <div className="adm-section">
                <div className="adm-section-body adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        {["Recipe Name", "Mushroom", "Category", "Time", "Difficulty", "Ingredients", "Steps", "Actions"].map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {recipesState.map(r => (
                        <tr key={r.id}>
                          <td><b style={{ fontSize: "1.4rem" }}>{r.name}</b><br /><span style={{ fontSize: "1.15rem", opacity: 0.5 }}>{r.summary}</span></td>
                          <td>{r.mushroom}</td>
                          <td><span className="adm-pill blue">{r.category}</span></td>
                          <td>{r.time}</td>
                          <td><DiffPill d={r.difficulty} /></td>
                          <td>{r.ingredients?.length || 0} items</td>
                          <td>{r.steps?.length || 0} steps</td>
                          <td>
                            <div style={{ display:"flex", gap:"0.8rem" }}>
                              <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEditRecipe(r)}>Edit</button>
                              <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleRecipeDelete(r.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ WHOLESALE ══════════════════ */}
          {tab === "wholesale" && (
            <div className="adm-tab-content">
              <div className="adm-actions-bar">
                <h3>Wholesale Bulk Catalog ({wholesaleState.length} offerings)</h3>
                <div style={{ display:"flex", gap:"1rem" }}>
                  <button className="adm-btn adm-btn-ghost" onClick={() => {
                    if (window.confirm("Reset wholesale offerings to defaults?")) {
                      setWholesaleState(DEFAULT_WHOLESALE);
                      localStorage.setItem("mock_wholesale", JSON.stringify(DEFAULT_WHOLESALE));
                    }
                  }}>↺ Reset Wholesale</button>
                  <button className="adm-btn adm-btn-primary" onClick={openAddWholesale}>➕ Add Bulk Offering</button>
                </div>
              </div>
              <div className="adm-section">
                <div className="adm-section-body adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        {["Offering Name", "Suitability", "Packaging", "Description", "Actions"].map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {wholesaleState.map(w => (
                        <tr key={w.id}>
                          <td><b style={{ fontSize: "1.4rem" }}>{w.name}</b></td>
                          <td><span className="adm-pill green">{w.suitability}</span></td>
                          <td>{w.packaging}</td>
                          <td><div style={{ maxWidth: "300px", fontSize: "1.15rem", opacity: 0.7 }}>{w.description}</div></td>
                          <td>
                            <div style={{ display:"flex", gap:"0.8rem" }}>
                              <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEditWholesale(w)}>Edit</button>
                              <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleWholesaleDelete(w.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ CONTACT DETAILS ══════════════════ */}
          {tab === "contact" && (
            <div className="adm-tab-content">
              <div className="adm-section">
                <div className="adm-section-header"><h2>Edit Contact Page Coordinates</h2></div>
                <div className="adm-section-body">
                  <form onSubmit={handleContactSave}>
                    <div className="adm-form-grid" style={{ marginBottom: "2rem" }}>
                      <div className="adm-form-group full">
                        <label>Farming Greenhouse Address *</label>
                        <input
                          type="text"
                          value={contactState.address}
                          onChange={e => setContactState(c => ({ ...c, address: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="adm-form-group">
                        <label>Helpline / WhatsApp Number *</label>
                        <input
                          type="text"
                          value={contactState.phone}
                          onChange={e => setContactState(c => ({ ...c, phone: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="adm-form-group">
                        <label>Electronic Mail Address *</label>
                        <input
                          type="email"
                          value={contactState.email}
                          onChange={e => setContactState(c => ({ ...c, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="adm-form-group full">
                        <label>Greenhouse Support Hours *</label>
                        <input
                          type="text"
                          value={contactState.supportHours}
                          onChange={e => setContactState(c => ({ ...c, supportHours: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="adm-form-group full">
                        <label>Helpline Operational Hours *</label>
                        <input
                          type="text"
                          value={contactState.helplineHours}
                          onChange={e => setContactState(c => ({ ...c, helplineHours: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button type="submit" className="adm-btn adm-btn-primary">💾 Save Contact Coordinates</button>
                      <button type="button" className="adm-btn adm-btn-ghost" onClick={() => {
                        if (window.confirm("Reset contact coordinates to Indore defaults?")) {
                          setContactState(DEFAULT_CONTACT);
                          localStorage.setItem("mock_contact", JSON.stringify(DEFAULT_CONTACT));
                        }
                      }}>Reset to Default</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ══ PRODUCT MODAL ══ */}
      {productModal && (
        <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setProductModal(false)}>
          <div className="adm-modal">
            <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleProductSave}>
              <div className="adm-form-grid">
                <div className="adm-form-group">
                  <label>Product Name *</label>
                  <input type="text" value={productForm.name} onChange={e=>setProductForm(f=>({...f,name:e.target.value}))} placeholder="Lion's Mane Mushroom" required />
                </div>
                <div className="adm-form-group">
                  <label>Price (₹) *</label>
                  <input type="number" value={productForm.price} onChange={e=>setProductForm(f=>({...f,price:e.target.value}))} placeholder="499" required />
                </div>
                <div className="adm-form-group">
                  <label>Unit Weight</label>
                  <input type="text" value={productForm.unit} onChange={e=>setProductForm(f=>({...f,unit:e.target.value}))} placeholder="150 Gm" />
                </div>
                <div className="adm-form-group">
                  <label>Store Badge</label>
                  <select value={productForm.badge} onChange={e=>setProductForm(f=>({...f,badge:e.target.value}))}>
                    {["100% Organic","Best Seller","Rare Find","Superfood","Adaptogen","Chef's Choice","Premium Cultivated"].map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="adm-form-group full">
                  <label>Product Image</label>

                  {/* ── Upload Zone ── */}
                  <div
                    className={`adm-upload-zone${imageDragOver ? " drag-over" : ""}${imageUploading ? " uploading" : ""}`}
                    onClick={() => !imageUploading && fileInputRef.current.click()}
                    onDragOver={e => { e.preventDefault(); setImageDragOver(true); }}
                    onDragLeave={() => setImageDragOver(false)}
                    onDrop={handleImageDrop}
                  >
                    {imageUploading ? (
                      <div className="adm-upload-loader">
                        <div className="adm-spinner"></div>
                        <span>Upload ho raha hai...</span>
                      </div>
                    ) : productForm.image ? (
                      <div className="adm-upload-preview">
                        <img src={productForm.image} alt="preview" className="adm-preview-img" />
                        <div className="adm-preview-overlay">
                          <span>🔄 Click ya drop karo change karne ke liye</span>
                        </div>
                      </div>
                    ) : (
                      <div className="adm-upload-placeholder">
                        <span className="adm-upload-icon">📁</span>
                        <span className="adm-upload-text">Click karo ya image yahan drag karo</span>
                        <span className="adm-upload-hint">JPG, PNG, WebP · Max 5MB</span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={e => { if (e.target.files[0]) uploadImageToSupabase(e.target.files[0]); }}
                    />
                  </div>

                  {/* ── Error message ── */}
                  {imageError && (
                    <div className="adm-upload-error">⚠ {imageError}</div>
                  )}

                  {/* ── Manual URL fallback ── */}
                  <div style={{ marginTop:"1rem" }}>
                    <label style={{ fontSize:"1.1rem", color:"rgba(255,255,255,0.3)", fontWeight:"600", letterSpacing:"0.5px", display:"block", marginBottom:"0.6rem" }}>
                      YA — seedha URL paste karo
                    </label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={e => setProductForm(f => ({...f, image: e.target.value}))}
                      placeholder="https://example.com/image.jpg"
                      style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", padding:"1rem 1.4rem", color:"#fff", fontFamily:"inherit", fontSize:"1.3rem", outline:"none" }}
                    />
                  </div>

                  {/* ── Current image preview (URL row) ── */}
                  {productForm.image && (
                    <div className="adm-upload-url">
                      <span>🔗</span>
                      <span style={{ wordBreak:"break-all", fontSize:"1.1rem" }}>{productForm.image}</span>
                      <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => setProductForm(f => ({...f, image:""}))}>✕</button>
                    </div>
                  )}
                </div>
                <div className="adm-form-group full">
                  <label>Key Benefits</label>
                  <input type="text" value={productForm.benefits} onChange={e=>setProductForm(f=>({...f,benefits:e.target.value}))} placeholder="Focus · Memory · Wellness" />
                </div>
                <div className="adm-form-group full">
                  <label>Description</label>
                  <textarea rows="4" value={productForm.description} onChange={e=>setProductForm(f=>({...f,description:e.target.value}))} placeholder="Detailed product description..." style={{ resize:"vertical" }} />
                </div>
              </div>
              <div className="adm-form-actions">
                <button type="button" className="adm-btn adm-btn-ghost" onClick={()=>setProductModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary">{editingProduct ? "Update Product" : "Create Product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ TYPE MODAL ══ */}
      {typeModal && (
        <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setTypeModal(false)}>
          <div className="adm-modal">
            <h3>{editingType ? "Edit Mushroom Type" : "Add New Mushroom Type"}</h3>
            <form onSubmit={handleTypeSave}>
              <div className="adm-form-grid">
                <div className="adm-form-group">
                  <label>Type Name *</label>
                  <input type="text" value={typeForm.name} onChange={e=>setTypeForm(f=>({...f,name:e.target.value}))} placeholder="Lion's Mane" required />
                </div>
                <div className="adm-form-group">
                  <label>Scientific Name</label>
                  <input type="text" value={typeForm.scientificName} onChange={e=>setTypeForm(f=>({...f,scientificName:e.target.value}))} placeholder="Hericium erinaceus" />
                </div>
                <div className="adm-form-group">
                  <label>Icon / Emoji</label>
                  <input type="text" value={typeForm.icon} onChange={e=>setTypeForm(f=>({...f,icon:e.target.value}))} placeholder="🍄" />
                </div>
                <div className="adm-form-group">
                  <label>Accent Color</label>
                  <input type="color" value={typeForm.color} onChange={e=>setTypeForm(f=>({...f,color:e.target.value}))} style={{ height:"4.8rem", padding:"0.4rem", cursor:"pointer", borderRadius:"10px" }} />
                </div>
                <div className="adm-form-group">
                  <label>Temperature Range</label>
                  <input type="text" value={typeForm.tempRange} onChange={e=>setTypeForm(f=>({...f,tempRange:e.target.value}))} placeholder="16–19°C" />
                </div>
                <div className="adm-form-group">
                  <label>Humidity Range</label>
                  <input type="text" value={typeForm.humidity} onChange={e=>setTypeForm(f=>({...f,humidity:e.target.value}))} placeholder="85–95%" />
                </div>
                <div className="adm-form-group">
                  <label>Days to Fruit</label>
                  <input type="text" value={typeForm.daysToFruit} onChange={e=>setTypeForm(f=>({...f,daysToFruit:e.target.value}))} placeholder="14–21" />
                </div>
                <div className="adm-form-group">
                  <label>Difficulty</label>
                  <select value={typeForm.difficulty} onChange={e=>setTypeForm(f=>({...f,difficulty:e.target.value}))}>
                    {["Easy","Medium","Hard","Expert"].map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="adm-form-group full">
                  <label>Flavor Profile</label>
                  <input type="text" value={typeForm.flavorProfile} onChange={e=>setTypeForm(f=>({...f,flavorProfile:e.target.value}))} placeholder="Seafood-like, mild, tender" />
                </div>
                <div className="adm-form-group">
                  <label style={{ display:"flex", alignItems:"center", gap:"1rem", cursor:"pointer", textTransform:"none", letterSpacing:0 }}>
                    <input type="checkbox" checked={typeForm.visible} onChange={e=>setTypeForm(f=>({...f,visible:e.target.checked}))} style={{ width:"1.8rem", height:"1.8rem", accentColor:"#a28a5c" }} />
                    Visible on Storefront
                  </label>
                </div>
              </div>
              <div className="adm-form-actions">
                <button type="button" className="adm-btn adm-btn-ghost" onClick={()=>setTypeModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary">{editingType ? "Update Type" : "Add Type"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ BLOG MODAL ══ */}
      {blogModal && (
        <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setBlogModal(false)}>
          <div className="adm-modal">
            <h3>{editingBlog ? "Edit Blog Post" : "Add New Blog Post"}</h3>
            <form onSubmit={handleBlogSave}>
              <div className="adm-form-grid">
                <div className="adm-form-group full">
                  <label>Article Title *</label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Demystifying Adaptogens: How Reishi & Lion's Mane Balance Stress"
                    required
                  />
                </div>
                <div className="adm-form-group">
                  <label>Author Name *</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={e => setBlogForm(f => ({ ...f, author: e.target.value }))}
                    placeholder="Dr. Elena Rostova"
                    required
                  />
                </div>
                <div className="adm-form-group">
                  <label>Category</label>
                  <select
                    value={blogForm.category}
                    onChange={e => setBlogForm(f => ({ ...f, category: e.target.value }))}
                  >
                    <option value="science">Science & Wellness</option>
                    <option value="cultivation">Cultivation</option>
                    <option value="culinary">Culinary</option>
                  </select>
                </div>
                <div className="adm-form-group">
                  <label>Read Time</label>
                  <input
                    type="text"
                    value={blogForm.readTime}
                    onChange={e => setBlogForm(f => ({ ...f, readTime: e.target.value }))}
                    placeholder="5 min read"
                  />
                </div>
                <div className="adm-form-group">
                  <label>Icon (FontAwesome Class)</label>
                  <select
                    value={blogForm.icon}
                    onChange={e => setBlogForm(f => ({ ...f, icon: e.target.value }))}
                    style={{ marginBottom: "0.5rem" }}
                  >
                    <option value="fa-flask">fa-flask (Science / Chemistry)</option>
                    <option value="fa-pagelines">fa-pagelines (Leaf / Growing)</option>
                    <option value="fa-cutlery">fa-cutlery (Knife & Fork / Culinary)</option>
                    <option value="fa-globe">fa-globe (Earth / Network)</option>
                    <option value="fa-book">fa-book (Book)</option>
                    <option value="fa-graduation-cap">fa-graduation-cap (Cap / Education)</option>
                    <option value="fa-info-circle">fa-info-circle (Information)</option>
                    <option value="fa-heartbeat">fa-heartbeat (Health)</option>
                  </select>
                  <input
                    type="text"
                    value={blogForm.icon}
                    onChange={e => setBlogForm(f => ({ ...f, icon: e.target.value }))}
                    placeholder="Or type custom class, e.g. fa-leaf"
                  />
                </div>
                <div className="adm-form-group full">
                  <label>Summary / Eyebrow Text</label>
                  <input
                    type="text"
                    value={blogForm.summary}
                    onChange={e => setBlogForm(f => ({ ...f, summary: e.target.value }))}
                    placeholder="An in-depth look at beta-glucans and functional mushrooms..."
                  />
                </div>
                {editingBlog && (
                  <div className="adm-form-group full">
                    <label>Publish Date (Optional)</label>
                    <input
                      type="text"
                      value={blogForm.date || ""}
                      onChange={e => setBlogForm(f => ({ ...f, date: e.target.value }))}
                      placeholder="e.g. June 18, 2026"
                    />
                  </div>
                )}
                <div className="adm-form-group full">
                  <label>Article Paragraphs (Separate with double newlines/blank lines) *</label>
                  <textarea
                    rows="12"
                    value={blogForm.content}
                    onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Write your article paragraphs here. Use a blank line (double Enter) to separate paragraphs."
                    style={{ resize: "vertical" }}
                    required
                  />
                </div>
              </div>
              <div className="adm-form-actions">
                <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setBlogModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary">{editingBlog ? "Update Post" : "Create Post"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ BENEFITS MODAL ══ */}
      {benefitsModal && (
        <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setBenefitsModal(false)}>
          <div className="adm-modal">
            <h3>{editingBenefit ? "Edit Health Benefit Entry" : "Add New Health Benefit"}</h3>
            <form onSubmit={handleBenefitSave}>
              <div className="adm-form-grid">
                <div className="adm-form-group">
                  <label>Mushroom Name *</label>
                  <input
                    type="text"
                    value={benefitForm.name}
                    onChange={e => setBenefitForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Lion's Mane"
                    required
                  />
                </div>
                <div className="adm-form-group">
                  <label>Scientific Name</label>
                  <input
                    type="text"
                    value={benefitForm.scientificName}
                    onChange={e => setBenefitForm(f => ({ ...f, scientificName: e.target.value }))}
                    placeholder="e.g. Hericium erinaceus"
                  />
                </div>
                <div className="adm-form-group">
                  <label>Category</label>
                  <select
                    value={benefitForm.category}
                    onChange={e => setBenefitForm(f => ({ ...f, category: e.target.value }))}
                  >
                    <option value="brain">Brain &amp; Focus</option>
                    <option value="immunity">Immunity &amp; Longevity</option>
                    <option value="energy">Energy &amp; Stress</option>
                    <option value="wellness">General Wellness</option>
                  </select>
                </div>
                <div className="adm-form-group">
                  <label>Icon (FontAwesome Class)</label>
                  <input
                    type="text"
                    value={benefitForm.icon}
                    onChange={e => setBenefitForm(f => ({ ...f, icon: e.target.value }))}
                    placeholder="e.g. fa-lightbulb-o"
                  />
                </div>
                <div className="adm-form-group full">
                  <label>Summary *</label>
                  <input
                    type="text"
                    value={benefitForm.summary}
                    onChange={e => setBenefitForm(f => ({ ...f, summary: e.target.value }))}
                    placeholder="Brief 1-sentence description"
                    required
                  />
                </div>
                <div className="adm-form-group full">
                  <label>Active Compounds (comma separated) *</label>
                  <input
                    type="text"
                    value={benefitForm.compounds}
                    onChange={e => setBenefitForm(f => ({ ...f, compounds: e.target.value }))}
                    placeholder="e.g. Hericenones, Erinacines, Beta-Glucans"
                    required
                  />
                </div>
                <div className="adm-form-group full">
                  <label>Details / Bullet Points (Separate with new lines) *</label>
                  <textarea
                    rows="5"
                    value={benefitForm.details}
                    onChange={e => setBenefitForm(f => ({ ...f, details: e.target.value }))}
                    placeholder="Write each detail bullet on a new line"
                    required
                  />
                </div>
                <div className="adm-form-group">
                  <label>Theme / Accent Color</label>
                  <input
                    type="color"
                    value={benefitForm.color}
                    onChange={e => setBenefitForm(f => ({ ...f, color: e.target.value }))}
                    style={{ height: "4.5rem", padding: "0.2rem", cursor: "pointer" }}
                  />
                </div>
              </div>
              <div className="adm-form-actions">
                <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setBenefitsModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary">{editingBenefit ? "Update Benefit" : "Create Benefit"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ RECIPE MODAL ══ */}
      {recipeModal && (
        <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setRecipeModal(false)}>
          <div className="adm-modal">
            <h3>{editingRecipe ? "Edit Recipe Details" : "Add New Storefront Recipe"}</h3>
            <form onSubmit={handleRecipeSave}>
              <div className="adm-form-grid">
                <div className="adm-form-group">
                  <label>Recipe Name *</label>
                  <input
                    type="text"
                    value={recipeForm.name}
                    onChange={e => setRecipeForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Creamy Blue Oyster Linguine"
                    required
                  />
                </div>
                <div className="adm-form-group">
                  <label>Mushroom Type *</label>
                  <input
                    type="text"
                    value={recipeForm.mushroom}
                    onChange={e => setRecipeForm(f => ({ ...f, mushroom: e.target.value }))}
                    placeholder="e.g. Blue Oyster"
                    required
                  />
                </div>
                <div className="adm-form-group">
                  <label>Category</label>
                  <select
                    value={recipeForm.category}
                    onChange={e => setRecipeForm(f => ({ ...f, category: e.target.value }))}
                  >
                    <option value="main">Main Dishes</option>
                    <option value="quick">Quick Bites / Tacos</option>
                    <option value="sides">Sides &amp; Starters</option>
                    <option value="wellness">Wellness Beverages</option>
                  </select>
                </div>
                <div className="adm-form-group">
                  <label>Prep / Cook Time</label>
                  <input
                    type="text"
                    value={recipeForm.time}
                    onChange={e => setRecipeForm(f => ({ ...f, time: e.target.value }))}
                    placeholder="e.g. 20 mins"
                  />
                </div>
                <div className="adm-form-group">
                  <label>Difficulty</label>
                  <select
                    value={recipeForm.difficulty}
                    onChange={e => setRecipeForm(f => ({ ...f, difficulty: e.target.value }))}
                  >
                    {["Easy", "Medium", "Hard", "Expert"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="adm-form-group">
                  <label>Icon (FontAwesome Class)</label>
                  <input
                    type="text"
                    value={recipeForm.icon}
                    onChange={e => setRecipeForm(f => ({ ...f, icon: e.target.value }))}
                    placeholder="e.g. fa-cutlery"
                  />
                </div>
                <div className="adm-form-group full">
                  <label>Summary / Description *</label>
                  <input
                    type="text"
                    value={recipeForm.summary}
                    onChange={e => setRecipeForm(f => ({ ...f, summary: e.target.value }))}
                    placeholder="Brief recipe teaser summary"
                    required
                  />
                </div>
                <div className="adm-form-group full">
                  <label>Ingredients (One per line) *</label>
                  <textarea
                    rows="5"
                    value={recipeForm.ingredients}
                    onChange={e => setRecipeForm(f => ({ ...f, ingredients: e.target.value }))}
                    placeholder="e.g. 200g Blue Oyster mushrooms, sliced"
                    required
                  />
                </div>
                <div className="adm-form-group full">
                  <label>Preparation Steps (One per line) *</label>
                  <textarea
                    rows="6"
                    value={recipeForm.steps}
                    onChange={e => setRecipeForm(f => ({ ...f, steps: e.target.value }))}
                    placeholder="e.g. Cook linguine in boiling salted water..."
                    required
                  />
                </div>
              </div>
              <div className="adm-form-actions">
                <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setRecipeModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary">{editingRecipe ? "Update Recipe" : "Create Recipe"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ WHOLESALE MODAL ══ */}
      {wholesaleModal && (
        <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setWholesaleModal(false)}>
          <div className="adm-modal">
            <h3>{editingWholesale ? "Edit Wholesale Offering" : "Add Wholesale Offering"}</h3>
            <form onSubmit={handleWholesaleSave}>
              <div className="adm-form-grid">
                <div className="adm-form-group">
                  <label>Offering Name *</label>
                  <input
                    type="text"
                    value={wholesaleForm.name}
                    onChange={e => setWholesaleForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Fresh Lion's Mane (Bulk)"
                    required
                  />
                </div>
                <div className="adm-form-group">
                  <label>Suitability / Clients</label>
                  <input
                    type="text"
                    value={wholesaleForm.suitability}
                    onChange={e => setWholesaleForm(f => ({ ...f, suitability: e.target.value }))}
                    placeholder="e.g. Fine Dining, Grocers"
                  />
                </div>
                <div className="adm-form-group full">
                  <label>Packaging Info *</label>
                  <input
                    type="text"
                    value={wholesaleForm.packaging}
                    onChange={e => setWholesaleForm(f => ({ ...f, packaging: e.target.value }))}
                    placeholder="e.g. 5kg / 10kg insulated crates"
                    required
                  />
                </div>
                <div className="adm-form-group full">
                  <label>Description *</label>
                  <textarea
                    rows="4"
                    value={wholesaleForm.description}
                    onChange={e => setWholesaleForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Enter description here..."
                    required
                  />
                </div>
              </div>
              <div className="adm-form-actions">
                <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setWholesaleModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary">{editingWholesale ? "Update Offering" : "Create Offering"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
