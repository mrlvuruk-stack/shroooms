import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { sidebarOpen } from "../../store/actions/actionCreators/addToCartAction";
import {
  userSignOut,
} from "../../store/actions/actionCreators/signInAction";
import { filteredProducts } from "../../store/actions/actionCreators/productsListAction";

import "./Header.css";

const Header = (props) => {
  const history = useHistory();
  const [showSearch, setShowSearch] = useState(false);

  const cartInfo = useSelector((state) => state.cart.cartData);
  const searchTerm = useSelector((state) => state.searchFilter);

  const { totalQuantity } = cartInfo;

  const dispatch = useDispatch();

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo } = userSignIn;

  let user;

  if (userInfo && userInfo.userName) {
    user = userInfo.userName.split(" ");
  }

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="header-container">
      {/* Top Utility Strip */}
      <div className="top-utility-strip">
        <div className="utility-inner">
          <span className="utility-item">
            <i className="fa fa-truck"></i> Same-Day Deliveries in DelhiNCR
          </span>
          <span className="utility-sep">·</span>
          <span className="utility-item">
            <i className="fa fa-clock-o"></i> Deliveries from 8 AM
          </span>
          <span className="utility-sep">·</span>
          <span className="utility-item utility-cta">
            <i className="fa fa-gift"></i> Get 50% off on your 1st order
          </span>
        </div>
      </div>

      <header
        className={
          history.location.pathname === "/orders"
            ? "row header-checkout main-header"
            : "row main-header"
        }
      >
        <div className="header-logo-area">
          <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            <i className={`fa ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
          <Link className="brand" to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/shroooms_logo_full.png" alt="Shroooms" style={{ height: "6.8rem", objectFit: "contain" }} />
          </Link>
        </div>

        {/* Center Navigation Menu Links */}
        <div className="header-nav-center">
          <ul className="header-menu-list">
            <li className="menu-item dropdown-shop">
              <a href="/#produce-list" className="menu-link">SHOP <i className="fa fa-angle-down"></i></a>
              <div className="shop-dropdown-menu">
                <Link to="/" onClick={() => dispatch(filteredProducts(""))}>All Mushrooms</Link>
                <Link to="/" onClick={() => dispatch(filteredProducts("organic"))}>Organic Cultivars</Link>
                <Link to="/" onClick={() => dispatch(filteredProducts("medicinal"))}>Medicinal & Teas</Link>
              </div>
            </li>
            <li className="menu-item">
              <Link to="/our-story" className="menu-link">OUR STORY</Link>
            </li>
            <li className="menu-item">
              <Link to="/health-benefits" className="menu-link">HEALTH BENEFITS</Link>
            </li>
            <li className="menu-item">
              <Link to="/recipes" className="menu-link">RECIPES</Link>
            </li>

            <li className="menu-item">
              <Link to="/wholesale" className="menu-link">WHOLESALE</Link>
            </li>
            <li className="menu-item">
              <Link to="/blog" className="menu-link">BLOG</Link>
            </li>
            <li className="menu-item">
              <Link to="/contact" className="menu-link">CONTACT</Link>
            </li>
          </ul>
        </div>

        {/* Right side Actions (Icons) */}
        <div className="header-actions-right">
          {/* Toggleable Search field */}
          <div className={`search-container ${showSearch ? "active" : ""}`}>
            {showSearch && (
              <input
                type="text"
                name="search"
                className="searchinput-nav animate__animated animate__fadeInRight"
                value={searchTerm}
                onChange={(e) =>
                  dispatch(filteredProducts(e.target.value.toLowerCase()))
                }
                placeholder="Search..."
                autoFocus
              />
            )}
            <button className="icon-btn search-toggle" onClick={() => setShowSearch(!showSearch)}>
              <i className="fa fa-search"></i>
            </button>
          </div>

          {/* User Account / Profile dropdown */}
          <div className="profile-container">
            {userInfo ? (
              <div className="dropdown">
                <Link to="#" className="icon-btn">
                  <i className="fa fa-user-o"></i>
                </Link>
                <div className="dropdown-content">
                  <span className="dropdown-user-welcome" style={{ padding: "0.8rem 1.6rem", display: "block", fontSize: "1.2rem", color: "var(--frugivore-gray)", borderBottom: "1px solid var(--frugivore-border)" }}>Hi, {user ? user[0] : "User"}</span>
                  <Link to="/profile">My Profile</Link>
                  <Link to="/orders">My Orders</Link>
                  <Link to="/wishlist">Wishlist</Link>
                  <Link to="#" onClick={() => dispatch(userSignOut())}>Sign Out</Link>
                </div>
              </div>
            ) : (
              <div className="dropdown">
                <Link to="#" className="icon-btn">
                  <i className="fa fa-user-o"></i>
                </Link>
                <div className="dropdown-content">
                  <Link to="/signin">Sign In</Link>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon with red badge */}
          <button className="icon-btn cart-btn-header" onClick={() => dispatch(sidebarOpen())}>
            <i className="fa fa-shopping-basket"></i>
            <span className="badge-count-header">{totalQuantity}</span>
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={`mobile-navigation-dropdown ${menuOpen ? "open" : ""}`}>
          <ul className="mobile-menu-list">
            <li className="mobile-menu-item">
              <Link to="/" onClick={() => { setMenuOpen(false); dispatch(filteredProducts("")); }} className="mobile-menu-link">All Mushrooms</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/" onClick={() => { setMenuOpen(false); dispatch(filteredProducts("organic")); }} className="mobile-menu-link">Organic Cultivars</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/" onClick={() => { setMenuOpen(false); dispatch(filteredProducts("medicinal")); }} className="mobile-menu-link">Medicinal &amp; Teas</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/our-story" onClick={() => setMenuOpen(false)} className="mobile-menu-link">OUR STORY</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/health-benefits" onClick={() => setMenuOpen(false)} className="mobile-menu-link">HEALTH BENEFITS</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/recipes" onClick={() => setMenuOpen(false)} className="mobile-menu-link">RECIPES</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/wholesale" onClick={() => setMenuOpen(false)} className="mobile-menu-link">WHOLESALE</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/blog" onClick={() => setMenuOpen(false)} className="mobile-menu-link">BLOG</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="mobile-menu-link">CONTACT</Link>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;

