import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    input: '',
    output: '',
};

export const base64Slice = createSlice({
    name: 'base64',
    initialState,
    reducers: {
        setInput: (state, action) => { state.input = action.payload; },
        setOutput: (state, action) => { state.output = action.payload; },
        clearAll: () => initialState,
    },
});

export const { setInput, setOutput, clearAll } = base64Slice.actions;
export default base64Slice.reducer;
