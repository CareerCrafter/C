"use client"; // This directive is typically used for Next.js App Router components

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import toast from "react-hot-toast"; // Import toast for messages
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
} from "react-icons/fa";

// Define your API Base URL here
const API_BASE_URL = "http://localhost:5050"; // IMPORTANT: Replace with your actual backend API URL

// Helper function to get authorization header from localStorage
// This assumes your backend uses Bearer tokens for authentication

// Updated styles (kept as is from your provided code)
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

// Add keyframes
const keyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

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
  const [expenses, setExpenses] = useState([]); // Initialize with empty array

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

  // Helper function to get authorization header from localStorage (moved here)
  const getAuthHeaders = () => {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  };

  // API Call: Fetch Expenses
  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/expense/list`, {
        headers: getAuthHeaders(),
      });
      // Assuming backend sends an array of expenses, and each expense has `_id` or `id`
      const formattedExpenses = response.data.map((exp) => ({
        ...exp,
        id: exp._id || exp.id, // Ensure `id` is properly extracted
        date: formatDate(exp.date), // Format date for display
        status: exp.status || "Normal", // Assign a default status if not provided
      }));
      setExpenses(formattedExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error(error.response?.data?.message || "Failed to load expenses.");
    }
  };

  // Run on component mount
  useEffect(() => {
    fetchExpenses(); // Fetch expenses when the component mounts
    addKeyframesToDocument(); // Add keyframes when component mounts
  }, []); // Empty dependency array ensures this runs only once

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Remove token on logout
    toast.success("Logged out successfully.");
    navigate("/getStarted");
  };

  const toggleAddExpenseForm = () => {
    setShowAddExpense(!showAddExpense);
    setShowDropdown(false);
    if (!showAddExpense) {
      // Reset form fields when opening the form
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
    // Check if dateString is valid to prevent errors from invalid dates
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // Return original if invalid date

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
    return `${day} ${month}, ${year}`;
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
        amount: parseFloat(amount), // Ensure amount is a number
        date: date, // YYYY-MM-DD format as expected by backend

        // Backend might determine status or add other fields like userId
      };
      const response = await axios.post(
        `http://localhost:5050/expense/add`,
        newExpenseData,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );
      const addedExpense = response.data;

      // Update local state with the new expense, formatting its date
      setExpenses((prevExpenses) => [
        ...prevExpenses,
        {
          ...addedExpense,
          id: addedExpense._id || addedExpense.id, // Ensure `id` is properly extracted
          date: formatDate(addedExpense.date), // Format date for display
          status: addedExpense.status || "Normal", // Ensure status is present
        },
      ]);

      toast.success("Expense added successfully!"); // Display success message
      // Reset form fields after successful addition
      setExpenseType("");
      setAmount("");
      setDate(getCurrentDate());
      setNotes("");
      // Keep form open for consecutive entries, uncomment below to close automatically
      // setShowAddExpense(false);
      setErrorMessage(""); // Clear any previous error messages
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

  // API Call: Delete Expense
  const handleDeleteExpense = async (id) => {
    // IMPORTANT: window.confirm is replaced. In a real app, use a custom modal for confirmation.
    console.log(
      `Attempting to delete expense with ID: ${id}. Confirmation bypassed for Canvas environment.`
    );
    try {
      await axios.delete(`${API_BASE_URL}/expense/delete/${id}`, {
        headers: getAuthHeaders(),
      });
      setExpenses(expenses.filter((expense) => expense.id !== id)); // Update local state
      toast.success("Expense deleted successfully!"); // Display success message
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error(error.response?.data?.message || "Failed to delete expense.");
    }
  };

  const handleUploadReceipt = async () => {
    setErrorMessage("Functionality to upload receipts is not yet implemented.");
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
    // Placeholder for actual file upload logic
  };

  const handleViewCharts = async () => {
    setErrorMessage("Expense visualization feature is not yet implemented.");
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
    // Placeholder for fetching data for visualizations
  };

  // Add keyframes to document (remains as is)
  const addKeyframesToDocument = () => {
    if (typeof document !== "undefined") {
      const styleElement = document.createElement("style");
      styleElement.innerHTML = keyframes;
      document.head.appendChild(styleElement);
    }
  };

  return (
    <div style={styles.expensePage}>
      {/* Navbar with Expense highlighted */}
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

      {/* Local Error Message (for form validation or feature not implemented) */}
      {showError && (
        <div style={styles.errorMessage}>
          <div style={styles.errorIcon}>✕</div>
          {errorMessage}
        </div>
      )}

      <div style={{ ...styles.container, ...styles.mainContent }}>
        {/* Welcome Section */}
        <div style={{ ...styles.card, ...styles.welcomeSection }}>
          <h1 style={styles.welcomeTitle}>Welcome, User!</h1>
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
                      <td>{expense.category}</td>
                      <td style={styles.tableCell}>{expense.type}</td>
                      <td style={styles.tableCell}>Rs. {expense.amount}</td>
                      <td style={styles.tableCell}>{expense.date}</td>{" "}
                      {/* Already formatted by fetchExpenses */}
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
                            // Add onClick for edit functionality (placeholder)
                            onClick={() => {
                              setErrorMessage(
                                "Edit functionality not implemented yet."
                              );
                              setShowError(true);
                              setTimeout(() => setShowError(false), 3000);
                            }}
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
                              {expenseType || "Select  expense type"}
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
                          <FaRupeeSign style={styles.inputIcon} />
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
                        onClick={handleAddExpense} // Use the new handleAddExpense
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
                      onClick={handleUploadReceipt} // Use the new handler
                    >
                      Start Now
                    </button>
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
              onClick={handleViewCharts} // Use the new handler
            >
              <FaChartLine style={styles.btnIcon} /> View Charts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;
