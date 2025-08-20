import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axios";

export const createOrder = createAsyncThunk(
  "orders/create",
  async (shippingAddress, { rejectWithValue }) => {
    try {
      const res = await API.post("/orders/create", { shippingAddress });
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/my",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/orders/my-orders");
      return res.data; // array
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/one",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/orders/${orderId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
    lastCreated: null,
  },
  reducers: {
    resetLastCreated(state) {
      state.lastCreated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createOrder.fulfilled, (s, a) => {
        s.loading = false;
        s.lastCreated = a.payload;
      })
      .addCase(createOrder.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(fetchMyOrders.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchMyOrders.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(fetchOrderById.fulfilled, (s, a) => {
        s.current = a.payload;
      });
  },
});

export const { resetLastCreated } = orderSlice.actions;
export default orderSlice.reducer;
