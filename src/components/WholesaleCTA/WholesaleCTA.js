import React from "react";
import { Link } from "react-router-dom";
import "./WholesaleCTA.css";

const WholesaleCTA = () => {
  return (
    <section className="wholesale-cta-section home-section container-wide" aria-labelledby="wholesale-title">
      <div className="wholesale-container">
        <div className="wholesale-content">
          <span className="wholesale-eyebrow" id="wholesale-title">Partnerships</span>
          <h2 className="wholesale-heading">Bulk Supply & Wholesale</h2>
          <p className="wholesale-lead">
            We provide high-quality gourmet mushrooms directly to culinary chefs, restaurants, and food retailers.
          </p>
          <p className="wholesale-supporting">
            All bulk products are grown locally in our controlled indoor chambers in Indore, hand-sorted, and delivered in structured ventilated crates to preserve quality.
          </p>
          <div className="wholesale-cta-row">
            <Link to="/wholesale" className="btn-primary wholesale-btn">
              Submit Wholesale Inquiry <span className="btn-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WholesaleCTA;
