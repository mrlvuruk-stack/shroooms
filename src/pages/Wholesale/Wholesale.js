import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../../supabase";
import "./Wholesale.css";

const BULK_PRODUCTS = [
  {
    id: "bulk-lions-mane",
    name: "Fresh Lion's Mane (Bulk)",
    packaging: "5kg / 10kg insulated crates",
    suitability: "Fine Dining, Specialty Retailers, Culinary Distributors",
    description: "Hand-picked daily, dense clusters with clean icicle spines. Shipped in temperature-controlled packaging."
  },
  {
    id: "bulk-king-oyster",
    name: "Chef Grade King Oyster (Bulk)",
    packaging: "5kg / 10kg boxes",
    suitability: "Culinary Chefs, Plant-Based Restaurants",
    description: "Thick, firm, clean stems with minimal cap taper. Ideal for scoring, grilling, and gourmet applications."
  },
  {
    id: "bulk-oyster-mix",
    name: "Oyster Medley (Pink, Blue & Gold)",
    packaging: "3kg / 5kg ventilated trays",
    suitability: "Boutique Grocers, Specialty Markets",
    description: "A visually striking assortment of fresh Pink, Blue, and Golden Oyster mushroom clusters."
  },
  {
    id: "bulk-substrate-blocks",
    name: "Fruiting Substrate Blocks (Palletized)",
    packaging: "Sterilized hardwood oak blocks (minimum 50 units)",
    suitability: "Urban Farms, Commercial Growers",
    description: "Fully colonized, premium grain-fed mycelium blocks ready for pinning. Cultivated for consistent high yields."
  }
];

