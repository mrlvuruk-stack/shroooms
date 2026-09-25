import React, { useEffect, useRef } from "react";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { auth, onAuthStateChanged } from "./firebase";
import { syncFirebaseUser, userSignOut } from "./store/actions/actionCreators/signInAction";

import { Footer } from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import HeaderCheckout from "./components/HeaderCheckout/HeaderCheckout";
import Home from "./pages/Home/Home";
import BadRequest from "./pages/BadRequest";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import SignIn from "./components/SignIn/SignIn";
import Checkout from "./pages/Chekout/Checkout";

import "./App.css";
import Orders from "./pages/Orders/Orders";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Wishlist from "./pages/Wishlist/Wishlist";
import Dashboard from "./pages/Dashboard/Dashboard";
import OurStory from "./pages/OurStory/OurStory";
import HealthBenefits from "./pages/HealthBenefits/HealthBenefits";
import Recipes from "./pages/Recipes/Recipes";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";
import Wholesale from "./pages/Wholesale/Wholesale";
import Blog from "./pages/Blog/Blog";
import BlogArticle from "./pages/Blog/BlogArticle";
import Contact from "./pages/Contact/Contact";
import Admin from "./pages/Admin/Admin";
import SignInPage from "./pages/SignInPage/SignInPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import Profile from "./pages/Profile/Profile";
import Policies from "./pages/Policies/Policies";
import MushroomGuide from "./pages/MushroomGuide/MushroomGuide";
import ProductsPage from "./pages/Shop/ProductsPage";
import GlobalLoader from "./components/GlobalLoader/GlobalLoader";

