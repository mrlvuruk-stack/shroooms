import React, { useState } from "react";
import { HOMEPAGE_CONFIG } from "../../config/homepageConfig";
import { InfoModal } from "../ModalSystem/ModalSystem";
import "./WhyChooseUs.css";

const DIFFERENTIATOR_POLICIES = {
  "Indore Vertical Cultivation": {
    title: "Indore Vertical Cleanroom Standard",
    icon: "🏬",
    details: "Our flagship indoor vertical farming facility in Indore operates with climate-controlled automated cleanrooms.",
    bullets: [
      "99.97% HEPA air filtration protecting against wild bacteria",
      "Automated misting cycles replicating natural mountain humidity",
      "100% pesticide-free, chemical-free organic cultivation environment"
    ]
  },
  "Culinary Selection": {
    title: "Gourmet Strain Selection Standard",
    icon: "👨‍🍳",
    details: "We isolate strains specifically for dense flesh, intense umami, and vibrant visual cap presentation.",
    bullets: [
      "Selected by professional mycologists and culinary chefs",
      "High dry-matter density preventing shrinkage during cooking",
      "Superior aromatic profile for fine dining preparations"
    ]
  },
  "Clean Packaging": {
    title: "Structured Eco-Ventilated Packaging",
    icon: "📦",
    details: "Custom food-grade ventilated containers protect delicate icicle tendrils and cap edges.",
    bullets: [
      "Zero plastic wrap condensation buildup",
      "100% recyclable, food-safe paperboard construction",
      "Preserves freshness during transport for up to 10 days"
    ]
  },
  "Grow-at-Home Offerings": {
    title: "Harvest Guarantee Grow Kit Standard",
    icon: "🌱",
    details: "100% fully colonized substrate fruiting blocks ready to produce fresh mushrooms on your countertop.",
    bullets: [
      "Guaranteed minimum 2-3 heavy harvest flushes",
      "Includes spray mister, setup guide, and 100% harvest guarantee",
      "Fun, educational, and organic kitchen harvest experience"
    ]
  }
};

const WhyChooseUs = () => {
  const { whyChooseUs } = HOMEPAGE_CONFIG;
  const [activePolicy, setActivePolicy] = useState(null);

  return (
    <section className="why-section home-section container-wide" aria-labelledby="why-title">
      <div className="why-editorial-grid">
        
        {/* Left Side: Large statement */}
        <div className="why-left-statement">
          <span className="why-eyebrow" id="why-title">Differentiators</span>
          <h2 className="why-title-text">{whyChooseUs.sectionTitle}</h2>
          <p className="why-subtitle-text">{whyChooseUs.sectionSubtitle}</p>
        </div>

        {/* Right Side: Clean list with thin dividers and Info Buttons */}
        <div className="why-right-list">
          {whyChooseUs.points.map((pt, idx) => (
            <div className="why-item" key={idx}>
              <div className="why-item-header">
                <span className="why-item-index" aria-hidden="true">/0{idx + 1}</span>
                <h3 className="why-item-title">{pt.title}</h3>
                <button
                  className="info-trigger-btn inline-why-info-btn"
                  onClick={() => setActivePolicy(pt.title)}
                  aria-label={`View policy for ${pt.title}`}
                  title="View policy & standards"
                >
                  i
                </button>
              </div>
              <p className="why-item-desc">{pt.description}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Info Modal Trigger */}
      {activePolicy && DIFFERENTIATOR_POLICIES[activePolicy] && (
        <InfoModal
          isOpen={!!activePolicy}
          onClose={() => setActivePolicy(null)}
          title={DIFFERENTIATOR_POLICIES[activePolicy].title}
          icon={DIFFERENTIATOR_POLICIES[activePolicy].icon}
          details={DIFFERENTIATOR_POLICIES[activePolicy].details}
          bullets={DIFFERENTIATOR_POLICIES[activePolicy].bullets}
        />
      )}
    </section>
  );
};

export default WhyChooseUs;
