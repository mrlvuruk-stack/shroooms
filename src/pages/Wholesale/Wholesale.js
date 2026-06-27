import React, { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../../supabase";
import "./Wholesale.css";

const BULK_PRODUCTS = [
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
  },
  {
    id: "bulk-oyster-mix",
    name: "Oyster Medley (Pink, Blue & Gold)",
    packaging: "3kg / 5kg ventilated trays",
    suitability: "Boutique Grocers, Weekly Farm Markets",
    description: "A visually striking assortment of fresh Pink, Blue, and Golden Oyster mushroom clusters."
  },
  {
    id: "bulk-substrate-blocks",
    name: "Fruiting Substrate Blocks (Palletized)",
    packaging: "Sterilized hardwood oak blocks (minimum 50 units)",
    suitability: "Urban Farms, Commercial Growers",
    description: "Fully colonized, premium grain-fed mycelium blocks ready for pinning. Tested for high yield strains."
  }
];

const Wholesale = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "restaurant",
    volume: "5-10kg",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.businessName.trim() || !formData.email.trim()) {
      setError("Please fill in Contact Name, Business Name, and Email Address.");
      return;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: insertErr } = await supabase.from("inquiries").insert([{
          type: "wholesale",
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          business_name: formData.businessName.trim(),
          business_type: formData.businessType,
          volume: formData.volume,
          message: formData.message.trim()
        }]);
        if (insertErr) throw insertErr;
      } catch (err) {
        console.error("Error submitting wholesale inquiry to Supabase:", err);
        setError("Unable to submit inquiry. Please try again later.");
        return;
      }
    } else {
      // Fallback: save to mock inquiries list in localStorage
      const mockInqs = JSON.parse(localStorage.getItem("mock_inquiries") || "[]");
      mockInqs.push({
        id: `mock-inq-${Date.now()}`,
        type: "wholesale",
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        business_name: formData.businessName.trim(),
        business_type: formData.businessType,
        volume: formData.volume,
        message: formData.message.trim(),
        status: "Pending",
        created_at: new Date().toISOString()
      });
      localStorage.setItem("mock_inquiries", JSON.stringify(mockInqs));
    }

    setSubmitted(true);
  };

  const [bulkProducts, setBulkProducts] = useState(BULK_PRODUCTS);

  useEffect(() => {
    const fetchWholesale = async () => {
      const { supabase, isSupabaseConfigured } = await import("../../supabase");
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from("wholesale").select("*");
          if (!error && data && data.length > 0) {
            setBulkProducts(data);
            return;
          }
        } catch (err) {
          console.error("Supabase wholesale fetch error:", err);
        }
      }
      const saved = localStorage.getItem("mock_wholesale");
      if (saved) {
        setBulkProducts(JSON.parse(saved));
      } else {
        localStorage.setItem("mock_wholesale", JSON.stringify(BULK_PRODUCTS));
      }
    };
    fetchWholesale();
  }, []);

  return (
    <div className="wholesale-container">
      <div className="wholesale-inner animate__animated animate__fadeIn">
        <header className="wholesale-header-section">
          <span className="wholesale-eyebrow">Culinary & Farm Partnerships</span>
          <h1 className="wholesale-title">Commercial Accounts & Bulk Supply</h1>
          <p className="wholesale-subtitle">
            Reliable, daily cold-chain deliveries of premium, chemical-free functional mushrooms for restaurants, boutique grocers, and distributors.
          </p>
          <div className="wholesale-divider"></div>
        </header>

        {/* Info Highlights section */}
        <section className="wholesale-benefits-grid">
          <div className="benefit-card-wholesale">
            <i className="fa fa-truck benefit-icon-ws"></i>
            <h3>Cold-Chain Logistics</h3>
            <p>We deliver inside customized insulated boxes directly to your walk-in coolers, maintaining 4°C ambient temperature from harvest to delivery.</p>
          </div>
          <div className="benefit-card-wholesale">
            <i className="fa fa-calendar-check-o benefit-icon-ws"></i>
            <h3>Consistent Scheduling</h3>
            <p>Secure custom cultivation chambers dedicated to your weekly volume requirements, guaranteeing supply even during high-demand seasons.</p>
          </div>
          <div className="benefit-card-wholesale">
            <i className="fa fa-flask benefit-icon-ws"></i>
            <h3>Certified Genetics</h3>
            <p>Our lab clones wild genetic lines resulting in thick fruiting strains with strong texture, rich color, and high adaptogenic values.</p>
          </div>
        </section>

        {/* Split Section: Bulk products catalog & Inquiry Form */}
        <section className="wholesale-split-section">
          
          {/* Left panel: Bulk Catalog */}
          <div className="wholesale-catalog-panel">
            <h2 className="panel-title">Our Wholesale Offerings</h2>
            <div className="bulk-products-list">
              {bulkProducts.map((prod) => (
                <div key={prod.id} className="bulk-product-item">
                  <div className="bulk-product-header">
                    <h4>{prod.name}</h4>
                    <span className="bulk-suitability">{prod.suitability}</span>
                  </div>
                  <p className="bulk-desc">{prod.description}</p>
                  <div className="bulk-pack-info">
                    <i className="fa fa-archive"></i>
                    <span><strong>Packaging:</strong> {prod.packaging}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Form / Submission Card */}
          <div className="wholesale-form-panel">
            {submitted ? (
              <div className="form-success-card animate__animated animate__zoomIn">
                <div className="success-icon-wrapper">
                  <i className="fa fa-check"></i>
                </div>
                <h3>Inquiry Submitted Successfully!</h3>
                <p>
                  Thank you for reaching out to <strong>Shroooms Wholesale</strong>. One of our farm logistics representatives will review your request and contact you within 12 business hours.
                </p>
                <div className="submitted-summary">
                  <p><strong>Partner:</strong> {formData.name}</p>
                  <p><strong>Business:</strong> {formData.businessName}</p>
                  <p><strong>Type:</strong> {formData.businessType.toUpperCase()}</p>
                  <p><strong>Estimated Volume:</strong> {formData.volume}</p>
                </div>
                <button 
                  className="reset-form-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", businessName: "", businessType: "restaurant", volume: "5-10kg", message: "" });
                  }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <div className="wholesale-form-card">
                <h2 className="panel-title">Inquire for Partnership</h2>
                <p className="form-guide-text">
                  Complete the inquiry form below, and our team will get in touch with specialized commercial volume sheets.
                </p>
                
                {error && (
                  <div className="form-error-banner animate__animated animate__shakeX">
                    <i className="fa fa-exclamation-triangle"></i>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="ws-form">
                  <div className="form-group">
                    <label htmlFor="name">Contact Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="e.g. Chef Sanjay Kapoor"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="businessName">Business / Restaurant Name</label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      placeholder="e.g. The Truffle Table"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-row-ws">
                    <div className="form-group half-ws">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="chef@restaurant.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group half-ws">
                      <label htmlFor="phone">Contact Number (Optional)</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        placeholder="e.g. +91 98260 12345"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row-ws">
                    <div className="form-group half-ws">
                      <label htmlFor="businessType">Business Type</label>
                      <select
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                      >
                        <option value="restaurant">Restaurant / Culinary</option>
                        <option value="grocer">Boutique Grocery Store</option>
                        <option value="distributor">Wholesale Distributor</option>
                        <option value="cultivator">Mushroom Farm / Urban Grower</option>
                        <option value="other">Other Business Entity</option>
                      </select>
                    </div>

                    <div className="form-group half-ws">
                      <label htmlFor="volume">Weekly Volume (Est.)</label>
                      <select
                        id="volume"
                        name="volume"
                        value={formData.volume}
                        onChange={handleChange}
                      >
                        <option value="5-10kg">5kg - 10kg / week</option>
                        <option value="10-50kg">10kg - 50kg / week</option>
                        <option value="50-100kg">50kg - 100kg / week</option>
                        <option value="100kg+">Over 100kg / week</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message / Sourcing Requirements</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      placeholder="Detail any delivery frequencies, specific species requirements, or packaging needs..."
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <button type="submit" className="ws-submit-btn">
                    Submit Partnership Inquiry <i className="fa fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Wholesale;
