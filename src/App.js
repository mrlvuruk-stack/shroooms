import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
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
import Wholesale from "./pages/Wholesale/Wholesale";
import Blog from "./pages/Blog/Blog";
import Contact from "./pages/Contact/Contact";
import Admin from "./pages/Admin/Admin";
import SignInPage from "./pages/SignInPage/SignInPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import Profile from "./pages/Profile/Profile";

const App = () => {
  const location = useLocation();

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
    <div className="grid-container">
      {getHeader()}

      {/* Nature/Botanical Side Decorations */}
      <div className="global-nature-decor left-decor">
        <svg width="100%" height="100%" viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,580 C50,450 110,350 90,50" stroke="#5a4b31" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"/>
          <path d="M90,50 C80,20 60,-5 35,5 C40,35 65,45 90,50 Z" fill="#a28a5c" opacity="0.15" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M89,85 C68,62 45,52 22,68 C28,95 55,100 89,85 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M88,130 C62,108 34,108 17,130 C28,158 55,158 88,130 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M85,185 C56,162 28,173 11,200 C28,222 56,217 85,185 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M81,240 C50,222 22,238 5,266 C27,288 53,277 81,240 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M76,305 C44,288 16,310 0,343 C22,360 50,343 76,305 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          
          <path d="M90,65 C112,42 128,31 150,48 C139,75 117,80 90,65 Z" fill="#a28a5c" opacity="0.15" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M89,105 C118,88 140,82 162,105 C145,133 118,133 89,105 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M87,155 C121,144 145,144 167,172 C145,194 118,188 87,155 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M84,210 C120,199 150,205 172,236 C147,255 117,244 84,210 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M80,270 C119,264 152,270 174,303 C145,320 115,309 80,270 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M73,336 C112,330 145,341 167,377 C137,390 109,377 73,336 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
        </svg>
      </div>

      <div className="global-nature-decor right-decor">
        <svg width="100%" height="100%" viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M290,580 C250,450 190,350 210,50" stroke="#5a4b31" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"/>
          <path d="M210,50 C220,20 240,-5 265,5 C260,35 235,45 210,50 Z" fill="#a28a5c" opacity="0.15" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M211,85 C232,62 255,52 278,68 C272,95 245,100 211,85 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M212,130 C238,108 266,108 283,130 C272,158 245,158 212,130 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M215,185 C244,162 272,173 289,200 C272,222 244,217 215,185 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M219,240 C250,222 278,238 295,266 C273,288 247,277 219,240 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M224,305 C256,288 284,310 300,343 C278,360 250,343 224,305 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          
          <path d="M210,65 C188,42 172,31 150,48 C161,75 183,80 210,65 Z" fill="#a28a5c" opacity="0.15" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M211,105 C182,88 160,82 138,105 C155,133 182,133 211,105 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M213,155 C179,144 155,144 133,172 C155,194 182,188 213,155 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M216,210 C180,199 150,205 128,236 C153,255 183,244 216,210 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M220,270 C181,264 148,270 126,303 C155,320 185,309 220,270 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
          <path d="M227,336 C188,330 155,341 133,377 C163,390 191,377 227,336 Z" fill="#a28a5c" opacity="0.12" stroke="#5a4b31" strokeWidth="0.8"/>
        </svg>
      </div>

      <main>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/product/:id" component={ProductDetails} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/our-story" component={OurStory} />
          <Route path="/health-benefits" component={HealthBenefits} />
          <Route path="/recipes" component={Recipes} />
          <Route path="/wholesale" component={Wholesale} />
          <Route path="/blog" component={Blog} />
          <Route path="/contact" component={Contact} />
          <Route path="/signin" component={SignInPage} />
          <Route path="/signup" component={SignUpPage} />
          <PrivateRoute path="/orders" component={Orders} />
          <PrivateRoute path="/wishlist" component={Wishlist} />
          <PrivateRoute path="/profile" component={Profile} />
          <Route component={BadRequest} />
        </Switch>
      </main>
      <SignIn />
      <Footer />
    </div>
  );
};

export default App;
