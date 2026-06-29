import React, { useEffect } from "react";
import "./Policies.css";

const Policies = ({ type }) => {
  useEffect(() => {
    let title = "Policies | Shroooms";
    let desc = "Shroooms corporate policies and terms.";

    if (type === "privacy") {
      title = "Privacy Policy | Shroooms";
      desc = "Learn how Shroooms collects, uses, and protects your personal information.";
    } else if (type === "refund") {
      title = "Refund & Cancellation Policy | Shroooms";
      desc = "Details on order cancellations, returns, and refund guidelines for gourmet mushrooms.";
    } else if (type === "shipping") {
      title = "Shipping & Delivery Policy | Shroooms";
      desc = "Shipping zones, delivery timelines, and logistics details for Shroooms farm fresh delivery.";
    } else if (type === "terms") {
      title = "Terms of Service | Shroooms";
      desc = "Terms and conditions for buying mushrooms and grow kits on shrooom.in.";
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", desc);
    }
    window.scrollTo(0, 0);
  }, [type]);

  const renderContent = () => {
    switch (type) {
      case "privacy":
        return (
          <div className="policy-text-block">
            <h2 className="font-serif">1. Information We Collect</h2>
            <p>We collect personal information that you share with us (such as name, email address, phone number, delivery address) when you register on our storefront or place an order.</p>
            
            <h2 className="font-serif">2. How We Use Your Details</h2>
            <p>Your details are used solely to fulfill your gourmet mushroom orders, dispatch delivery notifications, process payments, and improve your user experience.</p>
            
            <h2 className="font-serif">3. Data Protection & Security</h2>
            <p>We implement standard encryption and secure Supabase database connection protocols to safeguard your personal details. We do not sell or share your data with third-party advertisers.</p>
            
            <h2 className="font-serif">4. Cookies Policy</h2>
            <p>We use essential cookies to maintain your login session and shopping cart state. You can disable cookies in your browser settings, but some features may not function properly.</p>
          </div>
        );
      case "refund":
        return (
          <div className="policy-text-block">
            <h2 className="font-serif">1. Fresh Harvest Guarantee</h2>
            <p>Since our gourmet mushrooms are harvested fresh and are highly perishable, we do not accept returns. However, your satisfaction is our priority.</p>
            
            <h2 className="font-serif">2. Refund Eligibility</h2>
            <p>If you receive damaged, contaminated, or incorrect mushroom cultivars, please contact us at <b>customar@shrooom.in</b> within 24 hours of delivery with photographic evidence. We will verify and process a full refund or send a fresh replacement batch.</p>
            
            <h2 className="font-serif">3. Order Cancellations</h2>
            <p>You can cancel your order within 2 hours of placement. Once a harvest batch has been prepared and packed for dispatch, cancellations cannot be processed.</p>
            
            <h2 className="font-serif">4. Refund Timelines</h2>
            <p>Approved refunds will be processed back to the original payment method within 5–7 business days.</p>
          </div>
        );
      case "shipping":
        return (
          <div className="policy-text-block">
            <h2 className="font-serif">1. Delivery Zones</h2>
            <p>We currently offer doorstep delivery for fresh gourmet mushrooms throughout Indore, Madhya Pradesh. For dried mushrooms and grow kits, we ship across major cities in India.</p>
            
            <h2 className="font-serif">2. Timelines & Dispatch</h2>
            <p>Indore local orders are delivered within 24–48 hours of harvest to maintain peak freshness. Pan-India shipments for non-perishable items take 3–5 business days.</p>
            
            <h2 className="font-serif">3. Shipping Fees</h2>
            <p>Local Indore delivery charges are flat rate, with free shipping available on orders exceeding a minimum purchase threshold (indicated during checkout).</p>
            
            <h2 className="font-serif">4. Delivery Failures</h2>
            <p>Ensure the provided delivery address and phone number are correct. We cannot process refunds for delivery failures caused by incorrect details or unavailability of the receiver.</p>
          </div>
        );
      case "terms":
        return (
          <div className="policy-text-block">
            <h2 className="font-serif">1. Terms of Use</h2>
            <p>By accessing shrooom.in, you agree to comply with these Terms of Service. If you disagree, please refrain from using our services.</p>
            
            <h2 className="font-serif">2. Product Descriptions & Pricing</h2>
            <p>We strive to display our fresh mushroom weights and prices accurately. However, natural moisture loss can cause minor weight fluctuations. Prices are subject to change without notice.</p>
            
            <h2 className="font-serif">3. Payments</h2>
            <p>All purchases must be paid in full during checkout. We use secure third-party payment gateways and do not store card credentials.</p>
            
            <h2 className="font-serif">4. Liability Limitation</h2>
            <p>Shroooms is not liable for health issues arising from improper storage, undercooking, or allergic reactions to mushrooms. Cook all mushrooms thoroughly before eating.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const getHeading = () => {
    if (type === "privacy") return "Privacy Policy";
    if (type === "refund") return "Refund & Cancellation";
    if (type === "shipping") return "Shipping & Delivery";
    if (type === "terms") return "Terms of Service";
    return "Company Policies";
  };

  return (
    <div className="policy-page-container">
      <div className="policy-inner-box animate__animated animate__fadeIn">
        <header className="policy-header-box">
          <span className="policy-eyebrow">SHROOOMS POLICIES</span>
          <h1 className="policy-title font-serif">{getHeading()}</h1>
          <div className="policy-header-divider"></div>
          <p className="policy-effective-date">Last Updated: June 2026</p>
        </header>
        
        {renderContent()}

        <footer className="policy-inner-footer">
          <p>For inquiries regarding our terms, contact us at <a href="mailto:customar@shrooom.in">customar@shrooom.in</a></p>
          <p>Office: 77, Phoenix Township, Kelod Hala, Dewas Naka, Indore, MP, India</p>
        </footer>
      </div>
    </div>
  );
};

export default Policies;
