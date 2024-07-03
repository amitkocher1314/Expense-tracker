import React, { useState, useEffect } from 'react';
import Header from '../header/Header';


const ExpensePage = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Function to fetch expenses from Firebase Realtime Database
  const fetchExpenses = async () => {
    try {
      const response = await fetch('https://authentication-8546d-default-rtdb.firebaseio.com/expenses.json');

      if (!response.ok) {
        throw new Error('Failed to fetch expenses.');
      }

      const data = await response.json();
      if (data) {
        const loadedExpenses = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setExpenses(loadedExpenses);
      }
    } catch (error) {
      alert('Error fetching expenses:', error.message);
    }
  };

  // Function to handle adding or editing an expense in Firebase Realtime Database
  const handleSaveExpense = async (e) => {
    e.preventDefault();

    try {
      const newExpense = { amount, description, category };
      let response;

      if (editingExpense) {
        response = await fetch(`https://authentication-8546d-default-rtdb.firebaseio.com/expenses/${editingExpense.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newExpense),
        });
      } else {
        response = await fetch('https://authentication-8546d-default-rtdb.firebaseio.com/expenses.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newExpense),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save expense.');
      }

      const data = await response.json();
      if (editingExpense) {
        setExpenses(expenses.map(expense => (expense.id === editingExpense.id ? { id: editingExpense.id, ...newExpense } : expense)));
      } else {
        setExpenses([...expenses, { id: data.name, ...newExpense }]);
      }

      // Close modal and reset form fields
      setIsModalOpen(false);
      setAmount('');
      setDescription('');
      setCategory('');
      setEditingExpense(null);
    } catch (error) {
      alert('Error saving expense:', error.message);
    }
  };

  // Function to handle deleting an expense from Firebase Realtime Database
  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await fetch(`https://authentication-8546d-default-rtdb.firebaseio.com/expenses/${expenseId}.json`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense.');
      }

      setExpenses(expenses.filter(expense => expense.id !== expenseId));
      alert('Expense successfully deleted');
    } catch (error) {
      alert('Error deleting expense:', error.message);
    }
  };

  // Function to open modal for editing an expense
  const openEditModal = (expense) => {
    setIsModalOpen(true);
    setAmount(expense.amount);
    setDescription(expense.description);
    setCategory(expense.category);
    setEditingExpense(expense);
  };

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []); // Empty dependency array ensures fetch happens once on mount

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAmount('');
    setDescription('');
    setCategory('');
    setEditingExpense(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            onClick={openModal}
          >
            Add new expense
          </button>
        </div>
        <div className="bg-white p-8 rounded-md shadow-md">
          <h2 className="text-lg font-medium">Total Expense: {expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0)}</h2>
          <ul className="mt-4">
            {expenses.map((expense) => (
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
            ))}
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
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md"
                  >
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
