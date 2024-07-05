// ExpensePage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setExpenses, addExpense, updateExpense, deleteExpense, setError, setStatus } from '../../Store/expensesReducer';
import Header from '../header/Header';
import { toggleTheme } from '../../Store/themeReducer';
import './ExpensePage.css';

const ExpensePage = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const theme = useSelector(state => state.theme);

  const dispatch = useDispatch();
  const expenses = useSelector(state => state.expenses.expenses);
  const total = useSelector(state => state.expenses.total);

  const fetchExpenses = async () => {
    dispatch(setStatus('loading'));
    try {
      const response = await fetch('https://authentication-8546d-default-rtdb.firebaseio.com/expenses.json');
      if (!response.ok) {
        throw new Error('Failed to fetch expenses.');
      }
      const data = await response.json();
      console.log('Fetched data:', data); // Log fetched data
      const loadedExpenses = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      console.log('Loaded expenses:', loadedExpenses); // Log transformed data
      dispatch(setExpenses(loadedExpenses));
      dispatch(setStatus('succeeded'));
    } catch (error) {
      console.error('Error fetching expenses:', error); // Log any errors
      dispatch(setError(error.message));
      dispatch(setStatus('failed'));
    }
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    try {
      const newExpense = { amount, description, category };
      let response;

      if (editingExpense) {
        response = await fetch(`https://authentication-8546d-default-rtdb.firebaseio.com/expenses/${editingExpense.id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExpense),
        });
        if (!response.ok) throw new Error('Failed to update expense.');
        dispatch(updateExpense({ id: editingExpense.id, ...newExpense }));
      } else {
        response = await fetch('https://authentication-8546d-default-rtdb.firebaseio.com/expenses.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExpense),
        });
        if (!response.ok) throw new Error('Failed to add expense.');
        const data = await response.json();
        dispatch(addExpense({ id: data.name, ...newExpense }));
      }
      setIsModalOpen(false);
      setAmount('');
      setDescription('');
      setCategory('');
      setEditingExpense(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await fetch(`https://authentication-8546d-default-rtdb.firebaseio.com/expenses/${expenseId}.json`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete expense.');
      dispatch(deleteExpense(expenseId));
      alert('Expense successfully deleted');
    } catch (error) {
      alert(error.message);
    }
  };

  const openEditModal = (expense) => {
    setIsModalOpen(true);
    setAmount(expense.amount);
    setDescription(expense.description);
    setCategory(expense.category);
    setEditingExpense(expense);
  };

  const handleDownloadCSV = () => {
    const csvRows = [
      ['ID', 'Amount', 'Description', 'Category'],
      ...expenses.map(exp => [exp.id, exp.amount, exp.description, exp.category])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setAmount('');
    setDescription('');
    setCategory('');
    setEditingExpense(null);
  };

  return (
    <div className={`flex flex-col min-h-screen ${theme}`}>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md" onClick={openModal}>
            Add new expense
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md" onClick={() => dispatch(toggleTheme())}>
            Toggle Theme
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md" onClick={handleDownloadCSV}>
            Download CSV
          </button>
        </div>
        <div className="bg-white p-8 rounded-md shadow-md">
          <h2 className="text-lg font-medium">Total Expense: ₹{total}</h2>
          <ul className="mt-4">
            {expenses && expenses.length > 0 ? (
              expenses.map((expense) => (
                <li key={expense.id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="text-lg font-semibold">{expense.category}</p>
                    <p className="text-sm italic">{expense.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">₹ {expense.amount}</p>
                  </div>
                  <div>
                    <button onClick={() => openEditModal(expense)}>
                      <img src="https://icons8.com/icon/64058/edit.png" alt="Edit" />
                    </button>
                    <button onClick={() => handleDeleteExpense(expense.id)}>
                      <img src="https://img.icons8.com/material-outlined/24/000000/trash.png" alt="Delete" />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No expenses found.</p>
            )}
          </ul>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-md shadow-md max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
              <form onSubmit={handleSaveExpense} className="space-y-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    id="description"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="category"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Food">Food</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Education">Education</option>
                    <option value="Loan">Loan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md">
                    {editingExpense ? 'Save Changes' : 'Add Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensePage;