const Wholesale = () => {
  const isMountedRef = useRef(true);
  const submissionLockRef = useRef(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "restaurant",
    volume: "5-10kg",
    message: ""
  });

  const [submitStatus, setSubmitStatus] = useState("idle"); // idle, submitting, success, error
  const [isMockSuccess, setIsMockSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [bulkProducts, setBulkProducts] = useState(BULK_PRODUCTS);

  useEffect(() => {
    isMountedRef.current = true;
    document.title = "Wholesale Gourmet Mushrooms | Bulk Supply for Restaurants – Shroooms";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Order premium gourmet mushrooms in bulk. Reliable farm-to-table supply chain for restaurants, hotels, and cafes in Indore and across India.");
    }
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchWholesale = async () => {
      const { supabase, isSupabaseConfigured } = await import("../../supabase");
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from("wholesale").select("*");
          if (isMountedRef.current && !error && data && data.length > 0) {
            setBulkProducts(data);
            return;
          }
        } catch (err) {
          console.error("Supabase wholesale fetch error:", err);
        }
      }
      const saved = localStorage.getItem("mock_wholesale");
      if (saved) {
        if (isMountedRef.current) {
          setBulkProducts(JSON.parse(saved));
        }
      } else {
        try {
          localStorage.setItem("mock_wholesale", JSON.stringify(BULK_PRODUCTS));
        } catch (err) {
          console.warn("Unable to write mock bulk products to localStorage:", err);
        }
      }
    };
    fetchWholesale();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear field-specific error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const nameVal = formData.name.trim();
    const businessNameVal = formData.businessName.trim();
    const emailVal = formData.email.trim();
    const phoneVal = formData.phone.trim();
    const messageVal = formData.message.trim();

    // 1. Contact Name
    if (!nameVal) {
      errors.name = "Contact Name is required.";
    } else if (nameVal.length > 100) {
      errors.name = "Contact Name must be under 100 characters.";
    }

    // 2. Business Name
    if (!businessNameVal) {
      errors.businessName = "Business / Restaurant Name is required.";
    } else if (businessNameVal.length > 100) {
      errors.businessName = "Business name must be under 100 characters.";
    }

    // 3. Email
    if (!emailVal) {
      errors.email = "Email Address is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        errors.email = "Please enter a valid email address.";
      } else if (emailVal.length > 100) {
        errors.email = "Email address must be under 100 characters.";
      }
    }

    // 4. Phone (Optional)
    if (phoneVal) {
      const phoneRegex = /^[0-9+\s()-]+$/;
      if (!phoneRegex.test(phoneVal)) {
        errors.phone = "Phone contains invalid formatting characters.";
      } else if (phoneVal.replace(/[^0-9]/g, "").length < 6) {
        errors.phone = "Phone number is too short (minimum 6 digits).";
      } else if (phoneVal.length > 20) {
        errors.phone = "Phone number must be under 20 characters.";
      }
    }

    // 5. Select items
    const allowedTypes = ["restaurant", "grocer", "distributor", "cultivator", "other"];
    if (!allowedTypes.includes(formData.businessType)) {
      errors.businessType = "Please select a valid business type.";
    }

    const allowedVolumes = ["5-10kg", "10-50kg", "50-100kg", "100kg+"];
    if (!allowedVolumes.includes(formData.volume)) {
      errors.volume = "Please select a valid volume range.";
    }

    // 6. Message (Optional)
    if (messageVal && messageVal.length > 1000) {
      errors.message = "Message cannot exceed 1000 characters.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submissionLockRef.current) {
      return;
    }

    setGlobalError("");
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitStatus("idle");
      return;
    }

    // Acquire lock immediately before starting async requests
    submissionLockRef.current = true;
    setSubmitStatus("submitting");

    const payload = {
      type: "wholesale",
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      business_name: formData.businessName.trim(),
      business_type: formData.businessType,
      volume: formData.volume,
      message: formData.message.trim() || null
    };

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: insertErr } = await supabase.from("inquiries").insert([payload]);
        if (insertErr) throw insertErr;
        
        if (isMountedRef.current) {
          setSubmitStatus("success");
          setIsMockSuccess(false);
        }
      } else {
        // Supabase is unavailable
        const isDev = process.env.NODE_ENV === "development";
        if (isDev) {
          // Gated development mock persistence
          const mockInqs = JSON.parse(localStorage.getItem("mock_inquiries") || "[]");
          mockInqs.push({
            id: `mock-inq-${Date.now()}`,
            ...payload,
            status: "Pending",
            created_at: new Date().toISOString()
          });
          localStorage.setItem("mock_inquiries", JSON.stringify(mockInqs));
          
          if (isMountedRef.current) {
            setSubmitStatus("success");
            setIsMockSuccess(true);
          }
        } else {
          // In production, block localStorage fallback and show real error/unavailable state
          if (isMountedRef.current) {
            setGlobalError("Wholesale inquiry service is currently offline. Please contact us directly at customar@shrooom.in.");
            setSubmitStatus("error");
          }
        }
      }
    } catch (err) {
      console.error("Error submitting wholesale inquiry to Supabase:", err);
      if (isMountedRef.current) {
        setGlobalError("Unable to submit inquiry. Please check your connection and try again.");
        setSubmitStatus("error");
      }
    } finally {
      // Release lock unconditionally in finally block
      submissionLockRef.current = false;
    }
  };

  const handleReset = () => {
    if (isMountedRef.current) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        businessType: "restaurant",
        volume: "5-10kg",
        message: ""
      });
      setSubmitStatus("idle");
      setIsMockSuccess(false);
      setFieldErrors({});
      setGlobalError("");
    }
  };

  return (
    <div className="wholesale-container">
      {/* Programmatic Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {submitStatus === "submitting" && "Submitting wholesale partnership inquiry..."}
        {submitStatus === "success" && "Inquiry submitted successfully."}
        {submitStatus === "error" && `Submission failed. ${globalError}`}
      </div>

      <div className="wholesale-inner">
        <header className="wholesale-header-section">
          <span className="wholesale-eyebrow">Culinary & Farm Partnerships</span>
          <h1 className="wholesale-title">Commercial Accounts & Bulk Supply</h1>
          <p className="wholesale-subtitle">
            Reliable commercial supply of premium gourmet mushrooms for restaurants, boutique grocers, and culinary distributors.
          </p>
          <div className="wholesale-divider" aria-hidden="true"></div>
        </header>

        {/* Info Highlights section */}
        <section className="wholesale-benefits-grid" aria-label="Wholesale supply advantages">
          <div className="benefit-card-wholesale">
            <i className="fa fa-truck benefit-icon-ws" aria-hidden="true"></i>
            <h3>Temperature-Controlled Logistics</h3>
            <p>We deliver in temperature-controlled packaging directly to your facility, preserving freshness from harvest to delivery.</p>
          </div>
          <div className="benefit-card-wholesale">
            <i className="fa fa-calendar-check-o benefit-icon-ws" aria-hidden="true"></i>
            <h3>Coordinated Scheduling</h3>
            <p>We work with your kitchen to coordinate custom cultivation schedules, helping ensure reliable commercial supply year-round.</p>
          </div>
          <div className="benefit-card-wholesale">
            <i className="fa fa-cutlery benefit-icon-ws" aria-hidden="true"></i>
            <h3>Premium Cultivars</h3>
            <p>Our facility cultivates premium strains selected for exceptional culinary texture, rich color, and shelf stability.</p>
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
                    <i className="fa fa-archive" aria-hidden="true"></i>
                    <span><strong>Packaging:</strong> {prod.packaging}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Form / Submission Card */}
          <div className="wholesale-form-panel">
            {submitStatus === "success" ? (
              <div className="form-success-card" role="region" aria-label="Inquiry submission success">
                <div className="success-icon-wrapper">
                  <i className="fa fa-check" aria-hidden="true"></i>
                </div>
                <h3>{isMockSuccess ? "Development Mock Inquiry Saved!" : "Inquiry Submitted Successfully!"}</h3>
                
                {isMockSuccess ? (
                  <div className="dev-mock-badge" role="alert">
                    <i className="fa fa-warning" aria-hidden="true"></i>
                    <p>
                      <strong>Development Mode:</strong> Saved locally to LocalStorage. No remote data was transmitted.
                    </p>
                  </div>
                ) : (
                  <p>
                    Thank you for reaching out to <strong>Shroooms Wholesale</strong>. Our logistics team will review your sourcing requirements and follow up with you.
                  </p>
                )}

                <div className="submitted-summary">
                  <p><strong>Partner:</strong> {formData.name}</p>
                  <p><strong>Business:</strong> {formData.businessName}</p>
                  <p><strong>Type:</strong> {formData.businessType.toUpperCase()}</p>
                  <p><strong>Estimated Volume:</strong> {formData.volume}</p>
                </div>
                <button 
                  type="button"
                  className="reset-form-btn"
                  onClick={handleReset}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <div className="wholesale-form-card">
                <h2 className="panel-title">Inquire for Partnership</h2>
                <p className="form-guide-text">
                  Complete the B2B inquiry form below, and our commercial logistics team will contact you to discuss sourcing requirements.
                </p>
                
                {submitStatus === "error" && globalError && (
                  <div className="form-error-banner" role="alert">
                    <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                    <span>{globalError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="ws-form" noValidate>
                  <div className="form-group">
                    <label htmlFor="name">Contact Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="e.g. Chef Sanjay Kapoor"
                      value={formData.name}
                      onChange={handleChange}
                      maxLength={100}
                      required
                      aria-required="true"
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? "name-error" : undefined}
                      autoComplete="name"
                      disabled={submitStatus === "submitting"}
                    />
                    {fieldErrors.name && (
                      <span className="field-error-text" id="name-error" role="alert">
                        {fieldErrors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="businessName">Business / Restaurant Name *</label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      placeholder="e.g. The Truffle Table"
                      value={formData.businessName}
                      onChange={handleChange}
                      maxLength={100}
                      required
                      aria-required="true"
                      aria-invalid={!!fieldErrors.businessName}
                      aria-describedby={fieldErrors.businessName ? "businessName-error" : undefined}
                      autoComplete="organization"
                      disabled={submitStatus === "submitting"}
                    />
                    {fieldErrors.businessName && (
                      <span className="field-error-text" id="businessName-error" role="alert">
                        {fieldErrors.businessName}
                      </span>
                    )}
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
                        maxLength={100}
                        required
                        aria-required="true"
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? "email-error" : undefined}
                        autoComplete="email"
                        disabled={submitStatus === "submitting"}
                      />
                      {fieldErrors.email && (
                        <span className="field-error-text" id="email-error" role="alert">
                          {fieldErrors.email}
                        </span>
                      )}
                    </div>
                    <div className="form-group half-ws">
                      <label htmlFor="phone">Contact Number (Optional)</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        placeholder="e.g. +91 92389 09365"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={20}
                        aria-invalid={!!fieldErrors.phone}
                        aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                        autoComplete="tel"
                        disabled={submitStatus === "submitting"}
                      />
                      {fieldErrors.phone && (
                        <span className="field-error-text" id="phone-error" role="alert">
                          {fieldErrors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-row-ws">
                    <div className="form-group half-ws">
                      <label htmlFor="businessType">Business Type *</label>
                      <select
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        disabled={submitStatus === "submitting"}
                      >
                        <option value="restaurant">Restaurant / Culinary</option>
                        <option value="grocer">Boutique Grocery Store</option>
                        <option value="distributor">Wholesale Distributor</option>
                        <option value="cultivator">Mushroom Farm / Urban Grower</option>
                        <option value="other">Other Business Entity</option>
                      </select>
                    </div>

                    <div className="form-group half-ws">
                      <label htmlFor="volume">Weekly Volume (Est.) *</label>
                      <select
                        id="volume"
                        name="volume"
                        value={formData.volume}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        disabled={submitStatus === "submitting"}
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
                      maxLength={1000}
                      disabled={submitStatus === "submitting"}
                    ></textarea>
                  </div>

                  <p className="form-privacy-note">
                    By submitting this inquiry, you agree to our B2B coordination terms. We process your details in accordance with our <Link to="/privacy-policy" className="privacy-link">Privacy Policy</Link>.
                  </p>

                  <button 
                    type="submit" 
                    className="ws-submit-btn"
                    disabled={submitStatus === "submitting"}
                  >
                    {submitStatus === "submitting" ? (
                      <>Submitting inquiry... <i className="fa fa-spinner fa-spin"></i></>
                    ) : (
                      <>Submit Partnership Inquiry <i className="fa fa-paper-plane"></i></>
                    )}
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
