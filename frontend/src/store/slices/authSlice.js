import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axios";
import { jwtDecode } from "jwt-decode";

//* ----- Helpers
let logoutTimer;

const setLogoutTimer = (dispatch, expiryTime) => {
  if (logoutTimer) clearTimeout(logoutTimer);

  const remaining = expiryTime - Date.now();
  if (remaining > 0) {
    logoutTimer = setTimeout(() => {
      dispatch(logout());
    }, remaining);
  }
};

//* ---------- Thunks

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/register", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const res = await API.post("/auth/verify-otp", data);
      const { token } = res.data;
      const decoded = jwtDecode(token);
      const expiry = decoded.exp * 1000;

      localStorage.setItem("token", token);

      // auto logout
      setLogoutTimer(dispatch, expiry);

      return { ...res.data, token, expiry };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const res = await API.post("/auth/login", data);
      const { token } = res.data;
      const decoded = jwtDecode(token);
      const expiry = decoded.exp * 1000;

      localStorage.setItem("token", token);

      setLogoutTimer(dispatch, expiry);

      return { ...res.data, token, expiry };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

// Profile
export const fetchProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/auth/profile");
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//* ---------- Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    expiry: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.expiry = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.expiry = action.payload.expiry;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.expiry = action.payload.expiry;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
