// src/redux/slices/jsonSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  input: '',
  output: '',
  isValid: true,
  error: null,
  mode: 'format', // 'format' or 'minify'
  treeView: false,
};

export const jsonSlice = createSlice({
  name: 'json',
  initialState,
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
    },
    setOutput: (state, action) => {
      state.output = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isValid = !action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    toggleTreeView: (state) => {
      state.treeView = !state.treeView;
    },
    clearAll: (state) => {
      return initialState;
    },
  },
});

export const { setInput, setOutput, setError, setMode, toggleTreeView, clearAll } = jsonSlice.actions;
export default jsonSlice.reducer;
