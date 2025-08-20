import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axios";
import { logout } from "./authSlice"; // 👈 import logout action

// ---------- Async Thunks ----------
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/cart");
      return res.data; // cart doc with items + totalAmount
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await API.post("/cart/add", { productId, quantity });
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await API.put("/cart/update", { productId, quantity });
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await API.delete(`/cart/remove/${productId}`);
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.delete("/cart/clear");
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------- Slice ----------
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], totalAmount: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchCart.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.items || [];
        s.totalAmount = a.payload.totalAmount || 0;
      })
      .addCase(fetchCart.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // Cart Updates
      .addCase(addToCart.fulfilled, (s, a) => {
        s.items = a.payload.items || [];
        s.totalAmount = a.payload.totalAmount || 0;
      })
      .addCase(updateCartItem.fulfilled, (s, a) => {
        s.items = a.payload.items || [];
        s.totalAmount = a.payload.totalAmount || 0;
      })
      .addCase(removeFromCart.fulfilled, (s, a) => {
        s.items = a.payload.items || [];
        s.totalAmount = a.payload.totalAmount || 0;
      })
      .addCase(clearCart.fulfilled, (s, a) => {
        s.items = a.payload.items || [];
        s.totalAmount = a.payload.totalAmount || 0;
      })

      // 🔑 Reset Cart on Logout
      .addCase(logout, (s) => {
        s.items = [];
        s.totalAmount = 0;
        s.loading = false;
        s.error = null;
      });
  },
});

export default cartSlice.reducer;
