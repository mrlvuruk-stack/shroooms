import React, { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../../supabase";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "support",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const defaultContact = {
    address: "77, Phoenix Township, Kelod Hala, Dewas Naka, Indore, Madhya Pradesh, India",
    phone: "+91 92389 09365",
    email: "customar@shrooom.in",
    supportHours: "Fruiting Chamber misting cycles run hourly. Offices closed on National Holidays.",
    helplineHours: "Mon - Sat, 8:00 AM - 6:00 PM"
  };

  const [contact, setContact] = useState(defaultContact);

  useEffect(() => {
    const fetchContact = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from("contact").select("*").eq("id", "coordinates");
          if (!error && data && data.length > 0) {
            setContact(data[0]);
            return;
          }
        } catch (err) {
          console.error("Supabase contact fetch error:", err);
        }
      }
      const saved = localStorage.getItem("mock_contact");
      if (saved) {
        setContact(JSON.parse(saved));
      } else {
        localStorage.setItem("mock_contact", JSON.stringify(defaultContact));
      }
    };
    fetchContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: insertErr } = await supabase.from("inquiries").insert([{
          type: "direct",
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim()
        }]);
        if (insertErr) throw insertErr;
      } catch (err) {
        console.error("Error submitting contact inquiry to Supabase:", err);
        setError("Unable to submit query. Please try again later.");
        return;
      }
    } else {
      // Fallback: save to mock inquiries list in localStorage
      const mockInqs = JSON.parse(localStorage.getItem("mock_inquiries") || "[]");
      mockInqs.push({
        id: `mock-inq-${Date.now()}`,
        type: "direct",
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
        status: "Pending",
        created_at: new Date().toISOString()
      });
      localStorage.setItem("mock_inquiries", JSON.stringify(mockInqs));
    }

    setSubmitted(true);
  };

  return (
    <div className="contact-container">
      <div className="contact-inner animate__animated animate__fadeIn">
        <header className="contact-header-section">
          <span className="contact-eyebrow">Connect with Us</span>
          <h1 className="contact-title">We'd Love to Hear From You</h1>
          <p className="contact-subtitle">
            Whether you are a culinary chef, an urban grower, or starting your wellness journey, get in touch with our team.
          </p>
          <div className="contact-divider"></div>
        </header>

        {/* Contact Split layout */}
        <section className="contact-split-section">
          
          {/* Left panel: Info Coordinates */}
          <div className="contact-info-panel">
            <h2 className="panel-title font-serif">Our Coordinates</h2>
            
            <div className="info-coords-list">
              <div className="coord-item">
                <div className="coord-icon-box">
                  <i className="fa fa-map-marker"></i>
                </div>
                <div className="coord-text-box">
                  <h4>Farming Greenhouse</h4>
                  <p>{contact.address}</p>
                </div>
              </div>

              <div className="coord-item">
                <div className="coord-icon-box">
                  <i className="fa fa-phone"></i>
                </div>
                <div className="coord-text-box">
                  <h4>Helpline / WhatsApp</h4>
                  <p><a href={`tel:${contact.phone.replace(/\s+/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contact.phone}</a><br />{contact.helplineHours}</p>
                </div>
              </div>

              <div className="coord-item">
                <div className="coord-icon-box">
                  <i className="fa fa-envelope-o"></i>
                </div>
                <div className="coord-text-box">
                  <h4>Electronic Mail</h4>
                  <p><a href={`mailto:${contact.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contact.email}</a></p>
                </div>
              </div>

              <div className="coord-item">
                <div className="coord-icon-box">
                  <i className="fa fa-clock-o"></i>
                </div>
                <div className="coord-text-box">
                  <h4>Greenhouse Support Hours</h4>
                  <p>{contact.supportHours}</p>
                </div>
              </div>
            </div>

            {/* Social handles */}
            <div className="contact-socials-wrapper">
              <h4>Follow the Mycelium</h4>
              <div className="social-links-row">
                <a href="https://www.instagram.com/shroooms.in/" target="_blank" rel="noopener noreferrer" className="social-btn">
                  <i className="fa fa-instagram"></i>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61591560354551" target="_blank" rel="noopener noreferrer" className="social-btn">
                  <i className="fa fa-facebook"></i>
                </a>
                <a href="https://x.com/SHROOOM23" target="_blank" rel="noopener noreferrer" className="social-btn">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href="https://www.youtube.com/channel/UC2mzbw-IGm995O1QJfGEccA" target="_blank" rel="noopener noreferrer" className="social-btn">
                  <i className="fa fa-youtube-play"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Right panel: Contact Form */}
          <div className="contact-form-panel">
            {submitted ? (
              <div className="contact-success-card animate__animated animate__zoomIn">
                <div className="success-icon-wrapper-contact">
                  <i className="fa fa-paper-plane"></i>
                </div>
                <h3>Message Sent Successfully!</h3>
                <p>
                  Thank you, <strong>{formData.name}</strong>, for reaching out. We have queued your message in our support chambers, and a mycology specialist will respond to you at <strong>{formData.email}</strong> within 12 business hours.
                </p>
                <div className="contact-summary">
                  <p><strong>Contact Name:</strong> {formData.name}</p>
                  <p><strong>Email Address:</strong> {formData.email}</p>
                  <p><strong>Subject Area:</strong> {formData.subject.toUpperCase()}</p>
                </div>
                <button 
                  className="reset-contact-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "support", message: "" });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="contact-form-card">
                <h2 className="panel-title font-serif">Inquire Direct</h2>
                <p className="form-guide-text">
                  Complete the inquiry form below and we will route your request directly to our growers or support desk.
                </p>
                
                {error && (
                  <div className="contact-error-banner animate__animated animate__shakeX">
                    <i className="fa fa-exclamation-triangle"></i>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="c-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="e.g. Sanjay Kapoor"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="e.g. sanjay@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject of Inquiry</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="support">General Customer Support</option>
                      <option value="orders">Online Order & Cart Inquiry</option>
                      <option value="tours">Greenhouse Farm Tours</option>
                      <option value="press">Press, media & Collaborations</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message / Details</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="Detail your question, order number, or visit requests..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="contact-submit-btn">
                    Send Inquiry Message <i className="fa fa-paper-plane"></i>
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

export default Contact;
