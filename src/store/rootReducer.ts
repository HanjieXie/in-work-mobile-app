// src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '@/api/baseApi';
import authReducer from '@features/auth/authSlice';

const rootReducer = combineReducers({
  // RTK Query
  [baseApi.reducerPath]: baseApi.reducer,

  // Feature slices
  auth: authReducer,
});

export default rootReducer;