const App = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const prevUserRef = useRef(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(syncFirebaseUser(user));
        // Redirect to main application view or intended path when logged in
        if (location.pathname === "/signin" || location.pathname === "/signup") {
          const redirectPath = location.state?.from?.pathname || "/";
          history.push(redirectPath);
        }
      } else {
        // If user was previously authenticated and has now signed out
        if (prevUserRef.current === true) {
          dispatch(userSignOut());
          if (location.pathname !== "/signin" && location.pathname !== "/signup") {
            history.push("/signin");
          }
        }
      }
      prevUserRef.current = !!user;
    });
    return () => unsubscribe();
  }, [dispatch, history, location.pathname, location.state]);

  // Admin panel is full-screen standalone — skip header/footer
  if (location.pathname === "/admin") {
    return <Admin />;
  }

  const getHeader = () => {
    if (location.pathname === "/checkout") {
      return <HeaderCheckout />;
    } else {
      return <Header />;
    }
  };

  return (
    <GlobalLoader>
      <div className="grid-container">
      {getHeader()}
      {/* Nature/Botanical & Spore Side Background Decorations */}
      <div className="global-decor-container">
        {/* Background Ambient Glowing Orbs */}
        <div className="bg-glow-orb orb-left-top"></div>
        <div className="bg-glow-orb orb-right-mid"></div>
        <div className="bg-glow-orb orb-left-bottom"></div>

        {/* Left Side Organic Botanical & Mushroom Cap Art */}
        <div className="global-nature-decor left-decor">
          <svg width="100%" height="100%" viewBox="0 0 320 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="goldGradientLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#c5a059" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="emeraldGradientLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#267a3f" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#1b2e23" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            
            {/* Vine stem */}
            <path d="M-20,780 C60,600 140,450 110,100 M110,100 C100,50 60,10 10,-20" stroke="url(#goldGradientLeft)" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Mushroom Caps */}
            <g transform="translate(100, 140) rotate(-15) scale(0.9)">
              <path d="M0,40 Q30,-20 60,40 Z" fill="url(#goldGradientLeft)" stroke="#c5a059" strokeWidth="1" />
              <path d="M25,40 L25,70 M35,40 L35,70" stroke="#c5a059" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
            <g transform="translate(60, 320) rotate(10) scale(0.75)">
              <path d="M0,40 Q30,-20 60,40 Z" fill="url(#emeraldGradientLeft)" stroke="#267a3f" strokeWidth="1" />
              <path d="M25,40 L25,65 M35,40 L35,65" stroke="#267a3f" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
            <g transform="translate(85, 520) rotate(-5) scale(0.85)">
              <path d="M0,40 Q35,-25 70,40 Z" fill="url(#goldGradientLeft)" stroke="#c5a059" strokeWidth="1" />
              <path d="M30,40 L30,75 M40,40 L40,75" stroke="#c5a059" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>

            {/* Glowing Spore Dots */}
            <circle cx="140" cy="120" r="4" fill="#d4af37" opacity="0.6" className="spore-dot" />
            <circle cx="165" cy="180" r="3" fill="#267a3f" opacity="0.5" className="spore-dot" />
            <circle cx="115" cy="270" r="5" fill="#d4af37" opacity="0.5" className="spore-dot" />
            <circle cx="130" cy="380" r="3.5" fill="#267a3f" opacity="0.6" className="spore-dot" />
            <circle cx="150" cy="490" r="4" fill="#d4af37" opacity="0.55" className="spore-dot" />
            <circle cx="110" cy="610" r="3" fill="#267a3f" opacity="0.45" className="spore-dot" />

            {/* Leaves */}
            <path d="M110,100 C135,70 160,60 185,80 C170,115 135,120 110,100 Z" fill="url(#emeraldGradientLeft)" stroke="#1b2e23" strokeWidth="0.8" />
            <path d="M100,230 C125,200 155,195 175,215 C160,245 125,250 100,230 Z" fill="url(#goldGradientLeft)" stroke="#c5a059" strokeWidth="0.8" />
            <path d="M95,430 C120,400 150,395 170,415 C155,445 120,450 95,430 Z" fill="url(#emeraldGradientLeft)" stroke="#267a3f" strokeWidth="0.8" />
          </svg>
        </div>

        {/* Right Side Organic Botanical & Mushroom Cap Art */}
        <div className="global-nature-decor right-decor">
          <svg width="100%" height="100%" viewBox="0 0 320 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="goldGradientRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#c5a059" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="emeraldGradientRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#267a3f" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#1b2e23" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Vine stem */}
            <path d="M340,780 C260,600 180,450 210,100 M210,100 C220,50 260,10 310,-20" stroke="url(#goldGradientRight)" strokeWidth="2.5" strokeLinecap="round" />

            {/* Mushroom Caps */}
            <g transform="translate(160, 160) rotate(15) scale(0.9)">
              <path d="M0,40 Q30,-20 60,40 Z" fill="url(#goldGradientRight)" stroke="#c5a059" strokeWidth="1" />
              <path d="M25,40 L25,70 M35,40 L35,70" stroke="#c5a059" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
            <g transform="translate(200, 360) rotate(-10) scale(0.75)">
              <path d="M0,40 Q30,-20 60,40 Z" fill="url(#emeraldGradientRight)" stroke="#267a3f" strokeWidth="1" />
              <path d="M25,40 L25,65 M35,40 L35,65" stroke="#267a3f" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
            <g transform="translate(170, 560) rotate(8) scale(0.85)">
              <path d="M0,40 Q35,-25 70,40 Z" fill="url(#goldGradientRight)" stroke="#c5a059" strokeWidth="1" />
              <path d="M30,40 L30,75 M40,40 L40,75" stroke="#c5a059" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>

            {/* Glowing Spore Dots */}
            <circle cx="170" cy="130" r="4" fill="#d4af37" opacity="0.6" className="spore-dot" />
            <circle cx="145" cy="200" r="3" fill="#267a3f" opacity="0.5" className="spore-dot" />
            <circle cx="190" cy="290" r="5" fill="#d4af37" opacity="0.5" className="spore-dot" />
            <circle cx="165" cy="410" r="3.5" fill="#267a3f" opacity="0.6" className="spore-dot" />
            <circle cx="140" cy="510" r="4" fill="#d4af37" opacity="0.55" className="spore-dot" />
            <circle cx="180" cy="630" r="3" fill="#267a3f" opacity="0.45" className="spore-dot" />

            {/* Leaves */}
            <path d="M210,100 C185,70 160,60 135,80 C150,115 185,120 210,100 Z" fill="url(#emeraldGradientRight)" stroke="#1b2e23" strokeWidth="0.8" />
            <path d="M220,240 C195,210 165,205 145,225 C160,255 195,260 220,240 Z" fill="url(#goldGradientRight)" stroke="#c5a059" strokeWidth="0.8" />
            <path d="M225,450 C200,420 170,415 150,435 C165,465 200,470 225,450 Z" fill="url(#emeraldGradientRight)" stroke="#267a3f" strokeWidth="0.8" />
          </svg>
        </div>
      </div>

      <main>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/shop" component={ProductsPage} />
          <Route path="/product/:id" component={ProductDetails} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/our-story" component={OurStory} />
          <Route path="/mushroom-guide" component={MushroomGuide} />
          <Route path="/health-benefits" component={HealthBenefits} />
          <Route path="/recipes/:id" component={RecipeDetail} />
          <Route path="/recipes" component={Recipes} />
          <Route path="/wholesale" component={Wholesale} />
          <Route path="/blog/:slug" component={BlogArticle} />
          <Route path="/blog" component={Blog} />
          <Route path="/contact" component={Contact} />
          <Route path="/signin" component={SignInPage} />
          <Route path="/signup" component={SignUpPage} />
          <PrivateRoute path="/orders" component={Orders} />
          <PrivateRoute path="/wishlist" component={Wishlist} />
          <PrivateRoute path="/profile" component={Profile} />
          <Route path="/privacy-policy" render={() => <Policies type="privacy" />} />
          <Route path="/refund-policy" render={() => <Policies type="refund" />} />
          <Route path="/shipping-policy" render={() => <Policies type="shipping" />} />
          <Route path="/terms" render={() => <Policies type="terms" />} />
          <Route component={BadRequest} />
        </Switch>
      </main>
      <SignIn />
      <Footer />
    </div>
    </GlobalLoader>
  );
};

export default App;
