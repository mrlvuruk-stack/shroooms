import React from "react";
import { HOMEPAGE_CONFIG } from "../../config/homepageConfig";
import "./WhyChooseUs.css";

const WhyChooseUs = () => {
  const { whyChooseUs } = HOMEPAGE_CONFIG;

  return (
    <section className="why-section home-section container-wide" aria-labelledby="why-title">
      <div className="why-editorial-grid">
        
        {/* Left Side: Large statement */}
        <div className="why-left-statement">
          <span className="why-eyebrow" id="why-title">Differentiators</span>
          <h2 className="why-title-text">{whyChooseUs.sectionTitle}</h2>
          <p className="why-subtitle-text">{whyChooseUs.sectionSubtitle}</p>
        </div>

        {/* Right Side: Clean list with thin dividers */}
        <div className="why-right-list">
          {whyChooseUs.points.map((pt, idx) => (
            <div className="why-item" key={idx}>
              <div className="why-item-header">
                <span className="why-item-index" aria-hidden="true">/0{idx + 1}</span>
                <h3 className="why-item-title">{pt.title}</h3>
              </div>
              <p className="why-item-desc">{pt.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
