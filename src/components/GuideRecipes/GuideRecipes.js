import React from "react";
import { Link } from "react-router-dom";
import { RECIPES_DATA } from "../../pages/Recipes/Recipes";
import { MUSHROOM_GUIDE_DATA } from "../../config/mushroomGuideConfig";
import "./GuideRecipes.css";

// Select 3 recipes deterministically mapped to verified species
const TARGET_RECIPE_IDS = ["lions-mane-steaks", "king-oyster-scallops", "pink-oyster-tacos"];

const GuideRecipes = () => {
  const selectedRecipes = TARGET_RECIPE_IDS.map((id) =>
    RECIPES_DATA.find((r) => r.id === id)
  ).filter(Boolean);

  if (selectedRecipes.length === 0) {
    return null;
  }

  // Map species image to recipe for visual consistency & claim safety
  const getRecipeImage = (mushroomName) => {
    const speciesMatch = MUSHROOM_GUIDE_DATA.find(
      (s) => s.commonName.toLowerCase() === (mushroomName || "").toLowerCase()
    );
    return speciesMatch ? speciesMatch.image : "/shrooom.jpg";
  };

  return (
    <section className="guide-recipes-section" aria-label="Gourmet Mushroom Recipes">
      <div className="guide-recipes-header">
        <span className="guide-recipes-eyebrow">Culinary Pairings</span>
        <h2 className="guide-recipes-title">Gourmet Mushroom Recipes</h2>
        <p className="guide-recipes-subtitle">
          Transform fresh harvest into restaurant-quality dishes with simple, chef-curated cooking techniques.
        </p>
      </div>

      <div className="guide-recipes-grid">
        {selectedRecipes.map((recipe) => (
          <article key={recipe.id} className="guide-recipe-card">
            <div className="guide-recipe-card__media">
              <img
                src={getRecipeImage(recipe.mushroom)}
                alt={recipe.name}
                className="guide-recipe-card__image"
                loading="lazy"
              />
              <span className="guide-recipe-card__badge">
                {recipe.category === "quick" ? "Quick Sauté" : "Main Course"}
              </span>
            </div>

            <div className="guide-recipe-card__content">
              <span className="guide-recipe-card__meta">
                {recipe.time} • {recipe.difficulty} • {recipe.mushroom}
              </span>
              <h3 className="guide-recipe-card__title">{recipe.name}</h3>
              <p className="guide-recipe-card__summary">{recipe.summary}</p>

              <div className="guide-recipe-card__action">
                <Link to="/recipes" className="guide-recipe-card__cta">
                  View Recipe on Kitchen →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="guide-recipes-footer">
        <Link to="/recipes" className="guide-recipes__footer-cta">
          Explore All Kitchen Recipes →
        </Link>
      </div>
    </section>
  );
};

export default GuideRecipes;
