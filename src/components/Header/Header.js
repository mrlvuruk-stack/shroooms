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
  const [scrolled, setScrolled] = useState(false);

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
  const [productsAccordionOpen, setProductsAccordionOpen] = useState(false);

  React.useEffect(() => {
    let isScrolled = false;
    const handleScroll = () => {
      const shouldScroll = window.scrollY > 40;
      if (shouldScroll !== isScrolled) {
        isScrolled = shouldScroll;
        setScrolled(shouldScroll);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`header-container ${scrolled ? "header-compact" : ""}`}>
      {/* Top Utility Strip */}
      <div className="top-utility-strip">
        <div className="utility-inner">
          <span className="utility-item">
            <i className="fa fa-map-marker"></i> Controlled indoor vertical farm in Indore
          </span>
          <span className="utility-sep">·</span>
          <span className="utility-item">
            <i className="fa fa-leaf"></i> Fresh gourmet cultivars and grow kits
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
              <Link to="/shop" className="menu-link">SHOP <i className="fa fa-angle-down"></i></Link>
              <div className="shop-dropdown-menu">
                <Link to="/shop">All Premium Catalog</Link>
                <Link to="/shop" onClick={() => dispatch(filteredProducts(""))}>Mushroom Spawn</Link>
                <Link to="/shop" onClick={() => dispatch(filteredProducts("oyster"))}>Liquid Culture</Link>
                <Link to="/shop" onClick={() => dispatch(filteredProducts("lion"))}>Grow Kits</Link>
              </div>
            </li>
            <li className="menu-item">
              <Link to="/our-story" className="menu-link">OUR STORY</Link>
            </li>
            <li className="menu-item">
              <Link to="/mushroom-guide" className="menu-link">MUSHROOM GUIDE</Link>
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

        {/* Mobile Navigation Drawer */}
        <div className={`mobile-navigation-dropdown ${menuOpen ? "open" : ""}`}>
          <div className="mobile-drawer-header">
            <span className="mobile-drawer-brand">SHROOOMS Menu</span>
            <button className="mobile-drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
          </div>

          <ul className="mobile-menu-list">
            {/* 🏠 Home */}
            <li className={`mobile-menu-item ${history.location.pathname === "/" ? "active-item" : ""}`}>
              <Link to="/" onClick={() => setMenuOpen(false)} className="mobile-menu-link">
                <span className="menu-item-left">
                  <span className="menu-icon">🏠</span> Home
                </span>
              </Link>
            </li>

            {/* 🛍 Products (Expandable Accordion Menu) */}
            <li className={`mobile-menu-item accordion-item ${productsAccordionOpen || history.location.pathname.startsWith("/shop") ? "accordion-expanded" : ""}`}>
              <div 
                className={`mobile-menu-link accordion-trigger ${history.location.pathname.startsWith("/shop") ? "active-trigger" : ""}`}
                onClick={() => setProductsAccordionOpen(!productsAccordionOpen)}
              >
                <span className="menu-item-left">
                  <span className="menu-icon">🛍</span> Products
                </span>
                <i className={`fa fa-chevron-down accordion-chevron ${productsAccordionOpen ? "rotated" : ""}`}></i>
              </div>

              {/* Accordion Submenu Panel */}
              <div className={`mobile-submenu-collapse ${productsAccordionOpen ? "expanded" : ""}`}>
                <ul className="mobile-submenu-list">
                  <li className="mobile-submenu-item">
                    <Link to="/shop" onClick={() => setMenuOpen(false)} className="mobile-submenu-link">
                      <span className="sub-icon">🍄</span> Fresh Mushrooms
                    </Link>
                  </li>
                  <li className="mobile-submenu-item">
                    <Link to="/shop" onClick={() => setMenuOpen(false)} className="mobile-submenu-link">
                      <span className="sub-icon">🌿</span> Dried Mushrooms
                    </Link>
                  </li>
                  <li className="mobile-submenu-item">
                    <Link to="/shop" onClick={() => setMenuOpen(false)} className="mobile-submenu-link">
                      <span className="sub-icon">🌱</span> Mushroom Spawn
                    </Link>
                  </li>
                  <li className="mobile-submenu-item">
                    <Link to="/shop" onClick={() => setMenuOpen(false)} className="mobile-submenu-link">
                      <span className="sub-icon">🧪</span> Liquid Culture
                    </Link>
                  </li>
                  <li className="mobile-submenu-item">
                    <Link to="/shop" onClick={() => setMenuOpen(false)} className="mobile-submenu-link">
                      <span className="sub-icon">🛠</span> Tools & Accessories
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* 📖 Mushroom Guide */}
            <li className={`mobile-menu-item ${history.location.pathname === "/mushroom-guide" ? "active-item" : ""}`}>
              <Link to="/mushroom-guide" onClick={() => setMenuOpen(false)} className="mobile-menu-link">
                <span className="menu-item-left">
                  <span className="menu-icon">📖</span> Mushroom Guide
                </span>
              </Link>
            </li>

            {/* 🍽 Recipes */}
            <li className={`mobile-menu-item ${history.location.pathname === "/recipes" ? "active-item" : ""}`}>
              <Link to="/recipes" onClick={() => setMenuOpen(false)} className="mobile-menu-link">
                <span className="menu-item-left">
                  <span className="menu-icon">🍽</span> Recipes
                </span>
              </Link>
            </li>

            {/* 🏢 Wholesale */}
            <li className={`mobile-menu-item ${history.location.pathname === "/wholesale" ? "active-item" : ""}`}>
              <Link to="/wholesale" onClick={() => setMenuOpen(false)} className="mobile-menu-link">
                <span className="menu-item-left">
                  <span className="menu-icon">🏢</span> Wholesale
                </span>
              </Link>
            </li>

            {/* 📚 Blog */}
            <li className={`mobile-menu-item ${history.location.pathname === "/blog" ? "active-item" : ""}`}>
              <Link to="/blog" onClick={() => setMenuOpen(false)} className="mobile-menu-link">
                <span className="menu-item-left">
                  <span className="menu-icon">📚</span> Blog
                </span>
              </Link>
            </li>

            {/* ❤️ Our Story */}
            <li className={`mobile-menu-item ${history.location.pathname === "/our-story" ? "active-item" : ""}`}>
              <Link to="/our-story" onClick={() => setMenuOpen(false)} className="mobile-menu-link">
                <span className="menu-item-left">
                  <span className="menu-icon">❤️</span> Our Story
                </span>
              </Link>
            </li>

            {/* 📞 Contact */}
            <li className={`mobile-menu-item ${history.location.pathname === "/contact" ? "active-item" : ""}`}>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="mobile-menu-link">
                <span className="menu-item-left">
                  <span className="menu-icon">📞</span> Contact
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;

