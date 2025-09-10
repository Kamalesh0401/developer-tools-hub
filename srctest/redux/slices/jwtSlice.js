import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    input: '',
    decoded: null,
    error: null,
};

export const jwtSlice = createSlice({
    name: 'jwt',
    initialState,
    reducers: {
        setJWTInput: (state, action) => { state.input = action.payload; },
        setDecodedJWT: (state, action) => { state.decoded = action.payload.decoded; state.error = action.payload.error; },
        clearJWT: () => initialState,
    },
});

export const { setJWTInput, setDecodedJWT, clearJWT } = jwtSlice.actions;
export default jwtSlice.reducer;
