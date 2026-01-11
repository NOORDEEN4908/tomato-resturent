import axios from "axios";
import { createContext, useEffect, useState } from "react";

import {
  getNutritionMatchScore,
  normalizeProductId,
  getSeasonFromDate,
  filterFoodForUser,
} from "../utils/personalization";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const url = "http://localhost:4000";

  // -----------------------------
  // CART FUNCTIONS
  // -----------------------------
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,[itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      await axios.post(
        url + "/api/cart/add",{ itemId },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,[itemId]: prev[itemId] - 1,
    }));

    if (token) {
      await axios.post(
        url + "/api/cart/remove",{ itemId },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const product =
          food_list.find((p) => p._id === item) ||
          food_list.find((p) => p.id === item);

        if (!product) continue;

        total += product.price * cartItems[item];
      }
    }
    return total;
  };

  // -----------------------------
  // API CALLS
  // -----------------------------
  const fetchFoodList = async () => {
    const res = await axios.get(url + "/api/food/list");
    setFoodList(res.data.data);
  };

  const loadCartData = async (authToken) => {
    try {
      const res = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token: authToken } }
      );

      if (res.data.success) setCartItems(res.data.cartData);
    } catch (e) {
      console.log(e);
    }
  };

  const loadUserProfile = async (authToken) => {
    try {
      const res = await axios.get(url + "/api/user/profile", {
        headers: { token: authToken },
      });

      if (res.data.success) {
        const profile = res.data.data;
        setUserProfile(profile);

        if (!profile.name || !profile.email || !profile.diet) {
          setShowProfileSetup(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateUserProfile = async (data) => {
    try {
      const res = await axios.put(url + "/api/user/profile", data, {
        headers: { token },
      });

      if (res.data.success) {
        setUserProfile(res.data.data);
        setShowProfileSetup(false);
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  // -----------------------------
  // EFFECTS
  // -----------------------------
  useEffect(() => {
    const load = async () => {
      await fetchFoodList();
      const localToken = localStorage.getItem("token");
      if (localToken) setToken(localToken);
    };
    load();
  }, []);

  useEffect(() => {
    if (!token) {
      setCartItems({});
      setUserProfile(null);
      setShowProfileSetup(false);
      return;
    }

    const fetchSecure = async () => {
      await Promise.all([loadCartData(token), loadUserProfile(token)]);
    };

    fetchSecure();
  }, [token]);

  // -----------------------------
  // PERSONALIZATION — OPTION 3
  // -----------------------------
  const getPastOrderBoost = (product) => {
    if (!userProfile?.pastOrders?.length) return 0;

    const productId = normalizeProductId(product);
    let count = 0;

    for (const entry of userProfile.pastOrders) {
      if (Array.isArray(entry) && entry.includes(productId)) count++;
      else if (entry?.products?.includes(productId)) count++;
      else if (entry === productId) count++;
    }

    return count * 10;
  };

  const calculateProductScore = (p) => {
    if (!p) return 0;

    // Score-based allergy blocking
    const nutritionScore = getNutritionMatchScore(p, userProfile);
    if (nutritionScore === -9999) return -9999;

    let score = 0;

    // Demand
    score += Math.min(p.timesOrdered || 0, 100);

    // Seasonality
    const currentSeason = getSeasonFromDate();
    if (p.season?.toLowerCase() === currentSeason) score += 30;

    // Nutrition / diet / dislikes
    score += nutritionScore;

    // Past orders
    score += getPastOrderBoost(p);

    return score;
  };

  const getPersonalizedFoodList = (category = "All") => {
    if (!food_list.length) return [];

    // Step 1 — HARD FILTER
    const filtered = filterFoodForUser(food_list, userProfile);

    // Step 2 — SCORE SORT
    return filtered
      .map((p) => ({ ...p, _score: calculateProductScore(p) }))
      .filter((p) => p._score !== -9999)
      .sort((a, b) => b._score - a._score)
      .filter((p) => (category === "All" ? true : p.category === category));
  };

  // -----------------------------
  // CONTEXT VALUE
  // -----------------------------
  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    url,
    userProfile,
    setUserProfile,
    getPersonalizedFoodList,
    updateUserProfile,
    loadUserProfile,
    showProfileSetup,
    setShowProfileSetup,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
