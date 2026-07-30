import axios from "axios";
import * as actionTypes from "../actionTypes/productsListTypes";

const FALLBACK_PRODUCTS = [
  {
    _id: "p1",
    name: "Lion's Mane Mushroom (Premium)",
    image: "/box_lions_mane.jpg",
    price: 499,
    unit: "150 Gm",
    description: "Premium gourmet Lion's Mane. Features a beautiful white, shaggy fluff texture with a mild seafood-like sweet flavor when cooked.",
    purchasing: false,
    quantity: 0,
    benefits: "Premium Harvest · Culinary Grade",
    badge: "New Arrival"
  },
  {
    _id: "p2",
    name: "King Oyster Mushroom (Premium)",
    image: "/box_king_oyster.jpg",
    price: 349,
    unit: "150 Gm",
    description: "Elegant King Oyster Mushrooms, grown for culinary perfection. Dense, meaty stems that slice into scallop-like rounds.",
    purchasing: false,
    quantity: 0,
    benefits: "Gourmet Culinary Excellence",
    badge: "Chef's Choice"
  },
  {
    _id: "p3",
    name: "Pink Oyster Mushroom (Exotic)",
    image: "/box_pink_oyster.jpg",
    price: 399,
    unit: "150 Gm",
    description: "Vibrant and exotic Pink Oyster Mushrooms. Highly decorative with a rich woodsy flavor.",
    purchasing: false,
    quantity: 0,
    benefits: "Rich Flavor · Premium Harvest",
    badge: "Rare Find"
  },
  {
    _id: "p4",
    name: "Blue Oyster Mushroom (Artisan)",
    image: "/box_blue_oyster.jpg",
    price: 399,
    unit: "150 Gm",
    description: "Artisan-grade Blue Oyster Mushrooms. Features beautiful steel-blue caps and dense clustering.",
    purchasing: false,
    quantity: 0,
    benefits: "Unique Taste · Artisan Quality",
    badge: "Best Seller"
  },
  {
    _id: "p5",
    name: "Golden Oyster Mushroom (Vibrant)",
    image: "/shrooom.jpg",
    price: 429,
    unit: "150 Gm",
    description: "Stunning yellow Golden Oyster Mushrooms. Offers a delicate aroma with nutty notes.",
    purchasing: false,
    quantity: 0,
    benefits: "Nutty Notes · Vibrant Color",
    badge: "Exotic Bloom"
  },
  {
    _id: "p6",
    name: "Reishi Mushroom (Traditional)",
    image: "/cultivar_reishi.jpg",
    price: 599,
    unit: "100 Gm",
    description: "Red Reishi Mushroom. Bitter, woody texture suitable for grinding into culinary tea preparations.",
    purchasing: false,
    quantity: 0,
    benefits: "Traditional Brew · Hand Picked",
    badge: "Woody Cultivar"
  },
  {
    _id: "p7",
    name: "Shiitake Mushroom (Premium)",
    image: "/cultivar_chaga.jpg",
    price: 299,
    unit: "150 Gm",
    description: "Premium Cultivated Shiitake Mushrooms. Rich in culinary value, carrying deep, smoky-umami profiles.",
    purchasing: false,
    quantity: 0,
    benefits: "Traditional Umami · Rich Broths",
    badge: "Chef's Choice"
  },
  {
    _id: "p8",
    name: "Maitake Mushroom (Hen of the Woods)",
    image: "/cultivar_maitake.jpg",
    price: 479,
    unit: "150 Gm",
    description: "Maitake is prized for its cluster formations resembling feathers. Rich earthy flavor.",
    purchasing: false,
    quantity: 0,
    benefits: "Deep Flavor · Crisp Edges",
    badge: "Premium Cultivated"
  }
];

const vegetablesList = () => async (dispatch, getState) => {
  dispatch({
    type: actionTypes.VEGETABLE_LIST_REQUEST,
  });
  try {
    let { data } = await axios.get("/api/products");
    if (!data || !Array.isArray(data) || data.length === 0) {
      data = FALLBACK_PRODUCTS;
    }

    if (localStorage.getItem("cartItems")) {
      const cartProducts = getState().cart?.cartData?.vegetablesCart || [];
      cartProducts.forEach((cartItem) => {
        const index = data.findIndex((x) => x._id === cartItem._id);
        if (index > -1) {
          data[index] = { ...data[index], quantity: cartItem.quantity, purchasing: cartItem.purchasing };
        }
      });
    }

    dispatch({
      type: actionTypes.VEGETABLE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.warn("Product list fetch failed, using fallback:", error.message);
    dispatch({
      type: actionTypes.VEGETABLE_LIST_SUCCESS,
      payload: FALLBACK_PRODUCTS,
    });
  }
};

export const filteredProducts = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.VEGETABLE_FILTER_SEARCH,
    payload: value,
  });
};

export default vegetablesList;
