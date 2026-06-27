import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Recipes.css";

const RECIPES_DATA = [
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
  },
  {
    id: "pink-oyster-tacos",
    name: "Crispy Pink Oyster Tacos",
    mushroom: "Pink Oyster",
    category: "quick",
    time: "15 mins",
    difficulty: "Easy",
    icon: "fa-lemon-o",
    summary: "Vibrant shredded Pink Oyster clusters pan-fried till crispy and served in warm tortillas.",
    ingredients: [
      "200g Pink Oyster mushrooms",
      "1 tbsp taco seasoning mix",
      "1 tbsp lime juice",
      "4 small corn tortillas",
      "1 cup shredded red cabbage",
      "1 ripe avocado, sliced"
    ],
    steps: [
      "Tear the pink oyster mushroom clusters into bite-sized shreds.",
      "Sauté in a dry non-stick skillet over medium-high heat for 3-4 minutes to release moisture.",
      "Add olive oil and taco seasoning. Sauté for another 5 minutes until edges are crisp and golden.",
      "Squeeze fresh lime juice over the mushrooms and toss.",
      "Warm the tortillas. Assemble with cabbage, shredded mushrooms, and fresh avocado slices."
    ]
  },
  {
    id: "blue-oyster-pasta",
    name: "Creamy Blue Oyster Linguine",
    mushroom: "Blue Oyster",
    category: "main",
    time: "30 mins",
    difficulty: "Medium",
    icon: "fa-cutlery",
    summary: "Silky linguine tossed in a rich, garlic-shallot cream sauce with sautéed Blue Oyster mushrooms.",
    ingredients: [
      "200g Blue Oyster mushrooms, sliced",
      "150g linguine pasta",
      "1/2 cup heavy cream (or thick coconut cream)",
      "1 small shallot, finely chopped",
      "2 garlic cloves, minced",
      "1/4 cup grated parmesan cheese"
    ],
    steps: [
      "Cook linguine in salted boiling water according to package instructions. Reserve 1/4 cup pasta water.",
      "Sauté chopped shallots and minced garlic in olive oil until soft.",
      "Add sliced blue oyster mushrooms. Sauté for 6-8 minutes until browned.",
      "Pour in heavy cream and bring to a gentle simmer for 2 minutes.",
      "Toss in cooked linguine, parmesan cheese, and reserved pasta water. Stir until glossy and coated. Garnish with parsley."
    ]
  },
  {
    id: "reishi-golden-milk",
    name: "Reishi Adaptogenic Golden Milk",
    mushroom: "Reishi (Medicinal)",
    category: "wellness",
    time: "10 mins",
    difficulty: "Easy",
    icon: "fa-coffee",
    summary: "A soothing, warm adaptogenic beverage to promote deep relaxation and restful sleep.",
    ingredients: [
      "1 tsp organic Reishi powder (extract)",
      "1/2 tsp ground turmeric",
      "1/4 tsp ground ginger",
      "1.5 cups almond or oat milk",
      "1 tsp honey or maple syrup",
      "1/2 tsp virgin coconut oil",
      "A pinch of ground black pepper"
    ],
    steps: [
      "Pour milk into a small saucepan and heat over low-medium heat until steaming (do not boil).",
      "Whisk in Reishi powder, turmeric, ginger, black pepper, and coconut oil.",
      "Simmer gently for 5 minutes, whisking frequently to dissolve all powders.",
      "Remove from heat, stir in honey, and pour into a mug. Enjoy warm before bedtime."
    ]
  },
  {
    id: "shiitake-broth",
    name: "Restorative Umami Shiitake Broth",
    mushroom: "Shiitake",
    category: "wellness",
    time: "40 mins",
    difficulty: "Easy",
    icon: "fa-leaf",
    summary: "A nourishing, mineral-rich vegetable broth brewed with fresh shiitake, ginger, and kombu.",
    ingredients: [
      "150g Shiitake mushrooms, sliced",
      "1 piece dried Kombu seaweed",
      "1-inch ginger root, sliced",
      "2 garlic cloves, smashed",
      "2 tbsp light soy sauce",
      "4 cups filtered water",
      "2 green onions, chopped"
    ],
    steps: [
      "In a medium pot, combine water, sliced shiitake, kombu, ginger, and garlic.",
      "Bring to a boil, then immediately reduce heat to low. Cover and simmer for 30 minutes.",
      "Discard the kombu piece. Stir in soy sauce.",
      "Simmer for another 5 minutes to combine flavors.",
      "Ladle the hot broth and mushrooms into bowls, garnish with fresh green onions, and serve."
    ]
  }
];

