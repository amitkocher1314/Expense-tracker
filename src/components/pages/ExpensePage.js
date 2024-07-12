import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setExpenses, addExpense, updateExpense, deleteExpense, setError, setStatus } from '../../Store/expensesReducer';
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

  const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

  const fetchExpenses = async () => {
    dispatch(setStatus('loading'));
    try {
      const response = await fetch(`https://authentication-8546d-default-rtdb.firebaseio.com/expenses/${userId}.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses.');
      }
      const data = await response.json();
      const loadedExpenses = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      dispatch(setExpenses(loadedExpenses));
      dispatch(setStatus('succeeded'));
    } catch (error) {
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
        response = await fetch(`https://authentication-8546d-default-rtdb.firebaseio.com/expenses/${userId}/${editingExpense.id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExpense),
        });
        if (!response.ok) throw new Error('Failed to update expense.');
        alert("Updated Successfully");
        dispatch(updateExpense({ id: editingExpense.id, ...newExpense }));
      } else {
        response = await fetch(`https://authentication-8546d-default-rtdb.firebaseio.com/expenses/${userId}.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExpense),
        });
        if (!response.ok) throw new Error('Failed to add expense.');
        const data = await response.json();
        dispatch(addExpense({ id: data.name, ...newExpense }));
        alert("Expense Added Successfully")
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
      const response = await fetch(`https://authentication-8546d-default-rtdb.firebaseio.com/expenses/${userId}/${expenseId}.json`, {
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

  useEffect(() => {
    if (total < 10000 && theme === 'dark') {
      dispatch(toggleTheme());
    }
  }, [total, theme, dispatch]);

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md" onClick={openModal}>
            Add new expense
          </button>
          {total > 10000 && (
            <>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-md" onClick={() => dispatch(toggleTheme())}>
                Toggle Theme
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md" onClick={handleDownloadCSV}>
                Download CSV
              </button>
            </>
          )}
        </div>
        <div className="bg-white p-8 rounded-md shadow-xl border-b-4">
  <h2 className="text-lg font-medium">Total Expense: ₹{total}</h2>
  <ul className="mt-4">
    {expenses && expenses.length > 0 ? (
      expenses.map((expense) => (
        <li key={expense.id} className="w-full flex justify-between items-center border-b-4 border-b-stone-500 p-2">
          <div className="w-24 flex flex-col">
            <span className="text-lg font-semibold">{expense.category}</span>
            <p className="text-sm italic">{expense.description}</p>
          </div>
          <span className="w-24 text-end">
            <p className="text-lg font-semibold">₹ {expense.amount}</p>
          </span>
          <span className="w-24 flex space-x-2 text-end">
            <button onClick={() => openEditModal(expense)}>
              <img src="https://img.icons8.com/ios-filled/50/000000/edit.png" alt="Edit" className="w-6 h-6"/>
            </button>
            <button onClick={() => handleDeleteExpense(expense.id)}>
              <img src="data:image/svg+xml;base64,PHN2ZyANCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiANCiAgdmlld0JveD0iMCAwIDQ0OCA1MTIiDQogIGZpbGw9J3JlZCcNCiAgd2lkdGg9IjE3Ig0KPg0KICA8cGF0aA0KICAgIGQ9Ik0xMzUuMiAxNy43TDEyOCAzMkgzMkMxNC4zIDMyIDAgNDYuMyAwIDY0UzE0LjMgOTYgMzIgOTZINDE2YzE3LjcgMCAzMi0xNC4zIDMyLTMycy0xNC4zLTMyLTMyLTMySDMyMGwtNy4yLTE0LjNDMzA3LjQgNi44IDI5Ni4zIDAgMjg0LjIgMEgxNjMuOGMtMTIuMSAwLTIzLjIgNi44LTI4LjYgMTcuN3pNNDE2IDEyOEgzMkw1My4yIDQ2N2MxLjYgMjUuMyAyMi42IDQ1IDQ3LjkgNDVIMzQ2LjljMjUuMyAwIDQ2LjMtMTkuNyA0Ny45LTQ1TDQxNiAxMjh6Ig0KICAvPg0KPC9zdmc+" alt="Delete" className="w-6 h-6"/>
            </button>
          </span>
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
