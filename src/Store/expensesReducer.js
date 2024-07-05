import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  total: 0,
  status: 'idle',
  error: null,
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses(state, action) {
      state.expenses = action.payload;
      state.total = action.payload.reduce((acc, expense) => acc + Number(expense.amount), 0);
    },
    addExpense(state, action) {
      state.expenses.push(action.payload);
      state.total += Number(action.payload.amount);
    },
    updateExpense(state, action) {
      const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
      state.total -= Number(state.expenses[index].amount);
      state.expenses[index] = action.payload;
      state.total += Number(action.payload.amount);
    },
    deleteExpense(state, action) {
      const index = state.expenses.findIndex(expense => expense.id === action.payload);
      state.total -= Number(state.expenses[index].amount);
      state.expenses.splice(index, 1);
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const { setExpenses, addExpense, updateExpense, deleteExpense, setError, setStatus } = expensesSlice.actions;
export default expensesSlice.reducer;