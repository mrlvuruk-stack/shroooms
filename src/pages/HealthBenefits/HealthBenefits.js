import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HealthBenefits.css";

const MUSHROOM_BENEFITS = [
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
  },
  {
    id: "chaga",
    name: "Chaga",
    scientificName: "Inonotus obliquus",
    category: "immunity",
    icon: "fa-heartbeat",
    summary: "A powerhouse of antioxidants that promotes cellular restoration and gut health.",
    compounds: ["Melanin", "Superoxide Dismutase (SOD)", "Betulinic Acid"],
    details: [
      "Contains extremely high ORAC (oxygen radical absorbance capacity) to neutralize cellular aging.",
      "Soothes the digestive tract lining, acting as a prebiotic to nourish healthy gut bacteria.",
      "Balances blood pressure and cholesterol levels, supporting overall cardiovascular vitality."
    ],
    color: "#5a4b31"
  },
  {
    id: "turkey-tail",
    name: "Turkey Tail",
    scientificName: "Trametes versicolor",
    category: "immunity",
    icon: "fa-heart-o",
    summary: "Superb gut health modulator and immune system balance catalyst.",
    compounds: ["Polysaccharide-K (PSK)", "Polysaccharide Peptide (PSP)", "Flavonoids"],
    details: [
      "Contains powerful prebiotic fibers that populate beneficial microflora in the gut microbiome.",
      "Clinically researched for immune-modulatory benefits during oncology therapies.",
      "Packed with phenols and flavonoids that reduce systemic inflammation."
    ],
    color: "#a28a5c"
  },
  {
    id: "maitake",
    name: "Maitake",
    scientificName: "Grifola frondosa",
    category: "energy",
    icon: "fa-leaf",
    summary: "Blood sugar regulator and metabolic health balancer.",
    compounds: ["D-Fraction", "Beta-Glucan complex", "Metalloproteins"],
    details: [
      "Supports healthy glycemic levels by enhancing insulin sensitivity.",
      "Assists in weight management and metabolic health through lipid profile moderation.",
      "Boosts general cellular immune response to viral pathogens."
    ],
    color: "#7d776f"
  }
];

const HealthBenefits = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    document.title = "Health Benefits of Gourmet Mushrooms | Cordyceps, Lion's Mane – Shroooms";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Explore the incredible medicinal and health benefits of Lion's Mane, Cordyceps, Reishi, and Oyster mushrooms for focus, memory, and immunity.");
    }
  }, []);

  const [benefits, setBenefits] = useState(MUSHROOM_BENEFITS);

  useEffect(() => {
    const fetchBenefits = async () => {
      const { supabase, isSupabaseConfigured } = await import("../../supabase");
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from("benefits").select("*");
          if (!error && data && data.length > 0) {
            setBenefits(data);
            return;
          }
        } catch (err) {
          console.error("Supabase benefits fetch error:", err);
        }
      }
      const saved = localStorage.getItem("mock_benefits");
      if (saved) {
        setBenefits(JSON.parse(saved));
      } else {
        localStorage.setItem("mock_benefits", JSON.stringify(MUSHROOM_BENEFITS));
      }
    };
    fetchBenefits();
  }, []);

  const filteredItems = activeFilter === "all"
    ? benefits
    : benefits.filter(item => item.category === activeFilter);

  return (
    <div className="benefits-container">
      <div className="benefits-inner animate__animated animate__fadeIn">
        <header className="benefits-header-section">
          <span className="benefits-eyebrow">Apothecary & Science</span>
          <h1 className="benefits-title">Functional Mushroom Wellness Directory</h1>
          <p className="benefits-subtitle">
            Explore the biological mechanisms, organic compounds, and therapeutic benefits of gourmet adaptogens.
          </p>
          <div className="benefits-divider"></div>
        </header>

        {/* Filter Navigation */}
        <div className="benefits-filter-nav">
          <button 
            className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Varieties
          </button>
          <button 
            className={`filter-btn ${activeFilter === "brain" ? "active" : ""}`}
            onClick={() => setActiveFilter("brain")}
          >
            Brain & Focus
          </button>
          <button 
            className={`filter-btn ${activeFilter === "immunity" ? "active" : ""}`}
            onClick={() => setActiveFilter("immunity")}
          >
            Immunity & Longevity
          </button>
          <button 
            className={`filter-btn ${activeFilter === "energy" ? "active" : ""}`}
            onClick={() => setActiveFilter("energy")}
          >
            Energy & Stress
          </button>
        </div>

        {/* Grid Layout of Benefits */}
        <div className="benefits-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="benefit-card">
              <div className="card-top-accent" style={{ backgroundColor: item.color }}></div>
              <div className="benefit-card-header">
                <div className="benefit-icon-wrapper" style={{ borderColor: item.color }}>
                  <i className={`fa ${item.icon}`} style={{ color: item.color === "#e6dfd1" ? "var(--frugivore-green)" : item.color }}></i>
                </div>
                <div className="benefit-names">
                  <h3>{item.name}</h3>
                  <span className="scientific-name">{item.scientificName}</span>
                </div>
              </div>
              
              <p className="benefit-summary">{item.summary}</p>
              
              <div className="bioactive-compounds-section">
                <span className="section-label">Active Bioactives:</span>
                <div className="compounds-tags">
                  {item.compounds.map(comp => (
                    <span key={comp} className="compound-tag">{comp}</span>
                  ))}
                </div>
              </div>

              <div className="benefit-detail-list">
                <span className="section-label">Clinical Benefits:</span>
                <ul>
                  {item.details.map((detail, idx) => (
                    <li key={idx}>
                      <i className="fa fa-caret-right"></i>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="benefit-card-footer">
                <Link to="/" className="shop-cultivar-btn">
                  Shop Fresh Harvest <i className="fa fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Scientific Disclaimer */}
        <footer className="benefits-disclaimer">
          <i className="fa fa-info-circle"></i>
          <p>
            <strong>Disclaimer:</strong> The statements made on this website have not been evaluated by any drug administration. Functional mushrooms are meant to support general wellness and health optimization, and are not intended to diagnose, treat, cure, or prevent any medical condition.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HealthBenefits;
