import React from "react";
import { Link } from "react-router-dom";
import "./GuideFinalCTA.css";

const GuideFinalCTA = () => {
  return (
    <section className="guide-final-cta-section" aria-label="Explore SHROOOMS Next Steps">
      <div className="guide-final-cta">
        <h2 className="guide-final-cta__title">
          Ready to Explore Gourmet Mushrooms?
        </h2>
        <p className="guide-final-cta__desc">
          Bring fresh, locally cultivated gourmet varieties into your kitchen. Discover our current harvest, master simple cooking techniques, or connect with our farm team.
        </p>

        <div className="guide-final-cta__actions">
          <Link to="/" className="guide-final-cta__btn guide-final-cta__btn--primary">
            Explore All Cultivars →
          </Link>
          <Link to="/recipes" className="guide-final-cta__btn guide-final-cta__btn--secondary">
            Kitchen Recipes →
          </Link>
          <Link to="/wholesale" className="guide-final-cta__btn guide-final-cta__btn--tertiary">
            Wholesale & Bulk →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GuideFinalCTA;
