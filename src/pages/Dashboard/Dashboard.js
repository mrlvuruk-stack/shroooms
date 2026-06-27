import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import vegetablesList from "../../store/actions/actionCreators/productsListAction";
import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const vegetablesData = useSelector((state) => state.products);
  const { vegetables } = vegetablesData;

  // --- ALL STATE HOKS CONSOLIDATED AT THE TOP ---
  
  // Active Main Tab
  const [activeTab, setActiveTab] = useState("batches");
  // Active Admin Sub-tab
  const [adminSubTab, setAdminSubTab] = useState("products");



  // Telemetry sensor simulated state
  const [sensors, setSensors] = useState({
    temp1: 16.4,
    humidity1: 92.5,
    co21: 650,
    temp2: 18.2,
    humidity2: 89.8,
    co22: 710,
    tempInc: 22.8,
    humidityInc: 84.6,
    co2Inc: 920,
  });

  // Product CRUD Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    unit: "150 Gm",
    image: "",
    benefits: "",
    badge: "100% Organic",
    description: "",
  });

  // Mushroom Types / Categories CRUD State
  const [mushroomTypes, setMushroomTypes] = useState([
    { id: "T001", name: "Lion's Mane", scientificName: "Hericium erinaceus", tempRange: "16–19°C", humidity: "85–95%", difficulty: "Medium", flavorProfile: "Seafood-like, mild, tender", color: "#f5e6c8", icon: "🦁", visible: true, daysToFruit: "14–21" },
    { id: "T002", name: "Blue Oyster", scientificName: "Pleurotus ostreatus", tempRange: "10–16°C", humidity: "90–95%", difficulty: "Easy", flavorProfile: "Mild, earthy, savory", color: "#c8d8e8", icon: "🫐", visible: true, daysToFruit: "7–14" },
    { id: "T003", name: "Pink Oyster", scientificName: "Pleurotus djamor", tempRange: "18–30°C", humidity: "85–95%", difficulty: "Easy", flavorProfile: "Meaty, bacon-like when cooked", color: "#f5c8d4", icon: "🌸", visible: true, daysToFruit: "5–10" },
    { id: "T004", name: "King Oyster", scientificName: "Pleurotus eryngii", tempRange: "15–18°C", humidity: "85–90%", difficulty: "Hard", flavorProfile: "Umami-rich, firm, nutty", color: "#e8dcc8", icon: "👑", visible: true, daysToFruit: "20–30" },
    { id: "T005", name: "Shiitake", scientificName: "Lentinula edodes", tempRange: "10–18°C", humidity: "80–90%", difficulty: "Hard", flavorProfile: "Smoky, woodsy, deep umami", color: "#d4c4a8", icon: "🍄", visible: false, daysToFruit: "30–60" },
  ]);
  const [isTypeFormOpen, setIsTypeFormOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [typeFormData, setTypeFormData] = useState({
    name: "",
    scientificName: "",
    tempRange: "",
    humidity: "",
    difficulty: "Easy",
    flavorProfile: "",
    color: "#e8f5e9",
    icon: "🍄",
    daysToFruit: "",
    visible: true,
  });

  // Retrieve checkout orders from local storage
  const [customerOrders, setCustomerOrders] = useState([]);

  // --- ALL EFFECT HOKS GROUPED TOGETHER ---

  // Fetch products on mount
  useEffect(() => {
    dispatch(vegetablesList());
  }, [dispatch]);

  // Simulate real-time fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setSensors((prev) => ({
        ...prev,
        temp1: parseFloat((prev.temp1 + (Math.random() - 0.5) * 0.1).toFixed(1)),
        humidity1: parseFloat((prev.humidity1 + (Math.random() - 0.5) * 0.2).toFixed(1)),
        co21: Math.round(prev.co21 + (Math.random() - 0.5) * 6),
        temp2: parseFloat((prev.temp2 + (Math.random() - 0.5) * 0.1).toFixed(1)),
        humidity2: parseFloat((prev.humidity2 + (Math.random() - 0.5) * 0.2).toFixed(1)),
        co22: Math.round(prev.co22 + (Math.random() - 0.5) * 8),
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Sync orders from local storage
  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
    setCustomerOrders(orders);
  }, [activeTab, adminSubTab]);

  // Alert threshold logic
  const isChamber1Warning = sensors.temp1 > 18.5 || sensors.humidity1 < 88 || sensors.co21 > 850;
  const isChamber2Warning = sensors.temp2 > 19.5 || sensors.humidity2 < 83 || sensors.co22 > 950;
  const isIncubatorWarning = sensors.tempInc > 24.5 || sensors.humidityInc < 78 || sensors.co2Inc > 1100 || sensors.co2Inc < 700;

  const hasWarnings = isChamber1Warning || isChamber2Warning || isIncubatorWarning;

  const systemStatusText = hasWarnings ? "ALERT" : "NOMINAL";
  const systemStatusColor = hasWarnings ? "red" : "green";
  const systemStatusDesc = hasWarnings ? "Climate anomalies detected!" : "All nodes connected & reporting.";

  const batches = [
    { id: "B204", variety: "Lion's Mane", stage: "Fruiting", progress: 75, temp: "16.2°C", humidity: "92%", age: "18 days", harvest: "in 6 days" },
    { id: "B205", variety: "King Oyster", stage: "Pinning", progress: 55, temp: "16.5°C", humidity: "90%", age: "12 days", harvest: "in 12 days" },
    { id: "B206", variety: "Pink Oyster", stage: "Colonization", progress: 35, temp: "22.5°C", humidity: "85%", age: "7 days", harvest: "in 18 days" },
    { id: "B207", variety: "Blue Oyster", stage: "Spawning", progress: 15, temp: "22.8°C", humidity: "84%", age: "3 days", harvest: "in 22 days" },
  ];



  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const orders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
    const updated = orders.map(ord => {
      if (ord._id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    });
    localStorage.setItem("mock_orders", JSON.stringify(updated));
    setCustomerOrders(updated);
  };

  // Mushroom Types CRUD
  const handleOpenAddType = () => {
    setEditingType(null);
    setTypeFormData({ name: "", scientificName: "", tempRange: "", humidity: "", difficulty: "Easy", flavorProfile: "", color: "#e8f5e9", icon: "🍄", daysToFruit: "", visible: true });
    setIsTypeFormOpen(true);
  };

  const handleOpenEditType = (type) => {
    setEditingType(type);
    setTypeFormData({ ...type });
    setIsTypeFormOpen(true);
  };

  const handleTypeFormChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setTypeFormData(prev => ({ ...prev, [name]: inputType === "checkbox" ? checked : value }));
  };

  const handleTypeFormSubmit = (e) => {
    e.preventDefault();
    if (!typeFormData.name) { alert("Please enter a type name."); return; }
    if (editingType) {
      setMushroomTypes(prev => prev.map(t => t.id === editingType.id ? { ...typeFormData, id: editingType.id } : t));
    } else {
      const newId = "T" + String(mushroomTypes.length + 1).padStart(3, "0");
      setMushroomTypes(prev => [...prev, { ...typeFormData, id: newId }]);
    }
    setIsTypeFormOpen(false);
  };

  const handleDeleteType = (typeId) => {
    if (!window.confirm("Delete this mushroom type?")) return;
    setMushroomTypes(prev => prev.filter(t => t.id !== typeId));
  };

  const handleToggleTypeVisibility = (typeId) => {
    setMushroomTypes(prev => prev.map(t => t.id === typeId ? { ...t, visible: !t.visible } : t));
  };

  // Product CRUD form actions
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      unit: "150 Gm",
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80",
      benefits: "Immune Support · Focus",
      badge: "100% Organic",
      description: "",
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      price: prod.price,
      unit: prod.unit,
      image: prod.image,
      benefits: prod.benefits || "",
      badge: prod.badge || "100% Organic",
      description: prod.description || "",
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Please enter a name and price.");
      return;
    }
    
    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, {
          ...formData,
          price: Number(formData.price),
        });
      } else {
        await axios.post("/api/products", {
          ...formData,
          price: Number(formData.price),
        });
      }
      setIsFormOpen(false);
      dispatch(vegetablesList());
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${prodId}`);
      dispatch(vegetablesList());
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar / Menu */}
      <div className="db-sidebar">
        <div className="db-sidebar-brand">
          <i className="fa fa-leaf"></i>
          <div>
            <h3>SHROOOMS</h3>
            <span>GROWER PORTAL</span>
          </div>
        </div>
        <nav className="db-sidebar-nav">
          <button 
            className={`db-nav-btn ${activeTab === "batches" ? "active" : ""}`}
            onClick={() => setActiveTab("batches")}
          >
            <i className="fa fa-spinner"></i> Cultivation Batches
          </button>

          <button 
            className={`db-nav-btn ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            <i className="fa fa-sliders"></i> Admin Control Panel
          </button>
        </nav>

        <div className={`db-sidebar-status ${hasWarnings ? "warning" : ""}`}>
          <div className={`status-dot ${systemStatusColor}`}></div>
          <p>System State: <b>{systemStatusText}</b></p>
          <span>{systemStatusDesc}</span>
        </div>
      </div>

      {/* Main Panel Content */}
      <main className="db-content">
        <header className="db-header">
          <div>
            <h1>Grower & Business Operations</h1>
            <p>Monitor cultivation conditions, crop cycles, and subscriber orders.</p>
          </div>
          <div className="db-header-actions">
            <button className="db-btn-icon" onClick={() => window.location.reload()} title="Refresh Telemetry">
              <i className="fa fa-refresh"></i> Refresh
            </button>
            <span className="db-time">Last update: Just now</span>
          </div>
        </header>

        {/* TOP LEVEL METRIC CARDS */}
        <section className="db-metrics-grid">
          <div className="db-metric-card">
            <span className="metric-title">Monthly Sales</span>
            <div className="metric-val-row">
              <h3>₹1,42,500</h3>
              <span className="metric-badge green">+12.4%</span>
            </div>
            <p>From 248 online & subscription orders</p>
          </div>

          <div className="db-metric-card">
            <span className="metric-title">Active Batches</span>
            <div className="metric-val-row">
              <h3>{batches.length} Crops</h3>
              <span className="metric-badge gold">1 Pinning</span>
            </div>
            <p>Total yield estimate: 54.0 Kg</p>
          </div>
        </section>

        {/* TAB CONTENTS */}
        {activeTab === "batches" && (
          <section className="db-tab-content anim-fade">
            <h2>Current Cultivation Batches</h2>
            <div className="db-table-wrapper">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Batch ID</th>
                    <th>Variety</th>
                    <th>Stage</th>
                    <th>Cycle Progress</th>
                    <th>Target Env</th>
                    <th>Age</th>
                    <th>Harvest Forecast</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch) => (
                    <tr key={batch.id}>
                      <td><span className="badge-mono">{batch.id}</span></td>
                      <td><b>{batch.variety}</b></td>
                      <td>
                        <span className={`stage-pill ${batch.stage.toLowerCase()}`}>
                          {batch.stage}
                        </span>
                      </td>
                      <td>
                        <div className="progress-bar-container">
                          <div className="progress-bar" style={{ width: `${batch.progress}%` }}></div>
                          <span className="progress-text">{batch.progress}%</span>
                        </div>
                      </td>
                      <td>{batch.temp} / {batch.humidity}</td>
                      <td>{batch.age}</td>
                      <td><span className="harvest-date">{batch.harvest}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}





        {/* ADMIN CONTROL PANEL TAB */}
        {activeTab === "admin" && (
          <section className="db-tab-content anim-fade">
            <h2>Store & Cultivation Administration</h2>
            
            {/* Sub-tabs */}
            <div className="admin-subtabs">
              <button 
                className={`admin-subtab-btn ${adminSubTab === "products" ? "active" : ""}`}
                onClick={() => { setAdminSubTab("products"); setIsFormOpen(false); }}
              >
                Product Manager
              </button>
              <button 
                className={`admin-subtab-btn ${adminSubTab === "orders" ? "active" : ""}`}
                onClick={() => { setAdminSubTab("orders"); setIsFormOpen(false); }}
              >
                Customer Orders
              </button>
              <button 
                className={`admin-subtab-btn ${adminSubTab === "types" ? "active" : ""}`}
                onClick={() => { setAdminSubTab("types"); setIsFormOpen(false); setIsTypeFormOpen(false); }}
              >
                Mushroom Types
              </button>

            </div>

            {/* 1. PRODUCT MANAGER SUB-TAB */}
            {adminSubTab === "products" && (
              <div className="admin-products-manager">
                {/* Form to Add / Edit Product */}
                {isFormOpen && (
                  <form onSubmit={handleFormSubmit} className="admin-form">
                    <h3 className="form-title">{editingProduct ? "Edit Product" : "Add New Mushroom Product"}</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Product Name *</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleFormChange}
                          placeholder="e.g. Lion's Mane Mushroom (Organic)"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Price (INR) *</label>
                        <input 
                          type="number" 
                          name="price" 
                          value={formData.price} 
                          onChange={handleFormChange}
                          placeholder="e.g. 499"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Unit Weight *</label>
                        <input 
                          type="text" 
                          name="unit" 
                          value={formData.unit} 
                          onChange={handleFormChange}
                          placeholder="e.g. 150 Gm"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Image URL *</label>
                        <input 
                          type="text" 
                          name="image" 
                          value={formData.image} 
                          onChange={handleFormChange}
                          placeholder="e.g. https://images.unsplash.com/..."
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Key Benefits (Separated by middle dots)</label>
                        <input 
                          type="text" 
                          name="benefits" 
                          value={formData.benefits} 
                          onChange={handleFormChange}
                          placeholder="e.g. Focus · Memory · Wellness"
                        />
                      </div>
                      <div className="form-group">
                        <label>Store Badge</label>
                        <select name="badge" value={formData.badge} onChange={handleFormChange}>
                          <option value="100% Organic">100% Organic</option>
                          <option value="Best Seller">Best Seller</option>
                          <option value="Rare Find">Rare Find</option>
                          <option value="Superfood">Superfood</option>
                          <option value="Adaptogen">Adaptogen</option>
                          <option value="Chef's Choice">Chef's Choice</option>
                          <option value="Premium Cultivated">Premium Cultivated</option>
                        </select>
                      </div>
                      <div className="form-group full-width">
                        <label>Description</label>
                        <textarea 
                          name="description" 
                          value={formData.description} 
                          onChange={handleFormChange}
                          placeholder="Provide a detailed description of the mushroom..."
                          rows="4"
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="button" onClick={() => setIsFormOpen(false)} className="admin-btn admin-btn-secondary">
                        Cancel
                      </button>
                      <button type="submit" className="admin-btn admin-btn-primary">
                        {editingProduct ? "Update Product" : "Create Product"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Product List Actions bar */}
                {!isFormOpen && (
                  <div className="admin-actions-bar">
                    <h3>Current Store Catalog ({vegetables ? vegetables.length : 0} items)</h3>
                    <button onClick={handleOpenAddForm} className="admin-btn admin-btn-primary">
                      <i className="fa fa-plus"></i> Add New Product
                    </button>
                  </div>
                )}

                {/* Products Table */}
                {!isFormOpen && (
                  <div className="db-table-wrapper">
                    <table className="db-table">
                      <thead>
                        <tr>
                          <th>Thumbnail</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Unit</th>
                          <th>Benefits</th>
                          <th>Badge</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vegetables && vegetables.map((prod) => (
                          <tr key={prod._id}>
                            <td>
                              <img src={prod.image} alt={prod.name} className="table-thumbnail" />
                            </td>
                            <td><b>{prod.name}</b></td>
                            <td>₹{prod.price}</td>
                            <td>{prod.unit}</td>
                            <td><span style={{ fontSize: "1.2rem", color: "var(--frugivore-gray)" }}>{prod.benefits || "—"}</span></td>
                            <td>
                              {prod.badge && (
                                <span className={`stage-pill pinning`} style={{ fontSize: "1rem" }}>
                                  {prod.badge}
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="btn-actions">
                                <button onClick={() => handleOpenEditForm(prod)} className="btn-edit">
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteProduct(prod._id)} className="btn-delete">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 2. ORDER MANAGER SUB-TAB */}
            {adminSubTab === "orders" && (
              <div className="admin-orders-manager">
                <h3>Customer Checkout Orders ({customerOrders.length} orders placed)</h3>
                <br />
                {customerOrders.length === 0 ? (
                  <p style={{ color: "var(--frugivore-gray)", fontStyle: "italic" }}>No checkout orders placed yet. Purchase products on the store home page to see them listed here.</p>
                ) : (
                  <div className="db-table-wrapper">
                    <table className="db-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer Details</th>
                          <th>Items Ordered</th>
                          <th>Total Amount</th>
                          <th>Order Date</th>
                          <th>Shipping Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerOrders.map((ord) => (
                          <tr key={ord._id}>
                            <td><span className="badge-mono">{ord._id.substr(0, 8)}...</span></td>
                            <td>
                              <b>{ord.customerDetails?.fullName || "Guest Customer"}</b>
                              <br />
                              <span style={{ fontSize: "1.15rem", color: "var(--frugivore-gray)" }}>
                                {ord.customerDetails?.address || "No address details"}
                              </span>
                            </td>
                            <td>
                              {ord.orderItems && ord.orderItems.map((item, idx) => (
                                <div key={idx} style={{ fontSize: "1.3rem" }}>
                                  • {item.name} (x{item.qty})
                                </div>
                              ))}
                            </td>
                            <td><b>₹{ord.totalPrice}</b></td>
                            <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                            <td>
                              <select 
                                value={ord.status || "Paid"} 
                                onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                                style={{
                                  padding: "0.4rem 0.8rem",
                                  borderRadius: "12px",
                                  border: "1px solid var(--frugivore-border)",
                                  fontFamily: "inherit",
                                  fontSize: "1.25rem",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                  backgroundColor: ord.status === "Delivered" ? "#dcfce7" : ord.status === "Shipped" ? "#dbeafe" : "#fef3c7",
                                  color: ord.status === "Delivered" ? "#166534" : ord.status === "Shipped" ? "#1e40af" : "#9a3412"
                                }}
                              >
                                <option value="Paid">Paid (Pending)</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 3. MUSHROOM TYPES SUB-TAB */}
            {adminSubTab === "types" && (
              <div className="admin-types-manager">
                {/* Type Add / Edit Form */}
                {isTypeFormOpen && (
                  <form onSubmit={handleTypeFormSubmit} className="admin-form">
                    <h3 className="form-title">{editingType ? "Edit Mushroom Type" : "Add New Mushroom Type"}</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Type Name *</label>
                        <input type="text" name="name" value={typeFormData.name} onChange={handleTypeFormChange} placeholder="e.g. Lion's Mane" required />
                      </div>
                      <div className="form-group">
                        <label>Scientific Name</label>
                        <input type="text" name="scientificName" value={typeFormData.scientificName} onChange={handleTypeFormChange} placeholder="e.g. Hericium erinaceus" />
                      </div>
                      <div className="form-group">
                        <label>Icon / Emoji</label>
                        <input type="text" name="icon" value={typeFormData.icon} onChange={handleTypeFormChange} placeholder="e.g. 🍄" />
                      </div>
                      <div className="form-group">
                        <label>Card Color</label>
                        <input type="color" name="color" value={typeFormData.color} onChange={handleTypeFormChange} style={{ height: "4.5rem", padding: "0.4rem", cursor: "pointer" }} />
                      </div>
                      <div className="form-group">
                        <label>Temperature Range</label>
                        <input type="text" name="tempRange" value={typeFormData.tempRange} onChange={handleTypeFormChange} placeholder="e.g. 16–19°C" />
                      </div>
                      <div className="form-group">
                        <label>Humidity Range</label>
                        <input type="text" name="humidity" value={typeFormData.humidity} onChange={handleTypeFormChange} placeholder="e.g. 85–95%" />
                      </div>
                      <div className="form-group">
                        <label>Days to Fruit</label>
                        <input type="text" name="daysToFruit" value={typeFormData.daysToFruit} onChange={handleTypeFormChange} placeholder="e.g. 14–21" />
                      </div>
                      <div className="form-group">
                        <label>Cultivation Difficulty</label>
                        <select name="difficulty" value={typeFormData.difficulty} onChange={handleTypeFormChange}>
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      <div className="form-group full-width">
                        <label>Flavor Profile</label>
                        <input type="text" name="flavorProfile" value={typeFormData.flavorProfile} onChange={handleTypeFormChange} placeholder="e.g. Seafood-like, mild, tender" />
                      </div>
                      <div className="form-group">
                        <label style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <input type="checkbox" name="visible" checked={typeFormData.visible} onChange={handleTypeFormChange} style={{ width: "1.8rem", height: "1.8rem" }} />
                          Visible on Storefront
                        </label>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="button" onClick={() => setIsTypeFormOpen(false)} className="admin-btn admin-btn-secondary">Cancel</button>
                      <button type="submit" className="admin-btn admin-btn-primary">{editingType ? "Update Type" : "Add Type"}</button>
                    </div>
                  </form>
                )}

                {!isTypeFormOpen && (
                  <>
                    <div className="admin-actions-bar">
                      <h3>Mushroom Variety Catalog ({mushroomTypes.length} types)</h3>
                      <button onClick={handleOpenAddType} className="admin-btn admin-btn-primary">
                        <i className="fa fa-plus"></i> Add New Type
                      </button>
                    </div>

                    <div className="types-grid">
                      {mushroomTypes.map((type) => (
                        <div key={type.id} className={`type-card ${!type.visible ? "type-card-hidden" : ""}`} style={{ borderTopColor: type.color, background: `linear-gradient(135deg, ${type.color}33 0%, var(--frugivore-bg) 100%)` }}>
                          <div className="type-card-header">
                            <span className="type-emoji">{type.icon}</span>
                            <div className="type-id-badge">{type.id}</div>
                          </div>
                          <h4 className="type-name">{type.name}</h4>
                          {type.scientificName && <p className="type-scientific">{type.scientificName}</p>}
                          <div className="type-details">
                            <div className="type-detail-row">
                              <span className="type-detail-label">🌡 Temperature</span>
                              <span className="type-detail-val">{type.tempRange || "—"}</span>
                            </div>
                            <div className="type-detail-row">
                              <span className="type-detail-label">💧 Humidity</span>
                              <span className="type-detail-val">{type.humidity || "—"}</span>
                            </div>
                            <div className="type-detail-row">
                              <span className="type-detail-label">📅 Days to Fruit</span>
                              <span className="type-detail-val">{type.daysToFruit || "—"}</span>
                            </div>
                            <div className="type-detail-row">
                              <span className="type-detail-label">🍽 Flavor</span>
                              <span className="type-detail-val">{type.flavorProfile || "—"}</span>
                            </div>
                          </div>
                          <div className="type-footer">
                            <span className={`difficulty-badge difficulty-${type.difficulty?.toLowerCase()}`}>{type.difficulty}</span>
                            <span className={`visibility-badge ${type.visible ? "vis-on" : "vis-off"}`}>{type.visible ? "● Live" : "○ Hidden"}</span>
                          </div>
                          <div className="type-actions">
                            <button onClick={() => handleToggleTypeVisibility(type.id)} className="btn-toggle-vis">
                              {type.visible ? "Hide" : "Show"}
                            </button>
                            <button onClick={() => handleOpenEditType(type)} className="btn-edit">Edit</button>
                            <button onClick={() => handleDeleteType(type.id)} className="btn-delete">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}


          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
