import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from './expensesReducer';

const store = configureStore({
  reducer: {
    expenses: expensesReducer,
  },
});

export default store;
