import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 'ru-Ru',
};

export const langFilter = createSlice({
  name: 'langFilter',
  initialState,
  reducers: {
    filterRu(state) {
      state.value = 'ru-Ru';
    },
    filterEn(state) {
      state.value = 'en-Us';
    },
  },
});

export const { filterRu, filterEn } = langFilter.actions;

export default langFilter.reducer;
