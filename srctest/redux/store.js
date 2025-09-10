// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import jsonSlice from './slices/jsonSlice';
import jwtSlice from './slices/jwtSlice';
import base64Slice from './slices/base64Slice';
import themeSlice from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    json: jsonSlice,
    jwt: jwtSlice,
    base64: base64Slice,
    theme: themeSlice,
  },
});