const Recipes = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  // Apply botanical watermark on mount and clean up on unmount
  useEffect(() => {
    const handleBgResize = () => {
      if (window.innerWidth > 1200) {
        document.body.style.backgroundImage = "url('/shroooms_bg_decor.png'), url('/shroooms_bg_decor.png')";
        document.body.style.backgroundPosition = "left -150px top 120px, right -150px top 120px";
        document.body.style.backgroundRepeat = "no-repeat, no-repeat";
        document.body.style.backgroundSize = "450px auto, 450px auto";
        document.body.style.backgroundAttachment = "fixed, fixed";
      } else {
        document.body.style.backgroundImage = "";
      }
    };

    handleBgResize();
    window.addEventListener("resize", handleBgResize);

    return () => {
      window.removeEventListener("resize", handleBgResize);
      document.body.style.backgroundImage = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundAttachment = "";
    };
  }, []);

  const toggleRecipeExpand = (id) => {
    if (expandedRecipe === id) {
      setExpandedRecipe(null);
    } else {
      setExpandedRecipe(id);
    }
  };

  const [recipes, setRecipes] = useState(RECIPES_DATA);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { supabase, isSupabaseConfigured } = await import("../../supabase");
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from("recipes").select("*");
          if (!error && data && data.length > 0) {
            setRecipes(data);
            return;
          }
        } catch (err) {
          console.error("Supabase recipes fetch error:", err);
        }
      }
      const saved = localStorage.getItem("mock_recipes");
      if (saved) {
        setRecipes(JSON.parse(saved));
      } else {
        localStorage.setItem("mock_recipes", JSON.stringify(RECIPES_DATA));
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = activeCategory === "all" || 
      recipe.category === activeCategory ||
      (activeCategory === "salads" && (recipe.category === "salads" || recipe.category === "sides"));
    const matchesSearch = 
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.mushroom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="recipes-container">
      <div className="recipes-inner animate__animated animate__fadeIn">
        <header className="recipes-header-section">
          <span className="recipes-eyebrow">Culinary Arts</span>
          <h1 className="recipes-title">The Shroooms Kitchen</h1>
          <p className="recipes-subtitle">
            Master the art of cooking gourmet mushrooms. Discover professional culinary techniques and therapeutic wellness infusions.
          </p>
          <div className="recipes-divider"></div>
        </header>

        {/* Search & Filter Toolbar */}
        <div className="recipes-toolbar">
          <div className="recipes-search-wrapper">
            <i className="fa fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search recipes or mushrooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="recipes-search-input"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                <i className="fa fa-times"></i>
              </button>
            )}
          </div>

          <div className="recipes-filter-nav" style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
            <button
              className={`recipe-filter-btn ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              All Recipes
            </button>
            <button
              className={`recipe-filter-btn ${activeCategory === "breakfast" ? "active" : ""}`}
              onClick={() => setActiveCategory("breakfast")}
            >
              🥣 Breakfast
            </button>
            <button
              className={`recipe-filter-btn ${activeCategory === "salads" ? "active" : ""}`}
              onClick={() => setActiveCategory("salads")}
            >
              🥗 Salads &amp; Sides
            </button>
            <button
              className={`recipe-filter-btn ${activeCategory === "soups" ? "active" : ""}`}
              onClick={() => setActiveCategory("soups")}
            >
              🍜 Soups
            </button>
            <button
              className={`recipe-filter-btn ${activeCategory === "pasta" ? "active" : ""}`}
              onClick={() => setActiveCategory("pasta")}
            >
              🍝 Pasta
            </button>
            <button
              className={`recipe-filter-btn ${activeCategory === "main" ? "active" : ""}`}
              onClick={() => setActiveCategory("main")}
            >
              🍛 Mains
            </button>
            <button
              className={`recipe-filter-btn ${activeCategory === "quick" ? "active" : ""}`}
              onClick={() => setActiveCategory("quick")}
            >
              🥪 Snacks &amp; Quick
            </button>
            <button
              className={`recipe-filter-btn ${activeCategory === "wellness" ? "active" : ""}`}
              onClick={() => setActiveCategory("wellness")}
            >
              🍵 Wellness
            </button>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="recipes-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => {
              const isExpanded = expandedRecipe === recipe.id;
              return (
                <div key={recipe.id} className={`recipe-card ${isExpanded ? "expanded" : ""}`}>
                  <div className="recipe-card-header" onClick={() => toggleRecipeExpand(recipe.id)}>
                    <div className="recipe-main-meta">
                      <span className="recipe-mushroom-tag">{recipe.mushroom}</span>
                      <h3>{recipe.name}</h3>
                      <p className="recipe-summary-text">{recipe.summary}</p>
                    </div>
                    <div className="recipe-quick-tags">
                      <span className="meta-tag"><i className="fa fa-clock-o"></i> {recipe.time}</span>
                      <span className="meta-tag"><i className="fa fa-tachometer"></i> {recipe.difficulty}</span>
                    </div>
                    <button className="expand-indicator-btn">
                      <i className={`fa ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="recipe-expanded-content animate__animated animate__fadeIn">
                      <div className="recipe-content-split">
                        <div className="ingredients-block">
                          <h4><i className="fa fa-shopping-basket"></i> Ingredients</h4>
                          <ul>
                            {recipe.ingredients.map((ing, idx) => (
                              <li key={idx}>{ing}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="steps-block">
                          <h4><i className="fa fa-list-ol"></i> Method</h4>
                          <ol>
                            {recipe.steps.map((step, idx) => (
                              <li key={idx}>
                                <span className="step-num">{idx + 1}</span>
                                <p>{step}</p>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      <div className="recipe-card-actions">
                        <Link to="/" className="shop-ingredients-btn">
                          Order Fresh {recipe.mushroom} <i className="fa fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-recipes-found">
              <i className="fa fa-cutlery"></i>
              <p>No culinary recipes matches your search queries. Try searching for "Lion's Mane" or "Oyster".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
