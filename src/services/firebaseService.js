import {
  db,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "../firebase";

/**
 * Clear user cart document from Firestore
 */
export const clearUserCart = async (userId) => {
  if (!userId) return;
  try {
    const cartRef = doc(db, "carts", userId);
    await deleteDoc(cartRef);
  } catch (err) {
    console.warn("clearUserCart skipped (Firestore error):", err.message);
  }
};

/**
 * Save or update user profile in Firestore
 */
export const syncUserProfile = async (user, additionalData = {}) => {
  if (!user) return null;
  const displayName = user.displayName || additionalData.displayName || (user.email ? user.email.split("@")[0] : "User");
  const baseUserData = {
    uid: user.uid,
    email: user.email || null,
    displayName: displayName,
    name: displayName,
    phoneNumber: user.phoneNumber || additionalData.phoneNumber || null,
    phone: user.phoneNumber || additionalData.phoneNumber || null,
    photoURL: user.photoURL || null,
    providerId: user.providerData?.[0]?.providerId || "custom",
    ...additionalData
  };

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    const userData = {
      ...baseUserData,
      lastLoginAt: serverTimestamp(),
    };

    if (!snap.exists()) {
      userData.createdAt = serverTimestamp();
      await setDoc(userRef, userData);
    } else {
      await updateDoc(userRef, userData);
    }

    return userData;
  } catch (err) {
    console.warn("syncUserProfile fallback to local user data (Firestore unavailable or permissions):", err.message);
    return baseUserData;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid) => {
  if (!uid) return null;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (err) {
    console.warn("getUserProfile fallback (Firestore):", err.message);
    return null;
  }
};

/**
 * Fetch all products from Firestore
 */
export const getProductsFromFirestore = async () => {
  try {
    const productsCol = collection(db, "products");
    const snap = await getDocs(productsCol);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn("getProductsFromFirestore fallback:", err.message);
    return [];
  }
};

/**
 * Save an order to Firestore
 */
export const saveOrderToFirestore = async (userId, orderData) => {
  try {
    const ordersCol = collection(db, "orders");
    const docRef = await addDoc(ordersCol, {
      userId,
      ...orderData,
      createdAt: serverTimestamp(),
      status: orderData.status || "Pending"
    });
    return docRef.id;
  } catch (err) {
    console.warn("saveOrderToFirestore fallback (generated local ID):", err.message);
    return "ord_local_" + Date.now();
  }
};

/**
 * Fetch user orders from Firestore
 */
export const getUserOrders = async (userId) => {
  if (!userId) return [];
  try {
    const ordersCol = collection(db, "orders");
    const q = query(ordersCol, where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn("getUserOrders fallback:", err.message);
    return [];
  }
};

/**
 * Save or update user cart in Firestore
 */
export const saveUserCart = async (userId, cartItems) => {
  if (!userId) return;
  try {
    const cartRef = doc(db, "carts", userId);
    await setDoc(cartRef, {
      items: cartItems,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn("saveUserCart fallback (local state preserved):", err.message);
  }
};

/**
 * Fetch user cart from Firestore
 */
export const getUserCart = async (userId) => {
  if (!userId) return [];
  try {
    const cartRef = doc(db, "carts", userId);
    const snap = await getDoc(cartRef);
    return snap.exists() ? snap.data().items || [] : [];
  } catch (err) {
    console.warn("getUserCart fallback:", err.message);
    return [];
  }
};
