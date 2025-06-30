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

// Define your API Base URL here
const API_BASE_URL = "http://localhost:5050";

// Google Drive configuration - REPLACE WITH YOUR ACTUAL FOLDER ID
const GOOGLE_DRIVE_CONFIG = {
  FOLDER_ID: "1ABC123DEF456GHI789JKL", // Replace with your actual Google Drive folder ID
  FOLDER_URL:
    "https://drive.google.com/drive/folders/1O85f_L5042SDJMCEXpoI_h8v5IeuGU4g?usp=sharing",
};

// Helper function to get authorization header from localStorage
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

// Edit Modal Component (keeping your existing modal)
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
      console.error("Error updating expense:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !expense) return null;

  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "#1e1e1e",
      borderRadius: "0.75rem",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      width: "90%",
      maxWidth: "500px",
      maxHeight: "90vh",
      overflow: "auto",
    },
    header: {
      padding: "1rem 1.5rem",
      borderBottom: "1px solid #333",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#e0e0e0",
      margin: 0,
    },
    closeButton: {
      background: "transparent",
      border: "none",
      color: "#a0a0a0",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.5rem",
      borderRadius: "0.25rem",
    },
    body: {
      padding: "1.5rem",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      marginBottom: "1rem",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#e0e0e0",
    },
    inputContainer: {
      position: "relative",
    },
    inputIcon: {
      position: "absolute",
      left: "0.75rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#a0a0a0",
    },
    input: {
      width: "100%",
      padding: "0.625rem 0.75rem 0.625rem 2.25rem",
      border: "1px solid #333",
      borderRadius: "0.375rem",
      backgroundColor: "#2c2c2c",
      color: "#e0e0e0",
      fontSize: "0.875rem",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "0.625rem 0.75rem 0.625rem 2.25rem",
      border: "1px solid #333",
      borderRadius: "0.375rem",
      backgroundColor: "#2c2c2c",
      color: "#e0e0e0",
      fontSize: "0.875rem",
      boxSizing: "border-box",
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.75rem",
      marginTop: "1.5rem",
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.5rem 1rem",
      borderRadius: "0.375rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
      fontSize: "0.875rem",
    },
    cancelButton: {
      backgroundColor: "transparent",
      border: "1px solid #333",
      color: "#e0e0e0",
    },
    saveButton: {
      backgroundColor: "#14b8a6",
      color: "#000",
    },
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>Edit Expense</h2>
          <button
            style={modalStyles.closeButton}
            onClick={onClose}
            type="button"
          >
            <FaTimes />
          </button>
        </div>

        <div style={modalStyles.body}>
          <form onSubmit={handleSubmit}>
            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label}>Expense Type</label>
              <div style={modalStyles.inputContainer}>
                <FaTag style={modalStyles.inputIcon} />
                <select
                  style={modalStyles.select}
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

            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label}>Amount (Rs.)</label>
              <div style={modalStyles.inputContainer}>
                <FaRupeeSign style={modalStyles.inputIcon} />
                <input
                  type="number"
                  style={modalStyles.input}
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

            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label}>Date</label>
              <div style={modalStyles.inputContainer}>
                <FaCalendarAlt style={modalStyles.inputIcon} />
                <input
                  type="date"
                  style={modalStyles.input}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label}>Notes (Optional)</label>
              <div style={modalStyles.inputContainer}>
                <FaStickyNote style={modalStyles.inputIcon} />
                <input
                  type="text"
                  style={modalStyles.input}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Add notes"
                />
              </div>
            </div>

            <div style={modalStyles.actions}>
              <button
                type="button"
                style={{ ...modalStyles.button, ...modalStyles.cancelButton }}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...modalStyles.button, ...modalStyles.saveButton }}
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

