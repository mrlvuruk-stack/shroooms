import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import vegetablesList from "../../store/actions/actionCreators/productsListAction";
import { resolveProductForMushroom } from "./recipesUtils";
import "./Recipes.css";

export const RECIPES_DATA = [
  {
    id: "lions-mane-steaks",
    name: "Pan-Seared Lion's Mane Steaks",
    mushroom: "Lion's Mane",
    category: "mains",
    time: "20 mins",
    prepTime: "10 mins",
    cookTime: "10 mins",
    servings: "2 servings",
    difficulty: "Easy",
    image: "/cultivar_lions_mane.jpg",
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
      "Heat a dry cast-iron skillet over medium-high heat. Place the mushroom slabs in the pan and sear for 2-3 minutes, using a heavy press to compress out excess moisture.",
      "Lower the heat to medium. Add butter, crushed garlic, and rosemary sprigs to the skillet.",
      "Tilt the pan and baste the melted butter over the steaks continuously for 4-5 minutes until golden brown and caramelized.",
      "Season generously with sea salt and black pepper. Serve hot."
    ]
  },
  {
    id: "king-oyster-scallops",
    name: "King Oyster Mushroom 'Scallops'",
    mushroom: "King Oyster",
    category: "mains",
    time: "25 mins",
    prepTime: "10 mins",
    cookTime: "15 mins",
    servings: "2 servings",
    difficulty: "Medium",
    image: "/box_king_oyster.jpg",
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
    prepTime: "5 mins",
    cookTime: "10 mins",
    servings: "2-3 servings",
    difficulty: "Easy",
    image: "/box_pink_oyster.jpg",
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
    category: "pasta",
    time: "30 mins",
    prepTime: "10 mins",
    cookTime: "20 mins",
    servings: "2 servings",
    difficulty: "Medium",
    image: "/box_blue_oyster.jpg",
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
    name: "Reishi Spiced Golden Milk",
    mushroom: "Reishi",
    category: "wellness",
    time: "10 mins",
    prepTime: "5 mins",
    cookTime: "5 mins",
    servings: "1 serving",
    difficulty: "Easy",
    image: "/cultivar_reishi.jpg",
    summary: "A warm, earthy spiced beverage prepared with Reishi powder, turmeric, and ginger.",
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
    name: "Classic Umami Shiitake Broth",
    mushroom: "Shiitake",
    category: "soups",
    time: "40 mins",
    prepTime: "10 mins",
    cookTime: "30 mins",
    servings: "3 servings",
    difficulty: "Easy",
    image: "/cultivar_maitake.jpg",
    summary: "A nourishing, umami-rich vegetable broth brewed with fresh shiitake, ginger, and kombu.",
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

const CATEGORY_FILTERS = [
  { id: "all", label: "All Recipes" },
  { id: "mains", label: "🍛 Mains" },
  { id: "pasta", label: "🍝 Pasta" },
  { id: "quick", label: "🥪 Quick Sauté" },
  { id: "soups", label: "🍜 Soups & Broths" },
  { id: "wellness", label: "🍵 Traditional Decoctions" }
];


const Recipes = () => {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  const productsData = useSelector((state) => state.products);
  const { vegetables: products } = productsData || {};

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(vegetablesList());
    }
  }, [dispatch, products]);

  useEffect(() => {
    document.title = "Gourmet Mushroom Recipes | The Shroooms Kitchen";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Master gourmet mushroom cooking with chef-curated recipes. Simple preparation techniques for Lion's Mane steaks, Pink Oyster tacos, and Shiitake broth."
      );
    }
    window.scrollTo(0, 0);
  }, []);

  const toggleRecipeExpand = (id) => {
    setExpandedRecipe((prev) => (prev === id ? null : id));
  };

  const filteredRecipes = RECIPES_DATA.filter((recipe) => {
    const matchesCategory =
      activeCategory === "all" ||
      recipe.category === activeCategory ||
      (activeCategory === "mains" && recipe.category === "main");

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      recipe.name.toLowerCase().includes(query) ||
      recipe.mushroom.toLowerCase().includes(query) ||
      recipe.summary.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // Resolve matching catalog product safely using the strict normalization resolver
  const getProductRoute = (mushroomName) => {
    const matchedProduct = resolveProductForMushroom(mushroomName, products);
    return matchedProduct ? `/product/${matchedProduct._id}` : "/";
  };

  return (
    <main className="recipes-container" aria-label="The Shroooms Kitchen Recipes">
      <div className="recipes-inner">
        <header className="recipes-header-section">
          <span className="recipes-eyebrow">SHROOOMS KITCHEN</span>
          <h1 className="recipes-title">Chef-Curated Gourmet Mushroom Recipes</h1>
          <p className="recipes-subtitle">
            Master simple cooking techniques, savory sautés, and rich broths with fresh, locally cultivated mushrooms.
          </p>
          <div className="recipes-divider" aria-hidden="true" />
        </header>

        {/* Search & Filter Toolbar */}
        <div className="recipes-toolbar">
          <div className="recipes-search-wrapper">
            <i className="fa fa-search search-icon" aria-hidden="true"></i>
            <input
              type="text"
              placeholder="Search by recipe or mushroom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="recipes-search-input"
              aria-label="Search recipes or mushrooms"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search input"
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            )}
          </div>

          <div className="recipes-filter-nav" role="group" aria-label="Filter recipes by category">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`recipe-filter-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={activeCategory === cat.id}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="recipes-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => {
              const isExpanded = expandedRecipe === recipe.id;
              const productRoute = getProductRoute(recipe.mushroom);

              return (
                <article key={recipe.id} className={`recipe-card ${isExpanded ? "expanded" : ""}`}>
                  <button
                    type="button"
                    className="recipe-card-header"
                    onClick={() => toggleRecipeExpand(recipe.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`recipe-content-${recipe.id}`}
                    id={`recipe-header-${recipe.id}`}
                  >
                    <div className="recipe-card-header__media">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="recipe-card-header__img"
                        loading="lazy"
                      />
                    </div>

                    <div className="recipe-main-meta">
                      <div className="recipe-card-header__tags">
                        <span className="recipe-mushroom-tag">{recipe.mushroom}</span>
                      </div>
                      <h2 className="recipe-card__title">{recipe.name}</h2>
                      <p className="recipe-summary-text">{recipe.summary}</p>
                    </div>

                    <div className="recipe-quick-tags">
                      <span className="meta-tag">
                        <i className="fa fa-clock-o" aria-hidden="true"></i> {recipe.time}
                      </span>
                      <span className="meta-tag">
                        <i className="fa fa-tachometer" aria-hidden="true"></i> {recipe.difficulty}
                      </span>
                      <span className="expand-indicator-btn" aria-hidden="true">
                        <i className={`fa ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div
                      id={`recipe-content-${recipe.id}`}
                      className="recipe-expanded-content"
                      role="region"
                      aria-labelledby={`recipe-header-${recipe.id}`}
                    >
                      <div className="recipe-content-split">
                        <div className="ingredients-block">
                          <h4>
                            <i className="fa fa-shopping-basket" aria-hidden="true"></i> Ingredients
                          </h4>
                          <ul>
                            {recipe.ingredients.map((ing, idx) => (
                              <li key={idx}>{ing}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="steps-block">
                          <h4>
                            <i className="fa fa-list-ol" aria-hidden="true"></i> Preparation Method
                          </h4>
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
                        <Link to={`/recipes/${recipe.id}`} className="view-full-recipe-btn">
                          View Full Recipe <i className="fa fa-book" aria-hidden="true"></i>
                        </Link>
                        <Link to={productRoute} className="shop-ingredients-btn">
                          Order Fresh {recipe.mushroom} <i className="fa fa-arrow-right" aria-hidden="true"></i>
                        </Link>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="no-recipes-found" role="status">
              <i className="fa fa-cutlery" aria-hidden="true"></i>
              <p>No gourmet recipes match your current search criteria. Try searching for "Lion's Mane" or "Oyster".</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Recipes;
