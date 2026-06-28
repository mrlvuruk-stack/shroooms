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
