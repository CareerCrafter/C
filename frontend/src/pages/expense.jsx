"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrashAlt,
  FaTag,
  FaRupeeSign,
  FaCalendarAlt,
  FaStickyNote,
  FaChartLine,
  FaSignOutAlt,
  FaHome,
  FaCog,
  FaGoogleDrive,
  FaExternalLinkAlt,
} from "react-icons/fa";
import "../App.css";

// Define your API Base URL here
const API_BASE_URL = "http://localhost:5050";
const FLASK_ANOMALY_URL = `http://localhost:5000/anomaly`;

// Google Drive configuration - REPLACE WITH YOUR ACTUAL FOLDER ID
const GOOGLE_DRIVE_CONFIG = {
  FOLDER_ID: "1ABC123DEF456GHI789JKL",
  FOLDER_URL:
    "https://drive.google.com/drive/folders/1O85f_L5042SDJMCEXpoI_h8v5IeuGU4g?usp=sharing",
};

// Helper function to get authorization header from localStorage
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };
};

// Edit Modal Component
const EditExpenseModal = ({ expense, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const expenseTypes = [
    "Rent",
    "Groceries",
    "Entertainment",
    "Utilities",
    "Transportation",
    "Miscellaneous",
  ];

  useEffect(() => {
    if (expense) {
      const dateForInput = expense.date
        ? new Date(expense.date.split("-").reverse().join("-"))
            .toISOString()
            .split("T")[0]
        : "";

      setFormData({
        category: expense.category || "",
        amount: expense.amount?.toString() || "",
        date: dateForInput,
        notes: expense.notes || "",
      });
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expense) return;

    setLoading(true);
    try {
      await onSave(expense.id, {
        category: formData.category,
        amount: Number.parseFloat(formData.amount),
        date: formData.date,
        notes: formData.notes,
      });
      onClose();
    } catch (error) {
      console.error(
        "Error updating expense:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !expense) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Expense</h2>
          <button
            className="modal-close-button"
            onClick={onClose}
            type="button"
          >
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="modal-form-group">
              <label className="modal-label">Expense Type</label>
              <div className="modal-input-container">
                <FaTag className="modal-input-icon" />
                <select
                  className="modal-select"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select expense type</option>
                  {expenseTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Amount (Rs.)</label>
              <div className="modal-input-container">
                <FaRupeeSign className="modal-input-icon" />
                <input
                  type="number"
                  className="modal-input"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Date</label>
              <div className="modal-input-container">
                <FaCalendarAlt className="modal-input-icon" />
                <input
                  type="date"
                  className="modal-input"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Notes (Optional)</label>
              <div className="modal-input-container">
                <FaStickyNote className="modal-input-icon" />
                <input
                  type="text"
                  className="modal-input"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Add notes"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-button modal-cancel-button"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="modal-button modal-save-button"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Expense = () => {
  const navigate = useNavigate();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");
  const [showDropdown, setShowDropdown] = useState(false);
  const [expenseType, setExpenseType] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getCurrentDate());
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );

  const expenseTypes = [
    "Rent",
    "Groceries",
    "Entertainment",
    "Utilities",
    "Transportation",
    "Miscellaneous",
  ];

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Check user authentication status
  const checkAuth = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsAuthenticated(false);
      setExpenses([]);
      return null;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/user/me`, {
        headers: getAuthHeaders(),
      });
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error(
        "Authentication check failed:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in to manage expenses.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("expenseData");
        setIsAuthenticated(false);
        setExpenses([]);
        navigate("/getStarted");
      }
      return null;
    }
  };

  const fetchAnalysis = async () => {
    if (!isAuthenticated) return;

    try {
      console.log(
        "Fetching analysis from:",
        `${API_BASE_URL}/expense/analysis`
      );
      const response = await axios.get(`${API_BASE_URL}/expense/analysis`, {
        headers: getAuthHeaders(),
      });
      console.log("Analysis data received:", response.data);
      setAnalysisData(response.data);
    } catch (error) {
      console.error(
        "Error fetching analysis:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch analysis data.");
    }
  };

  const fetchExpenses = async () => {
    if (!isAuthenticated) {
      setExpenses([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/expense/list`, {
        headers: getAuthHeaders(),
      });
      console.log("Expenses fetched from server:", response.data); // Debug log
      const formattedExpenses = response.data.map((exp) => ({
        ...exp,
        id: exp._id || exp.id,
        date: formatDate(exp.date),
        status: exp.status || "Normal", // Fallback for legacy data
      }));
      setExpenses(formattedExpenses);
      localStorage.setItem(
        `expenseData_${
          response.data.userId || response.data[0]?.user || "user"
        }`,
        JSON.stringify(formattedExpenses)
      );
      console.log("Expenses saved to localStorage:", formattedExpenses); // Debug log
      return formattedExpenses;
    } catch (error) {
      console.error(
        "Error fetching expenses:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in to view expenses.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("expenseData");
        setIsAuthenticated(false);
        setExpenses([]);
        navigate("/getStarted");
      } else {
        // Fallback to localStorage if API fails
        const savedExpenses = localStorage.getItem("expenseData");
        if (savedExpenses) {
          const parsedExpenses = JSON.parse(savedExpenses).map((exp) => ({
            ...exp,
            status: exp.status || "Normal", // Fallback for legacy data
          }));
          console.log("Expenses loaded from localStorage:", parsedExpenses); // Debug log
          setExpenses(parsedExpenses);
        }
        toast.error(
          error.response?.data?.message || "Failed to load expenses."
        );
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await checkAuth();
        await fetchExpenses();
        await fetchAnalysis();
      } catch (error) {
        console.error(
          "Error loading data:",
          error.response?.data || error.message
        );
      }
    };
    loadData();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expenseData");
    localStorage.removeItem("expenseAnalysis");
    toast.success("Logged out successfully.");
    setIsAuthenticated(false);
    setExpenses([]);
    setAnalysisData(null);
    navigate("/getStarted");
  };

  const toggleAddExpenseForm = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add expenses.");
      return;
    }
    setShowAddExpense(!showAddExpense);
    setShowDropdown(false);
    if (!showAddExpense) {
      setExpenseType("");
      setAmount("");
      setDate(getCurrentDate());
      setNotes("");
      setActiveTab("manual");
    }
  };

  const handleExpenseTypeClick = () => {
    setShowDropdown(!showDropdown);
  };

  const selectExpenseType = (type) => {
    setExpenseType(type);
    setShowDropdown(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return dateString;

      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) {
      return dateString;
    }
  };

  const handleAddExpense = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add expenses.");
      return;
    }

    if (!expenseType || !amount || !date) {
      setErrorMessage("Please fill all required fields!");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    try {
      const newExpenseData = {
        category: expenseType,
        amount: Number.parseFloat(amount),
        date: date,
        notes: notes || "",
      };

      const response = await axios.post(
        `${API_BASE_URL}/expense/add`,
        newExpenseData,
        { headers: getAuthHeaders() }
      );

      const expenseId = response.data.expense._id || response.data.expense.id;
      const newExpense = {
        id: expenseId,
        ...newExpenseData,
        date: formatDate(response.data.expense.date),
        status: response.data.expense.status,
        anomaly_score: response.data.expense.anomaly_score,
      };

      setExpenses([newExpense, ...expenses]);
      localStorage.setItem(
        `expenseData_${response.data.expense.user || "user"}`,
        JSON.stringify([newExpense, ...expenses])
      );
      await fetchAnalysis();

      toast.success(
        `Expense added${
          newExpense.status === "Anomaly" ? " (Anomaly detected!)" : ""
        }`
      );

      setExpenseType("");
      setAmount("");
      setDate(getCurrentDate());
      setNotes("");
      setShowAddExpense(false);
      setErrorMessage("");
      setShowError(false);
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in to add expenses.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("expenseData");
        setIsAuthenticated(false);
        navigate("/getStarted");
      } else {
        toast.error(error.response?.data?.message || "Failed to add expense.");
      }
    }
  };

  const handleUpdateExpense = async (id, expenseData) => {
    if (!isAuthenticated) {
      toast.error("Please log in to update expenses.");
      return;
    }

    try {
      const expense = expenses.find((exp) => exp.id === id || exp._id === id);
      if (!expense) {
        toast.error("Expense not found");
        return;
      }

      const updateId = expense._id || expense.id;
      const response = await axios.put(
        `${API_BASE_URL}/expense/update/${updateId}`,
        expenseData,
        { headers: getAuthHeaders() }
      );

      const updatedExpense = {
        ...expense,
        ...expenseData,
        date: formatDate(response.data.expense.date),
        status: response.data.expense.status,
        anomaly_score: response.data.expense.anomaly_score,
      };

      const updatedExpenses = expenses.map((exp) =>
        exp.id === id || exp._id === id ? updatedExpense : exp
      );

      setExpenses(updatedExpenses);
      localStorage.setItem(
        `expenseData_${response.data.expense.user || "user"}`,
        JSON.stringify(updatedExpenses)
      );
      await fetchAnalysis();

      toast.success(
        `Expense updated${
          response.data.expense.status === "Anomaly"
            ? " (Anomaly detected!)"
            : ""
        }`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error updating expense:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in to update expenses.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("expenseData");
        setIsAuthenticated(false);
        navigate("/getStarted");
      } else if (error.response?.status === 404) {
        toast.error("Expense not found.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update expense."
        );
      }
      throw error;
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!isAuthenticated) {
      toast.error("Please log in to delete expenses.");
      return;
    }

    try {
      const expense = expenses.find((exp) => exp.id === id || exp._id === id);
      if (!expense) {
        toast.error("Expense not found in local state");
        return;
      }

      const deleteId = expense._id || expense.id;
      await axios.delete(`${API_BASE_URL}/expense/delete/${deleteId}`, {
        headers: getAuthHeaders(),
      });

      const updatedExpenses = expenses.filter(
        (expense) => expense.id !== id && expense._id !== id
      );
      setExpenses(updatedExpenses);
      localStorage.setItem(
        `expenseData_${expense.user || "user"}`,
        JSON.stringify(updatedExpenses)
      );
      await fetchAnalysis();
      toast.success("Expense deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in to delete expenses.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("expenseData");
        setIsAuthenticated(false);
        navigate("/getStarted");
      } else if (
        error.response?.status === 404 ||
        error.response?.data?.message?.includes("Invalid")
      ) {
        const updatedExpenses = expenses.filter(
          (expense) => expense.id !== id && expense._id !== id
        );
        setExpenses(updatedExpenses);
        localStorage.setItem(
          `expenseData_${expense.user || "user"}`,
          JSON.stringify(updatedExpenses)
        );
        await fetchAnalysis();
        toast.success("Expense deleted successfully!");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to delete expense"
        );
      }
    }
  };

  const handleEditExpense = (expense) => {
    if (!isAuthenticated) {
      toast.error("Please log in to edit expenses.");
      return;
    }
    setEditingExpense(expense);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (id, data) => {
    await handleUpdateExpense(id, data);
    setShowEditModal(false);
    setEditingExpense(null);
  };

  const handleUploadReceipt = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to upload receipts.");
      return;
    }
    const driveUrl = GOOGLE_DRIVE_CONFIG.FOLDER_URL;
    console.log("Opening Google Drive URL:", driveUrl);
    const newWindow = window.open(driveUrl, "_blank", "noopener,noreferrer");
    if (
      !newWindow ||
      newWindow.closed ||
      typeof newWindow.closed === "undefined"
    ) {
      window.location.href = driveUrl;
    }
  };

  const handleViewCharts = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to view charts.");
      return;
    }
    navigate("/visualize");
  };

  return (
    <div className="expense-page">
      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/dashboard" className="logo">
            Expense Tracker
          </Link>
          <ul className="nav-links">
            <li className="nav-item">
              <Link to="/" className="nav-button">
                <FaHome size={18} />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/services" className="nav-button">
                <FaCog size={18} />
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard" className="nav-button">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <span className="active-nav-button">Expense</span>
            </li>
            <li className="nav-item">
              {isAuthenticated ? (
                <button className="logout-button" onClick={handleLogout}>
                  <FaSignOutAlt size={18} />
                  Logout
                </button>
              ) : (
                <Link to="/getStarted" className="nav-button">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {showError && (
        <div className="error-message">
          <div className="error-icon">✕</div>
          {errorMessage}
        </div>
      )}

      <div className="container main-content">
        <div className="card welcome-section">
          <p className="welcome-subtitle">
            Track and manage your expenses efficiently
          </p>
          <div className="center-button">
            <button className="btn btn-primary" onClick={toggleAddExpenseForm}>
              <FaPlus className="btn-icon" /> Add Expense
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">📋</span> Recent Expenses
            </h2>
          </div>
          <div className="table-container">
            <table className="expense-table">
              <thead>
                <tr>
                  <th className="table-header">Expense Type</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="table-cell"
                      style={{ textAlign: "center" }}
                    >
                      Loading...
                    </td>
                  </tr>
                ) : !isAuthenticated ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="table-cell"
                      style={{ textAlign: "center", color: "#a0a0a0" }}
                    >
                      Please <Link to="/getStarted">log in</Link> to view your
                      expenses.
                    </td>
                  </tr>
                ) : expenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="table-cell"
                      style={{ textAlign: "center", color: "#a0a0a0" }}
                    >
                      No expenses recorded yet.
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id || expense._id}>
                      <td className="table-cell">{expense.category}</td>
                      <td className="table-cell">Rs. {expense.amount}</td>
                      <td className="table-cell">{expense.date}</td>
                      <td className="table-cell">
                        <span
                          className={`badge ${
                            expense.status === "Normal"
                              ? "badge-normal"
                              : expense.status === "Anomaly"
                              ? "badge-anomaly"
                              : "badge-unknown"
                          }`}
                        >
                          {expense.status || "Unknown"}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="action-buttons">
                          <button
                            className="icon-button"
                            onClick={() => handleEditExpense(expense)}
                          >
                            <FaEdit className="icon-small" />
                          </button>
                          <button
                            className="icon-button btn-delete"
                            onClick={() =>
                              handleDeleteExpense(expense.id || expense._id)
                            }
                          >
                            <FaTrashAlt className="icon-small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showAddExpense && isAuthenticated && (
          <div className="card add-expense-form">
            <div className="card-header">
              <h2 className="card-title">
                <FaPlus className="card-icon" /> Add New Expense
              </h2>
              <button className="btn-close" onClick={toggleAddExpenseForm}>
                <FaTimes className="icon-small" />
              </button>
            </div>
            <div className="card-body">
              <div className="tabs">
                <div className="tab-list">
                  <button
                    className={`tab-button ${
                      activeTab === "manual" ? "active-tab" : ""
                    }`}
                    onClick={() => switchTab("manual")}
                  >
                    Manual Entry
                  </button>
                  <button
                    className={`tab-button ${
                      activeTab === "upload" ? "active-tab" : ""
                    }`}
                    onClick={() => switchTab("upload")}
                  >
                    Upload Receipt
                  </button>
                </div>
                {activeTab === "manual" && (
                  <div className="tab-content">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Expense Type</label>
                        <div className="dropdown-container">
                          <div
                            className="dropdown-trigger"
                            onClick={handleExpenseTypeClick}
                          >
                            <FaTag className="input-icon" />
                            <span className="dropdown-placeholder">
                              {expenseType || "Select expense type"}
                            </span>
                            <span className="dropdown-arrow">▼</span>
                          </div>
                          {showDropdown && (
                            <div className="dropdown-menu">
                              {expenseTypes.map((type) => (
                                <div
                                  key={type}
                                  className="dropdown-item"
                                  onClick={() => selectExpenseType(type)}
                                >
                                  {type}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Amount (Rs.)</label>
                        <div className="input-container">
                          <span className="input-icon">रु</span>
                          <input
                            type="number"
                            placeholder="Enter amount"
                            className="form-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date</label>
                        <div className="input-container">
                          <FaCalendarAlt className="input-icon" />
                          <input
                            type="date"
                            className="form-input"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Notes (Optional)</label>
                        <div className="input-container">
                          <FaStickyNote className="input-icon" />
                          <input
                            placeholder="Add notes"
                            className="form-input"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={toggleAddExpenseForm}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleAddExpense}
                      >
                        Add Expense
                      </button>
                    </div>
                  </div>
                )}
                {activeTab === "upload" && (
                  <div className="tab-content upload-content">
                    <h3 className="upload-title">
                      Upload Bills and Manage Expenses
                    </h3>
                    <a
                      href={GOOGLE_DRIVE_CONFIG.FOLDER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="upload-button"
                      onClick={handleUploadReceipt}
                    >
                      <FaGoogleDrive />
                      Open Google Drive Folder
                      <FaExternalLinkAlt size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <FaChartLine className="card-icon" /> Expense Visualization
            </h2>
          </div>
          <div className="card-body visualization-section">
            <p className="visualization-text">
              View detailed charts and analysis of your expenses
            </p>
            <button className="btn btn-primary" onClick={handleViewCharts}>
              <FaChartLine className="btn-icon" /> View Charts
            </button>
          </div>
        </div>
      </div>

      <EditExpenseModal
        expense={editingExpense}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default Expense;
