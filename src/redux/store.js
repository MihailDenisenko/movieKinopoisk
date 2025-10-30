import { configureStore } from '@reduxjs/toolkit';
import langFilter from './slices/langFilter';

export const store = configureStore({
  reducer: {
    langFilter,
  },
});
