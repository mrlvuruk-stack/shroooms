import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "./HeaderCheckout.css";

const HeaderCheckout = () => {
  const userInfo = useSelector((state) => state.userSignIn.userInfo);

  let user;
  if (userInfo && userInfo.userName) {
    user = userInfo.userName.split(" ");
  }

  return (
    <header className="row header-checkout" style={{ backgroundColor: "var(--frugivore-bg)", borderBottom: "1px solid var(--frugivore-border)" }}>
      <div>
        <Link className="brand" to="/" style={{ display: "flex", alignItems: "center", gap: "1.2rem", textDecoration: "none" }}>
          <img src="/shrooom.jpg" alt="Shrooom" style={{ height: "5.8rem", width: "auto", borderRadius: "8px", objectFit: "contain" }} />
          <span className="brand-text" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '3.2rem', fontWeight: '700', color: 'var(--frugivore-dark)', letterSpacing: '-0.5px' }}>Shrooom</span>
        </Link>
      </div>
      <div className="header-item header-item--checkout-promise">
        <div className="checkout-promise-item">
          {userInfo && userInfo.userName
            ? `Hi ${user[0]} please complete your checkout`
            : "Hi please complete your checkout"}
        </div>
      </div>
    </header>
  );
};

export default HeaderCheckout;
