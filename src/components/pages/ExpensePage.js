import React, { useState } from "react";
import Header from "../header/Header";

const ExpensePage = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExpense = { amount, description, category };
    setExpenses([...expenses, newExpense]);
    setAmount('');
    setDescription('');
    setCategory('');
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            {expenses.map((expense, index) => (
              <li key={index} className="flex justify-between items-center py-2">
                <div>
                  <p className="text-lg font-semibold">{expense.category}</p>
                  <p className="text-sm italic">{expense.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">₹ {expense.amount}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-md shadow-md max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
              <form onSubmit={handleAddExpense} className="space-y-6">
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
                    Add Expense
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
