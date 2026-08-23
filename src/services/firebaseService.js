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
  const cartRef = doc(db, "carts", userId);
  await deleteDoc(cartRef);
};

/**
 * Save or update user profile in Firestore
 */
export const syncUserProfile = async (user, additionalData = {}) => {
  if (!user) return null;
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  const userData = {
    uid: user.uid,
    email: user.email || null,
    displayName: user.displayName || additionalData.displayName || "User",
    phoneNumber: user.phoneNumber || additionalData.phoneNumber || null,
    photoURL: user.photoURL || null,
    providerId: user.providerData?.[0]?.providerId || "custom",
    lastLoginAt: serverTimestamp(),
    ...additionalData
  };

  if (!snap.exists()) {
    userData.createdAt = serverTimestamp();
    await setDoc(userRef, userData);
  } else {
    await updateDoc(userRef, userData);
  }

  return userData;
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * Fetch all products from Firestore
 */
export const getProductsFromFirestore = async () => {
  const productsCol = collection(db, "products");
  const snap = await getDocs(productsCol);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Save an order to Firestore
 */
export const saveOrderToFirestore = async (userId, orderData) => {
  const ordersCol = collection(db, "orders");
  const docRef = await addDoc(ordersCol, {
    userId,
    ...orderData,
    createdAt: serverTimestamp(),
    status: orderData.status || "Pending"
  });
  return docRef.id;
};

/**
 * Fetch user orders from Firestore
 */
export const getUserOrders = async (userId) => {
  if (!userId) return [];
  const ordersCol = collection(db, "orders");
  const q = query(ordersCol, where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Save or update user cart in Firestore
 */
export const saveUserCart = async (userId, cartItems) => {
  if (!userId) return;
  const cartRef = doc(db, "carts", userId);
  await setDoc(cartRef, {
    items: cartItems,
    updatedAt: serverTimestamp()
  });
};

/**
 * Fetch user cart from Firestore
 */
export const getUserCart = async (userId) => {
  if (!userId) return [];
  const cartRef = doc(db, "carts", userId);
  const snap = await getDoc(cartRef);
  return snap.exists() ? snap.data().items || [] : [];
};
