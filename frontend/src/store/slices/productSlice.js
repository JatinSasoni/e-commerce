import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axios";

// Get all products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await API.get("/products", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get single product
export const fetchProductById = createAsyncThunk(
  "products/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    pagination: {},
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default productSlice.reducer;
