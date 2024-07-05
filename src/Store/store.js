import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from './expensesReducer';
import themeReducer from './themeReducer';

const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    theme: themeReducer,
  },
});

export default store;
