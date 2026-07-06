import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import vegetablesList from "../../store/actions/actionCreators/productsListAction";
import { RECIPES_DATA } from "../Recipes/Recipes";
import { resolveProductForMushroom } from "../Recipes/recipesUtils";
import "./RecipeDetail.css";

const RecipeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const productsData = useSelector((state) => state.products);
  const { vegetables: products } = productsData || {};

  // Find recipe by exact id match
  const recipe = RECIPES_DATA.find((r) => r.id === id);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(vegetablesList());
    }
  }, [dispatch, products]);

  useEffect(() => {
    const metaDesc = document.querySelector('meta[name="description"]');
    const robotsTag = document.querySelector('meta[name="robots"]');

    if (recipe) {
      // 1. Dynamic document title & description
      document.title = `${recipe.name} | SHROOOMS Recipes`;
      if (metaDesc) {
        metaDesc.setAttribute(
          "content",
          `${recipe.summary} Learn ingredients, preparation times, step-by-step methods, and pairing details.`
        );
      }

      // Ensure indexability is restored if previously blocked
      if (robotsTag) {
        robotsTag.setAttribute("content", "index, follow");
      }

      // 2. Dynamic JSON-LD structured data block
      const stepsInstructions = recipe.steps.map((step, idx) => ({
        "@type": "HowToStep",
        "position": idx + 1,
        "text": step
      }));

      const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        "name": recipe.name,
        "description": recipe.summary,
        "image": window.location.origin + recipe.image,
        "prepTime": recipe.prepTime === "10 mins" ? "PT10M" : (recipe.prepTime === "5 mins" ? "PT5M" : "PT10M"),
        "cookTime": recipe.cookTime === "10 mins" ? "PT10M" : (recipe.cookTime === "15 mins" ? "PT15M" : (recipe.cookTime === "20 mins" ? "PT20M" : "PT30M")),
        "totalTime": recipe.time === "20 mins" ? "PT20M" : (recipe.time === "25 mins" ? "PT25M" : (recipe.time === "15 mins" ? "PT15M" : (recipe.time === "30 mins" ? "PT30M" : "PT40M"))),
        "recipeYield": recipe.servings,
        "recipeIngredient": recipe.ingredients,
        "recipeInstructions": stepsInstructions,
        "recipeCategory": recipe.category
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "recipe-jsonld-script";
      script.text = JSON.stringify(jsonLdData);
      document.head.appendChild(script);

      return () => {
        const existing = document.getElementById("recipe-jsonld-script");
        if (existing) {
          existing.remove();
        }
      };
    } else {
      // Invalid recipe ID handling
      document.title = "Recipe Not Found | SHROOOMS";
      if (metaDesc) {
        metaDesc.setAttribute("content", "The requested gourmet recipe could not be found. Explore all gourmet mushroom guides and kitchen inspiration.");
      }

      // Prevent search indexing for invalid routes
      let robots = document.getElementById("recipe-robots-tag");
      if (!robots) {
        robots = document.createElement("meta");
        robots.name = "robots";
        robots.id = "recipe-robots-tag";
        document.head.appendChild(robots);
      }
      robots.setAttribute("content", "noindex, nofollow");

      return () => {
        const existingRobots = document.getElementById("recipe-robots-tag");
        if (existingRobots) {
          existingRobots.remove();
        }
      };
    }
  }, [recipe, id]);

  if (!recipe) {
    return (
      <main className="recipe-detail-container recipe-not-found" aria-label="Recipe Not Found">
        <div className="recipes-inner not-found-wrapper">
          <i className="fa fa-exclamation-circle not-found-icon" aria-hidden="true"></i>
          <h1>Recipe Not Found</h1>
          <p>We couldn't locate the gourmet recipe you're searching for.</p>
          <Link to="/recipes" className="back-to-recipes-btn">
            <i className="fa fa-arrow-left" aria-hidden="true"></i> Return to Recipes Listing
          </Link>
        </div>
      </main>
    );
  }

  // Resolve matching product dynamically
  const matchedProduct = resolveProductForMushroom(recipe.mushroom, products);
  const productRoute = matchedProduct ? `/product/${matchedProduct._id}` : "/";

  return (
    <main className="recipe-detail-container" aria-label={`Gourmet Recipe: ${recipe.name}`}>
      <div className="recipes-inner detail-inner">
        
        {/* Navigation Row */}
        <div className="recipe-detail-nav-row">
          <Link to="/recipes" className="back-to-recipes-link" aria-label="Back to Recipes Listing">
            <i className="fa fa-arrow-left" aria-hidden="true"></i> Back to Recipes
          </Link>
        </div>

        {/* Hero Section */}
        <header className="recipe-detail-header">
          <div className="recipe-detail-badge-row">
            <span className="recipe-mushroom-tag">{recipe.mushroom}</span>
            <span className="recipe-detail-category-badge">{recipe.category.toUpperCase()}</span>
          </div>
          <h1 className="recipe-detail-title">{recipe.name}</h1>
          <p className="recipe-detail-subtitle">{recipe.summary}</p>
          <div className="recipe-detail-divider" aria-hidden="true" />
        </header>

        {/* Info Grid */}
        <div className="recipe-detail-meta-grid" aria-label="Recipe details metadata">
          <div className="recipe-detail-meta-card">
            <i className="fa fa-clock-o" aria-hidden="true"></i>
            <span className="meta-card-label">Prep Time</span>
            <span className="meta-card-value">{recipe.prepTime}</span>
          </div>
          <div className="recipe-detail-meta-card">
            <i className="fa fa-cutlery" aria-hidden="true"></i>
            <span className="meta-card-label">Cook Time</span>
            <span className="meta-card-value">{recipe.cookTime}</span>
          </div>
          <div className="recipe-detail-meta-card">
            <i className="fa fa-tachometer" aria-hidden="true"></i>
            <span className="meta-card-label">Difficulty</span>
            <span className="meta-card-value">{recipe.difficulty}</span>
          </div>
          <div className="recipe-detail-meta-card">
            <i className="fa fa-users" aria-hidden="true"></i>
            <span className="meta-card-label">Servings</span>
            <span className="meta-card-value">{recipe.servings}</span>
          </div>
        </div>

        {/* Layout Split */}
        <div className="recipe-detail-split-layout">
          
          {/* Left Column: Image, Ingredients, Commerce CTA */}
          <div className="recipe-detail-left-col">
            <div className="recipe-detail-image-wrapper">
              <img
                src={recipe.image}
                alt={`Fresh, seared or prepared ${recipe.mushroom}`}
                className="recipe-detail-image"
              />
            </div>

            <div className="recipe-detail-ingredients-card">
              <h2><i className="fa fa-shopping-basket" aria-hidden="true"></i> Ingredients</h2>
              <ul className="recipe-detail-ingredients-list">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </div>

            <div className="recipe-detail-commerce-card">
              <h3>Cultivated at Our Indore Farm</h3>
              <p>Prepare this chef-curated dish with premium, fresh, organic gourmet cultivars harvested at peak freshness.</p>
              <Link to={productRoute} className="recipe-detail-commerce-cta">
                Order Fresh {recipe.mushroom} <i className="fa fa-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          </div>

          {/* Right Column: Cooking steps & Culinary Notes */}
          <div className="recipe-detail-right-col">
            <section className="recipe-detail-method-section">
              <h2><i className="fa fa-list-ol" aria-hidden="true"></i> Step-by-Step Instructions</h2>
              <ol className="recipe-detail-steps-list">
                {recipe.steps.map((step, idx) => (
                  <li key={idx} className="recipe-detail-step-item">
                    <span className="step-badge">{idx + 1}</span>
                    <p className="step-text">{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="recipe-detail-notes-section">
              <h2><i className="fa fa-lightbulb-o" aria-hidden="true"></i> Chef's Culinary Notes</h2>
              <ul className="recipe-detail-notes-list">
                <li>
                  <strong>Preparation Tip:</strong> Gently wipe substrates off the {recipe.mushroom} clusters with a dry paper towel instead of washing, as water absorption can degrade culinary texture during pan searing.
                </li>
                <li>
                  <strong>Serving Pairing:</strong> Serve warm, highlighting the earthy aroma of garlic-infused herb glaze or decocotions, paired with artisan sourdough bread or light seasonal microgreens.
                </li>
              </ul>
            </section>
          </div>

        </div>

      </div>
    </main>
  );
};

export default RecipeDetail;
