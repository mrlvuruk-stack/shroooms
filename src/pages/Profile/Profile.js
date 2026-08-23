import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase";
import { getUserProfile, syncUserProfile, getUserOrders } from "../../services/firebaseService";
import * as actionTypes from "../../store/actions/actionTypes/signInTypes";
import "animate.css";
import "./Profile.css";

const PREDEFINED_AVATARS = [
  { id: "classic", icon: "🍄", name: "Classic Shrooom" },
  { id: "lions", icon: "🦁", name: "Lion's Mane" },
  { id: "blue", icon: "🫐", name: "Blue Oyster" },
  { id: "pink", icon: "🌸", name: "Pink Oyster" },
  { id: "king", icon: "👑", name: "King Oyster" }
];

const Profile = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo } = userSignIn;

  // Tabs: 'details' (Personal Info), 'orders' (Order History & Tracking)
  const [activeTab, setActiveTab] = useState("details");

  // Profile Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState("🍄");

  // Loading and Notification states
  const [profileLoading, setProfileLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Orders and Tracking states
  const [ordersList, setOrdersList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch full user profile details from Firebase Firestore on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userInfo) {
        history.push("/signin");
        return;
      }

      setProfileLoading(true);
      try {
        const uid = userInfo._id || auth.currentUser?.uid;
        const profile = await getUserProfile(uid);

        if (profile) {
          setName(profile.displayName || profile.name || userInfo.name || "");
          setPhone(profile.phoneNumber || profile.phone || userInfo.phone || "");
          setEmail(profile.email || userInfo.email || "");
          setAddress(profile.address || "");
          setPhoto(profile.photoURL || profile.photo || "🍄");
        } else {
          setName(userInfo.name || "");
          setPhone(userInfo.phone || "");
          setEmail(userInfo.email || "");
          setPhoto(userInfo.photoURL || "🍄");
        }
      } catch (err) {
        console.error("Failed to load user profile from Firestore:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [userInfo, history]);

  // Fetch user orders when orders tab is active
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (activeTab !== "orders" || !userInfo) return;

      setOrdersLoading(true);
      try {
        const uid = userInfo._id || auth.currentUser?.uid;
        const userOrders = await getUserOrders(uid);
        setOrdersList(userOrders);
        if (userOrders.length > 0) {
          setSelectedOrder(userOrders[0]);
        }
      } catch (err) {
        console.error("Failed to fetch user orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchUserOrders();
  }, [activeTab, userInfo]);

  // Handle saving the user profile details to Firestore
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSaveLoading(true);

    try {
      const emailValue = email.toLowerCase().trim();
      const phoneValue = phone.trim();

      const userObj = auth.currentUser || {
        uid: userInfo._id || "usr_" + Date.now(),
        email: emailValue,
        displayName: name,
        phoneNumber: phoneValue
      };

      // 1. Sync & Update profile in Firestore
      await syncUserProfile(userObj, {
        displayName: name,
        name: name,
        email: emailValue,
        phone: phoneValue,
        phoneNumber: phoneValue,
        address: address,
        photoURL: photo,
        photo: photo
      });

      // 2. Sync Redux state and local storage session
      const updatedUser = {
        ...userInfo,
        name,
        email: emailValue,
        phone: phoneValue,
        photoURL: photo,
        photo
      };

      dispatch({
        type: actionTypes.USER_SIGNIN_SUCCESS,
        payload: updatedUser
      });

      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setSuccessMsg("Profile details saved to Firebase successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save profile: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // Image upload base64 converter
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("File size should not exceed 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Stepper helper for order tracking progress
  const getTrackingSteps = (status) => {
    const lowerStatus = (status || "").toLowerCase();
    const steps = [
      { key: "placed", title: "Order Placed", desc: "We have received your order.", icon: "✅", done: true, active: false },
      { key: "processing", title: "Processing & Packing", desc: "Preparing fresh forest harvest.", icon: "📦", done: false, active: false },
      { key: "shipped", title: "Out for Delivery / Shipped", desc: "Harvest is on the way to you.", icon: "🚚", done: false, active: false },
      { key: "delivered", title: "Delivered", desc: "Enjoy your fresh gourmet shroooms!", icon: "🏠", done: false, active: false }
    ];

    if (lowerStatus === "processing" || lowerStatus === "packing") {
      steps[0].done = true;
      steps[1].done = true;
      steps[1].active = true;
    } else if (lowerStatus === "shipped" || lowerStatus === "out for delivery" || lowerStatus === "shipping") {
      steps[0].done = true;
      steps[1].done = true;
      steps[2].done = true;
      steps[2].active = true;
    } else if (lowerStatus === "delivered") {
      steps[0].done = true;
      steps[1].done = true;
      steps[2].done = true;
      steps[3].done = true;
    } else {
      steps[0].done = true;
      steps[0].active = true;
    }

    return steps;
  };

  if (profileLoading) {
    return (
      <div className="profile-loading-container">
        <div className="profile-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container-box">
        
        {/* Left Sidebar Layout */}
        <div className="profile-sidebar-panel">
          <div className="profile-user-summary">
            <div className="profile-avatar-wrapper">
              {photo && photo.startsWith("data:image") ? (
                <img src={photo} alt="Avatar" className="profile-image-custom" />
              ) : (
                <div className="profile-avatar-emoji">{photo || "🍄"}</div>
              )}
            </div>
            <h3 className="profile-summary-name">{name || "Forest Explorer"}</h3>
            <p className="profile-summary-email">{email}</p>
          </div>

          <div className="profile-nav-menu">
            <button 
              className={`profile-nav-item ${activeTab === "details" ? "active" : ""}`}
              onClick={() => { setActiveTab("details"); setError(""); setSuccessMsg(""); }}
            >
              <i className="fa fa-user-circle-o"></i> My Profile
            </button>
            <button 
              className={`profile-nav-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => { setActiveTab("orders"); setError(""); setSuccessMsg(""); }}
            >
              <i className="fa fa-shopping-bag"></i> Orders & Tracking
            </button>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="profile-details-panel animate__animated animate__fadeIn">
          
          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === "details" && (
            <div className="profile-tab-section">
              <h2 className="profile-section-title font-serif">Profile Details</h2>
              <p className="profile-section-desc">Manage your contact details and delivery preferences.</p>

              {error && <div className="profile-err-msg">{error}</div>}
              {successMsg && <div className="profile-success-msg">{successMsg}</div>}

              <form onSubmit={handleSaveProfile} className="profile-form-grid">
                
                {/* Avatar Chooser */}
                <div className="profile-form-full-row">
                  <label className="profile-form-label">CHOOSE AVATAR OR UPLOAD PHOTO</label>
                  <div className="profile-avatar-selection-row">
                    <div className="predefined-avatars-row">
                      {PREDEFINED_AVATARS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          className={`avatar-selection-btn ${photo === av.icon ? "selected" : ""}`}
                          onClick={() => setPhoto(av.icon)}
                          title={av.name}
                        >
                          {av.icon}
                        </button>
                      ))}
                    </div>
                    <div className="avatar-upload-divider">OR</div>
                    <label className="avatar-upload-label-btn">
                      <i className="fa fa-camera"></i> Upload Custom File
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                        style={{ display: "none" }} 
                      />
                    </label>
                  </div>
                </div>

                <div className="profile-input-group">
                  <label className="profile-form-label">FULL NAME</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(""); }}
                    placeholder="e.g. Sage Everly"
                    className="profile-box-input"
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label className="profile-form-label">EMAIL ADDRESS (PRIMARY)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@shrooom.in"
                    className="profile-box-input"
                  />
                </div>

                <div className="profile-input-group">
                  <label className="profile-form-label">PHONE NUMBER</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setError(""); }}
                    placeholder="e.g. +919826012345"
                    className="profile-box-input"
                  />
                </div>

                <div className="profile-form-full-row">
                  <label className="profile-form-label">DEFAULT DELIVERY ADDRESS</label>
                  <textarea
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); setError(""); }}
                    placeholder="Enter your house number, street address, city, state and pincode for shipping."
                    rows="4"
                    className="profile-box-textarea"
                  />
                </div>

                <button 
                  type="submit" 
                  className="profile-submit-btn font-serif"
                  disabled={saveLoading}
                >
                  {saveLoading ? "Saving Changes..." : "Save Profile Details"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ORDERS & TRACKING */}
          {activeTab === "orders" && (
            <div className="profile-tab-section">
              <h2 className="profile-section-title font-serif">Order History & Tracking</h2>
              <p className="profile-section-desc">View your purchase log and check live delivery status updates.</p>

              {ordersLoading ? (
                <div className="profile-orders-loader">
                  <div className="profile-spinner"></div>
                  <p>Fetching your orders...</p>
                </div>
              ) : ordersList.length === 0 ? (
                <div className="profile-empty-orders animate__animated animate__fadeIn">
                  <span className="profile-empty-icon">🛒</span>
                  <h3>No Orders Found</h3>
                  <p>You haven't placed any purchases yet. Head back to the store to order gourmet mushrooms!</p>
                  <button onClick={() => history.push("/")} className="shop-mushrooms-btn font-serif">Shop Fresh Mushrooms</button>
                </div>
              ) : (
                <div className="profile-orders-split-layout">
                  
                  {/* Left Column: Orders List */}
                  <div className="profile-orders-history-list">
                    <h3 className="orders-column-header">Purchases ({ordersList.length})</h3>
                    <div className="orders-cards-scroll-container">
                      {ordersList.map((ord) => (
                        <div 
                          key={ord.id || ord._id}
                          className={`order-summary-card ${selectedOrder?.id === ord.id || selectedOrder?._id === ord._id ? "selected" : ""}`}
                          onClick={() => setSelectedOrder(ord)}
                        >
                          <div className="order-card-header">
                            <span className="order-card-id">#{(ord.id || ord._id)?.substr(0, 8).toUpperCase()}</span>
                            <span className={`order-card-status-badge ${(ord.status || "Paid").toLowerCase().replace(/\s+/g, "-")}`}>
                              {ord.status || "Paid"}
                            </span>
                          </div>
                          <div className="order-card-details">
                            <div className="order-card-items-preview">
                              {ord.orderItems?.map((itm, idx) => (
                                <div key={idx} className="item-row">
                                  {itm.name} x{itm.qty}
                                </div>
                              ))}
                            </div>
                            <div className="order-card-footer">
                              <span className="order-card-date">{ord.createdAt ? new Date(ord.createdAt.seconds ? ord.createdAt.seconds * 1000 : ord.createdAt).toLocaleDateString("en-IN") : "Recent"}</span>
                              <span className="order-card-price">₹{ord.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Tracking Visual Stepper */}
                  <div className="profile-order-tracking-details">
                    <h3 className="orders-column-header">Live Tracking Status</h3>
                    {selectedOrder ? (
                      <div className="tracking-stepper-box animate__animated animate__fadeIn">
                        <div className="tracking-header-info">
                          <div>
                            <span className="info-label">ORDER ID:</span>
                            <span className="info-value">#{(selectedOrder.id || selectedOrder._id)?.toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="info-label">PAYMENT:</span>
                            <span className="info-value text-green">Paid</span>
                          </div>
                        </div>

                        {/* Stepper Steps */}
                        <div className="tracking-timeline-stepper">
                          {getTrackingSteps(selectedOrder.status).map((step, idx) => (
                            <div 
                              key={step.key} 
                              className={`stepper-step-item ${step.done ? "done" : ""} ${step.active ? "active" : ""}`}
                            >
                              <div className="step-badge-circle">
                                {step.done ? "✓" : step.icon}
                              </div>
                              {idx < 3 && <div className="step-connecting-line"></div>}
                              <div className="step-content-text">
                                <h4 className="step-title">{step.title}</h4>
                                <p className="step-desc">{step.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Address Box */}
                        <div className="tracking-delivery-address-box">
                          <h4 className="address-box-title"><i className="fa fa-map-marker"></i> Delivery Location</h4>
                          <p className="address-box-name">{selectedOrder.customerAddress?.userName || name}</p>
                          <p className="address-box-text">
                            {[
                              selectedOrder.customerAddress?.flatNumber,
                              selectedOrder.customerAddress?.streetName,
                              selectedOrder.customerAddress?.locality,
                              selectedOrder.customerAddress?.city,
                              selectedOrder.customerAddress?.state
                            ].filter(Boolean).join(", ") || address}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="tracking-select-placeholder">
                        <p>Select an order card to view live tracking details.</p>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