// Your existing styles object (keeping it as is from your provided code)
const styles = {
  expensePage: {
    minHeight: "100vh",
    backgroundColor: "#121212",
    color: "#e0e0e0",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  },
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
  },
  navbar: {
    backgroundColor: "#1e1e1e",
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
    padding: "1rem 0",
  },
  navbarContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    color: "#14b8a6",
    fontSize: "1.5rem",
    fontWeight: "bold",
    textDecoration: "none",
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
    gap: "1rem",
    alignItems: "center",
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: 0,
  },
  navButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "transparent",
    border: "none",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontSize: "0.875rem",
  },
  navButtonHover: {
    backgroundColor: "#374151",
  },
  activeNavButton: {
    backgroundColor: "#14b8a6",
    color: "#000000",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "transparent",
    border: "none",
    color: "#ef4444",
    borderRadius: "0.375rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontSize: "0.875rem",
    marginLeft: "0.5rem",
  },
  logoutButtonHover: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  mainContent: {
    padding: "2rem 0",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: "0.75rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "1rem 1.5rem",
    borderBottom: "1px solid #333",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    margin: 0,
  },
  cardIcon: {
    color: "#14b8a6",
    marginRight: "0.5rem",
  },
  cardBody: {
    padding: "1.5rem",
  },
  welcomeSection: {
    padding: "2rem",
    textAlign: "center",
  },
  welcomeTitle: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },
  welcomeSubtitle: {
    color: "#a0a0a0",
    marginBottom: "1.5rem",
  },
  centerButton: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    border: "none",
    fontSize: "0.875rem",
  },
  btnPrimary: {
    backgroundColor: "#14b8a6",
    color: "#000",
  },
  btnPrimaryHover: {
    backgroundColor: "#0d9488",
  },
  btnSecondary: {
    backgroundColor: "transparent",
    border: "1px solid #333",
    color: "#e0e0e0",
  },
  btnSecondaryHover: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  btnIcon: {
    marginRight: "0.5rem",
  },
  btnClose: {
    background: "transparent",
    border: "none",
    color: "#a0a0a0",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnCloseHover: {
    color: "#e0e0e0",
  },
  iconButton: {
    background: "transparent",
    border: "none",
    color: "#a0a0a0",
    cursor: "pointer",
    padding: "0.25rem",
    borderRadius: "0.25rem",
  },
  iconButtonHover: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#e0e0e0",
  },
  btnDelete: {
    color: "#a0a0a0",
  },
  btnDeleteHover: {
    color: "#ff4d4f",
  },
  iconSmall: {
    width: "1rem",
    height: "1rem",
  },
  tableContainer: {
    overflowX: "auto",
  },
  expenseTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    textAlign: "left",
    padding: "0.75rem 1.5rem",
    color: "#a0a0a0",
    fontWeight: 500,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderBottom: "1px solid #333",
  },
  tableCell: {
    padding: "0.75rem 1.5rem",
    borderBottom: "1px solid #333",
  },
  badge: {
    display: "inline-block",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  badgeNormal: {
    backgroundColor: "rgba(82, 196, 26, 0.1)",
    color: "#52c41a",
  },
  badgeAnomaly: {
    backgroundColor: "rgba(255, 77, 79, 0.1)",
    color: "#ff4d4f",
  },
  actionButtons: {
    display: "flex",
    gap: "0.5rem",
  },
  addExpenseForm: {
    position: "relative",
  },
  tabs: {
    width: "100%",
  },
  tabList: {
    display: "flex",
    borderBottom: "1px solid #333",
    marginBottom: "1.5rem",
  },
  tabButton: {
    padding: "0.75rem 1rem",
    background: "transparent",
    border: "none",
    color: "#a0a0a0",
    cursor: "pointer",
    fontWeight: 500,
    position: "relative",
  },
  activeTab: {
    color: "#14b8a6",
    position: "relative",
  },
  activeTabAfter: {
    content: '""',
    position: "absolute",
    bottom: "-1px",
    left: 0,
    width: "100%",
    height: "2px",
    backgroundColor: "#14b8a6",
  },
  tabContent: {
    paddingTop: "0.5rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1.5rem",
  },
  formGridDesktop: {
    gridTemplateColumns: "1fr 1fr",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  formLabel: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  inputContainer: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#a0a0a0",
  },
  formInput: {
    width: "100%",
    padding: "0.625rem 0.75rem 0.625rem 2.25rem",
    border: "1px solid #333",
    borderRadius: "0.375rem",
    backgroundColor: "#2c2c2c",
    color: "#e0e0e0",
    fontSize: "0.875rem",
  },
  formInputPlaceholder: {
    color: "#a0a0a0",
  },
  formInputFocus: {
    outline: "none",
    borderColor: "#14b8a6",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "1.5rem",
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdownTrigger: {
    display: "flex",
    alignItems: "center",
    padding: "0.625rem 0.75rem",
    border: "1px solid #333",
    borderRadius: "0.375rem",
    backgroundColor: "#2c2c2c",
    cursor: "pointer",
  },
  dropdownPlaceholder: {
    marginLeft: "1.5rem",
    color: "#a0a0a0",
    flexGrow: 1,
  },
  dropdownArrow: {
    marginLeft: "auto",
    color: "#a0a0a0",
    fontSize: "0.75rem",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    backgroundColor: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: "0.375rem",
    marginTop: "0.25rem",
    zIndex: 10,
    maxHeight: "15rem",
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  dropdownItem: {
    padding: "0.625rem 0.75rem",
    cursor: "pointer",
  },
  dropdownItemHover: {
    backgroundColor: "#2a2a2a",
  },
  uploadContent: {
    textAlign: "center",
    padding: "2rem 0",
  },
  uploadTitle: {
    marginBottom: "1.5rem",
    fontSize: "1.125rem",
    fontWeight: 500,
  },
  uploadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#4285f4",
    color: "#ffffff",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "background-color 0.2s",
    textDecoration: "none",
  },
  uploadButtonHover: {
    backgroundColor: "#3367d6",
  },
  visualizationSection: {
    textAlign: "center",
    padding: "2rem 0",
  },
  visualizationText: {
    marginBottom: "1.5rem",
    color: "#a0a0a0",
  },
  errorMessage: {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    padding: "0.75rem 1rem",
    borderRadius: "0.375rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    animation: "fadeIn 0.3s ease-in-out",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
  errorIcon: {
    width: "1.25rem",
    height: "1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
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

  // Edit modal state
  const [editingExpense, setEditingExpense] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  // API Call: Fetch Expenses
  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/expense/list`, {
        headers: getAuthHeaders(),
      });
      const formattedExpenses = response.data.map((exp) => ({
        ...exp,
        id: exp._id || exp.id,
        date: formatDate(exp.date),
        status: exp.status || "Normal",
      }));
      setExpenses(formattedExpenses);

      // Store expenses in localStorage for visualization page
      localStorage.setItem("expenseData", JSON.stringify(formattedExpenses));
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error(error.response?.data?.message || "Failed to load expenses.");
    }
  };

  // Run on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expenseData"); // Clear expense data on logout
    toast.success("Logged out successfully.");
    navigate("/getStarted");
  };

  const toggleAddExpenseForm = () => {
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
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // API Call: Add Expense
  const handleAddExpense = async () => {
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
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      const expenseId =
        response.data._id || response.data.id || response.data.expenseId;
      const newExpense = {
        id: expenseId,
        _id: expenseId,
        category: expenseType,
        amount: Number.parseFloat(amount),
        date: formatDate(date),
        status: "Normal",
        notes: notes || "",
      };

      const updatedExpenses = [newExpense, ...expenses];
      setExpenses(updatedExpenses);

      // Update localStorage for visualization page
      localStorage.setItem("expenseData", JSON.stringify(updatedExpenses));

      toast.success("Expense added successfully!");

      // Reset form fields
      setExpenseType("");
      setAmount("");
      setDate(getCurrentDate());
      setNotes("");
      setShowAddExpense(false);
      setErrorMessage("");
      setShowError(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error(
        error.response?.data?.message ||
          error?.message ||
          "Failed to add expense."
      );
    }
  };

  // API Call: Update Expense
  const handleUpdateExpense = async (id, expenseData) => {
    try {
      const expense = expenses.find((exp) => exp.id === id || exp._id === id);
      if (!expense) {
        toast.error("Expense not found");
        return;
      }

      const updateId = expense._id || expense.id;
      await axios.put(
        `${API_BASE_URL}/expense/update/${updateId}`,
        expenseData,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      const updatedExpense = {
        ...expense,
        ...expenseData,
        date: expenseData.date ? formatDate(expenseData.date) : expense.date,
      };

      const updatedExpenses = expenses.map((exp) =>
        exp.id === id || exp._id === id ? updatedExpense : exp
      );

      setExpenses(updatedExpenses);

      // Update localStorage for visualization page
      localStorage.setItem("expenseData", JSON.stringify(updatedExpenses));

      toast.success("Expense updated successfully!");
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error(error.response?.data?.message || "Failed to update expense.");
      throw error;
    }
  };

  // API Call: Delete Expense
  const handleDeleteExpense = async (id) => {
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

      // Update localStorage for visualization page
      localStorage.setItem("expenseData", JSON.stringify(updatedExpenses));

      toast.success("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);

      if (
        error.response?.status === 404 ||
        error.response?.data?.message?.includes("Invalid")
      ) {
        const updatedExpenses = expenses.filter(
          (expense) => expense.id !== id && expense._id !== id
        );
        setExpenses(updatedExpenses);
        localStorage.setItem("expenseData", JSON.stringify(updatedExpenses));
        toast.success("Expense deleted successfully!");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to delete expense"
        );
      }
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (id, data) => {
    await handleUpdateExpense(id, data);
    setShowEditModal(false);
    setEditingExpense(null);
  };

  // Fixed Google Drive redirect function
  const handleUploadReceipt = () => {
    const driveUrl = `${GOOGLE_DRIVE_CONFIG.FOLDER_URL}${GOOGLE_DRIVE_CONFIG.FOLDER_ID}`;
    console.log("Opening Google Drive URL:", driveUrl); // Debug log

    // Open in new tab with proper settings
    const newWindow = window.open(driveUrl, "_blank", "noopener,noreferrer");

    // Check if popup was blocked
    if (
      !newWindow ||
      newWindow.closed ||
      typeof newWindow.closed === "undefined"
    ) {
      // Fallback: try direct navigation
      window.location.href = driveUrl;
    }
  };

  const handleViewCharts = () => {
    navigate("/visualize");
  };

  return (
    <div style={styles.expensePage}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={{ ...styles.container, ...styles.navbarContainer }}>
          <Link to="/dashboard" style={styles.logo}>
            Expense Tracker
          </Link>
          <ul style={styles.navLinks}>
            <li style={styles.navItem}>
              <Link
                to="/"
                style={styles.navButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.navButtonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <FaHome size={18} />
                Home
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link
                to="/services"
                style={styles.navButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.navButtonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <FaCog size={18} />
                Services
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link
                to="/dashboard"
                style={styles.navButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.navButtonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Dashboard
              </Link>
            </li>
            <li style={styles.navItem}>
              <span style={styles.activeNavButton}>Expense</span>
            </li>
            <li style={styles.navItem}>
              <button
                style={styles.logoutButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.logoutButtonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                onClick={handleLogout}
              >
                <FaSignOutAlt size={18} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Error Message */}
      {showError && (
        <div style={styles.errorMessage}>
          <div style={styles.errorIcon}>✕</div>
          {errorMessage}
        </div>
      )}

      <div style={{ ...styles.container, ...styles.mainContent }}>
        {/* Welcome Section */}
        <div style={{ ...styles.card, ...styles.welcomeSection }}>
          <p style={styles.welcomeSubtitle}>
            Track and manage your expenses efficiently
          </p>

          <div style={styles.centerButton}>
            <button
              style={{ ...styles.btn, ...styles.btnPrimary }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.btnPrimaryHover.backgroundColor)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.btnPrimary.backgroundColor)
              }
              onClick={toggleAddExpenseForm}
            >
              <FaPlus style={styles.btnIcon} /> Add Expense
            </button>
          </div>
        </div>

        {/* Recent Expenses */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              <span style={styles.cardIcon}>📋</span> Recent Expenses
            </h2>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.expenseTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Expense Type</th>
                  <th style={styles.tableHeader}>Amount</th>
                  <th style={styles.tableHeader}>Date</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        ...styles.tableCell,
                        textAlign: "center",
                        color: "#a0a0a0",
                      }}
                    >
                      No expenses recorded yet.
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td style={styles.tableCell}>{expense.category}</td>
                      <td style={styles.tableCell}>Rs. {expense.amount}</td>
                      <td style={styles.tableCell}>{expense.date}</td>
                      <td style={styles.tableCell}>
                        <span
                          style={{
                            ...styles.badge,
                            ...(expense.status === "Normal"
                              ? styles.badgeNormal
                              : styles.badgeAnomaly),
                          }}
                        >
                          {expense.status}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.actionButtons}>
                          <button
                            style={styles.iconButton}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                styles.iconButtonHover.backgroundColor)
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                styles.iconButton.backgroundColor)
                            }
                            onClick={() => handleEditExpense(expense)}
                          >
                            <FaEdit style={styles.iconSmall} />
                          </button>
                          <button
                            style={{
                              ...styles.iconButton,
                              ...styles.btnDelete,
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.color =
                                styles.btnDeleteHover.color)
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.color =
                                styles.btnDelete.color)
                            }
                            onClick={() => handleDeleteExpense(expense.id)}
                          >
                            <FaTrashAlt style={styles.iconSmall} />
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

        {/* Add Expense Form */}
        {showAddExpense && (
          <div style={{ ...styles.card, ...styles.addExpenseForm }}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                <FaPlus style={styles.cardIcon} /> Add New Expense
              </h2>
              <button
                style={styles.btnClose}
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = styles.btnCloseHover.color)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = styles.btnClose.color)
                }
                onClick={toggleAddExpenseForm}
              >
                <FaTimes style={styles.iconSmall} />
              </button>
            </div>

            <div style={styles.cardBody}>
              <div style={styles.tabs}>
                <div style={styles.tabList}>
                  <button
                    style={{
                      ...styles.tabButton,
                      ...(activeTab === "manual" ? styles.activeTab : {}),
                    }}
                    onClick={() => switchTab("manual")}
                  >
                    Manual Entry
                    {activeTab === "manual" && (
                      <div style={styles.activeTabAfter}></div>
                    )}
                  </button>
                  <button
                    style={{
                      ...styles.tabButton,
                      ...(activeTab === "upload" ? styles.activeTab : {}),
                    }}
                    onClick={() => switchTab("upload")}
                  >
                    Upload Receipt
                    {activeTab === "upload" && (
                      <div style={styles.activeTabAfter}></div>
                    )}
                  </button>
                </div>

                {activeTab === "manual" && (
                  <div style={styles.tabContent}>
                    <div
                      style={{
                        ...styles.formGrid,
                        ...(window.innerWidth >= 768
                          ? styles.formGridDesktop
                          : {}),
                      }}
                    >
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Expense Type</label>
                        <div style={styles.dropdownContainer}>
                          <div
                            style={styles.dropdownTrigger}
                            onClick={handleExpenseTypeClick}
                          >
                            <FaTag style={styles.inputIcon} />
                            <span style={styles.dropdownPlaceholder}>
                              {expenseType || "Select expense type"}
                            </span>
                            <span style={styles.dropdownArrow}>▼</span>
                          </div>

                          {showDropdown && (
                            <div
                              style={{
                                ...styles.dropdownMenu,
                                maxHeight: "200px",
                                overflowY: "auto",
                              }}
                            >
                              {expenseTypes.map((type) => (
                                <div
                                  key={type}
                                  style={styles.dropdownItem}
                                  onMouseOver={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      styles.dropdownItemHover.backgroundColor)
                                  }
                                  onMouseOut={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "transparent")
                                  }
                                  onClick={() => selectExpenseType(type)}
                                >
                                  {type}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Amount (Rs.)</label>
                        <div style={styles.inputContainer}>
                          <span style={styles.inputIcon}>रु</span>

                          <input
                            type="number"
                            placeholder="Enter amount"
                            style={styles.formInput}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            onFocus={(e) =>
                              (e.target.style.borderColor =
                                styles.formInputFocus.borderColor)
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor =
                                styles.formInput.border)
                            }
                          />
                        </div>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Date</label>
                        <div style={styles.inputContainer}>
                          <FaCalendarAlt style={styles.inputIcon} />
                          <input
                            type="date"
                            style={styles.formInput}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            onFocus={(e) =>
                              (e.target.style.borderColor =
                                styles.formInputFocus.borderColor)
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor =
                                styles.formInput.border)
                            }
                          />
                        </div>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Notes (Optional)</label>
                        <div style={styles.inputContainer}>
                          <FaStickyNote style={styles.inputIcon} />
                          <input
                            placeholder="Add notes"
                            style={styles.formInput}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            onFocus={(e) =>
                              (e.target.style.borderColor =
                                styles.formInputFocus.borderColor)
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor =
                                styles.formInput.border)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div style={styles.formActions}>
                      <button
                        style={{ ...styles.btn, ...styles.btnSecondary }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            styles.btnSecondaryHover.backgroundColor)
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            styles.btnSecondary.backgroundColor)
                        }
                        onClick={toggleAddExpenseForm}
                      >
                        Cancel
                      </button>
                      <button
                        style={{ ...styles.btn, ...styles.btnPrimary }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            styles.btnPrimaryHover.backgroundColor)
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            styles.btnPrimary.backgroundColor)
                        }
                        onClick={handleAddExpense}
                      >
                        Add Expense
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "upload" && (
                  <div
                    style={{ ...styles.tabContent, ...styles.uploadContent }}
                  >
                    <h3 style={styles.uploadTitle}>
                      Upload Bills and Manage Expenses
                    </h3>
                    <a
                      href={`${GOOGLE_DRIVE_CONFIG.FOLDER_URL}${GOOGLE_DRIVE_CONFIG.FOLDER_ID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.uploadButton}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          styles.uploadButtonHover.backgroundColor)
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          styles.uploadButton.backgroundColor)
                      }
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

        {/* Expense Visualization */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              <FaChartLine style={styles.cardIcon} /> Expense Visualization
            </h2>
          </div>

          <div style={{ ...styles.cardBody, ...styles.visualizationSection }}>
            <p style={styles.visualizationText}>
              Want to see your expenses visually?
            </p>
            <button
              style={{ ...styles.btn, ...styles.btnPrimary }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.btnPrimaryHover.backgroundColor)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.btnPrimary.backgroundColor)
              }
              onClick={handleViewCharts}
            >
              <FaChartLine style={styles.btnIcon} /> View Charts
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
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
