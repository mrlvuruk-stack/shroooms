/* u:\VeggiesShop-main\src\components\Footer\Footer.js */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Footer.css";

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
  };
  return (
    <footer className="shroooms-custom-footer">
      
      {/* MAIN CONTENT AREA */}
      <div className="footer-main-container">
        
        {/* COLUMN 1: BRAND */}
        <div className="footer-brand-column">
          <div className="footer-logo-wrapper">
            <img src="/footer_logo.png" alt="SHROOOMS Logo" className="footer-brand-logo-img" />
          </div>
          <p className="footer-tagline-text">
            Nourishing lives with pure, premium and sustainably grown mushrooms.
          </p>
          <div className="footer-social-row">
            <a href="https://www.instagram.com/shroooms.in/" target="_blank" rel="noreferrer" className="social-gold-circle">
              <i className="fa fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61591560354551" target="_blank" rel="noreferrer" className="social-gold-circle">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="https://www.youtube.com/channel/UC2mzbw-IGm995O1QJfGEccA" target="_blank" rel="noreferrer" className="social-gold-circle">
              <i className="fa fa-youtube-play"></i>
            </a>
            <a href="https://x.com/SHROOOM23" target="_blank" rel="noreferrer" className="social-gold-circle">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="https://wa.me/919238909365" target="_blank" rel="noreferrer" className="social-gold-circle">
              <i className="fa fa-whatsapp"></i>
            </a>
          </div>
        </div>

        {/* VERTICAL DIVIDER */}
        <div className="footer-vertical-line"></div>

        {/* COLUMN 2: GET IN TOUCH */}
        <div className="footer-contact-column">
          <h4 className="contact-column-header">GET IN TOUCH</h4>
          
          <div className="contact-list-items">
            <div className="contact-item">
              <div className="contact-icon-wrapper">
                <i className="fa fa-map-marker"></i>
              </div>
              <div className="contact-text-wrapper">
                <p>77, Phoenix Township,</p>
                <p>Kelod Hala, Dewas Naka,</p>
                <p>Indore, Madhya Pradesh, India</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon-wrapper">
                <i className="fa fa-phone"></i>
              </div>
              <div className="contact-text-wrapper">
                <p><a href="tel:+919238909365" className="contact-link">+91 92389 09365</a></p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon-wrapper">
                <i className="fa fa-envelope-o"></i>
              </div>
              <div className="contact-text-wrapper">
                <p><a href="mailto:customar@shrooom.in" className="contact-link">customar@shrooom.in</a></p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon-wrapper">
                <i className="fa fa-globe"></i>
              </div>
              <div className="contact-text-wrapper">
                <p><a href="https://www.shrooom.in" target="_blank" rel="noreferrer" className="contact-link">www.shrooom.in</a></p>
              </div>
            </div>
          </div>
        </div>

        {/* VERTICAL DIVIDER */}
        <div className="footer-vertical-line"></div>

        {/* COLUMN 3: VALUES GRID */}
        <div className="footer-values-column">
          <div className="values-badge-grid">
            
            {/* VALUE 1 */}
            <div className="value-badge-item">
              <div className="value-badge-icon-box">
                <svg viewBox="0 0 24 24" className="value-badge-svg">
                  <path d="M2 22s4-12 15-15c0 0-4 8-10 11" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 7c3-3 5-3 5-3s0 2-3 5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 12c-2-2-4-2-6 0" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="2" y1="22" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="value-badge-label">Pure<br />& Organic</span>
            </div>

            {/* VALUE 2 */}
            <div className="value-badge-item">
              <div className="value-badge-icon-box">
                <svg viewBox="0 0 24 24" className="value-badge-svg">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="value-badge-label">Premium<br />Quality</span>
            </div>

            {/* VALUE 3 */}
            <div className="value-badge-item">
              <div className="value-badge-icon-box">
                <svg viewBox="0 0 24 24" className="value-badge-svg">
                  <path d="M12 22V10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 10C8.5 7.5 7 5 7 5s4 0 5 5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 12C15.5 9.5 17 7 17 7s-4 0-5 5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="4" r="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="value-badge-label">Sustainably<br />Grown</span>
            </div>

            {/* VALUE 4 */}
            <div className="value-badge-item">
              <div className="value-badge-icon-box">
                <svg viewBox="0 0 24 24" className="value-badge-svg">
                  <path d="M14 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="7.5" cy="18.5" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="18.5" cy="18.5" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="2" y1="10" x2="4" y2="10" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="1" y1="13" x2="4" y2="13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="value-badge-label">Farm Fresh<br />Delivery</span>
            </div>

            {/* VALUE 5 */}
            <div className="value-badge-item">
              <div className="value-badge-icon-box">
                <svg viewBox="0 0 24 24" className="value-badge-svg">
                  <path d="M6 3h12M9 3v6L4 18a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3L15 9V3" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="3" y1="3" x2="21" y2="21" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="value-badge-label">No Chemicals<br />No Additives</span>
            </div>

            {/* VALUE 6 */}
            <div className="value-badge-item">
              <div className="value-badge-icon-box">
                <svg viewBox="0 0 24 24" className="value-badge-svg">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="9" x2="12" y2="15" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="9" y1="12" x2="15" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="value-badge-label">Nutrient<br />Rich</span>
            </div>

            {/* VALUE 7 */}
            <div className="value-badge-item">
              <div className="value-badge-icon-box">
                <svg viewBox="0 0 24 24" className="value-badge-svg">
                  <path d="M3 18c3-3 6-3 9 0" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 18V9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 11C10 9 9 7 9 7s3 0 3 4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 13C14 11 15 9 15 9s-3 0-3 4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 18c-3-3-6-3-9 0" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="value-badge-label">Ethically<br />Cultivated</span>
            </div>

            {/* VALUE 8 */}
            <div className="value-badge-item">
              <div className="value-badge-icon-box">
                <svg viewBox="0 0 24 24" className="value-badge-svg">
                  <circle cx="12" cy="8" r="6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.2 13.5L7 22l5-3 5 3-1.2-8.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="10 8 11.5 9.5 14 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="value-badge-label">Trusted<br />By Experts</span>
            </div>

          </div>
        </div>

        {/* COLUMN 4: NEWSLETTER / STAY CONNECTED */}
        <div className="footer-newsletter-column">
          <h4 className="newsletter-column-header">NEWSLETTER</h4>
          <p className="newsletter-desc-text">
            Subscribe to get exclusive offers, gourmet recipes, and expert cultivation insights.
          </p>
          <form onSubmit={handleSubscribe} className="footer-newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="footer-newsletter-input" 
              disabled
            />
            <button type="submit" className="footer-newsletter-btn" disabled>Subscribe</button>
          </form>
          <span className="newsletter-helper-text" style={{ fontSize: "1.1rem", color: "var(--color-text-secondary)", marginTop: "0.8rem", display: "block" }}>
            Newsletter signup is not currently available.
          </span>
        </div>

      </div>

      {/* GOLD SEPARATOR LINE */}
      <div className="footer-gold-separator">
        <div className="separator-center-icon">
          <span className="gold-mush-icon">🍄</span>
        </div>
      </div>

      {/* COPYRIGHT & BOTTOM BAR */}
      <div className="footer-bottom-container">
        
        {/* INDIA MAP OUTLINE */}
        <div className="footer-india-map-box">
          <img src="/footer_india_map.png" alt="Made in India Map" className="footer-map-img" />
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="footer-bottom-metadata">
          <span className="copyright-text">© 2026 <b>SHROOOMS</b>. All Rights Reserved.</span>
          <span className="bottom-divider-pipe">|</span>
          <span className="motto-text">Grown in Nature. <span className="underline-text">Crafted with Care.</span></span>
          <span className="bottom-divider-pipe">|</span>
          <span className="designer-text">
            Designed with <span className="designer-stamp-icon">🍄</span> in India.
          </span>
        </div>

        {/* E-E-A-T POLICY LINKS */}
        <div className="footer-policy-row">
          <Link to="/blog" className="footer-policy-link" style={{ fontWeight: 600, color: "var(--frugivore-green)" }}>Chronicles (Blog)</Link>
          <span className="footer-policy-dot">•</span>
          <Link to="/privacy-policy" className="footer-policy-link">Privacy Policy</Link>
          <span className="footer-policy-dot">•</span>
          <Link to="/refund-policy" className="footer-policy-link">Refund & Cancellation</Link>
          <span className="footer-policy-dot">•</span>
          <Link to="/shipping-policy" className="footer-policy-link">Shipping & Delivery</Link>
          <span className="footer-policy-dot">•</span>
          <Link to="/terms" className="footer-policy-link">Terms of Service</Link>
        </div>

        {/* DECORATIVE GOLD LEAF ON RIGHT */}
        <div className="footer-decorative-leaf">
          <i className="fa fa-leaf"></i>
        </div>

      </div>

    </footer>
  );
};

