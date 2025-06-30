"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaSignOutAlt,
  FaHome,
  FaCog,
  FaCalendarAlt,
  FaRupeeSign,
  FaArrowLeft,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

// Color palette for charts
const COLORS = {
  Rent: "#14b8a6",
  Groceries: "#f59e0b",
  Entertainment: "#ef4444",
  Utilities: "#8b5cf6",
  Transportation: "#06b6d4",
  Transport: "#06b6d4",
  Miscellaneous: "#84cc16",
};

const styles = {
  visualizePage: {
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
  headerSection: {
    padding: "2rem",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },
  headerSubtitle: {
    color: "#a0a0a0",
    marginBottom: "1.5rem",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "transparent",
    border: "1px solid #333",
    color: "#e0e0e0",
    borderRadius: "0.375rem",
    cursor: "pointer",
    transition: "all 0.2s",
    textDecoration: "none",
    fontSize: "0.875rem",
  },
  backButtonHover: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    backgroundColor: "#2c2c2c",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    textAlign: "center",
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#14b8a6",
    marginBottom: "0.5rem",
  },
  statLabel: {
    color: "#a0a0a0",
    fontSize: "0.875rem",
  },
  chartContainer: {
    height: "400px",
    width: "100%",
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1.5rem",
  },
  chartGridDesktop: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  selectorContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  selectorGroup: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  selectorInput: {
    padding: "0.5rem",
    backgroundColor: "#2c2c2c",
    border: "1px solid #333",
    borderRadius: "0.375rem",
    color: "#e0e0e0",
    fontSize: "0.875rem",
    minWidth: "120px",
  },
  noDataMessage: {
    textAlign: "center",
    color: "#a0a0a0",
    padding: "2rem",
    fontSize: "1.1rem",
  },
  noDataIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
    display: "block",
  },
};

const Visualize = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const [selectedWeek, setSelectedWeek] = useState("all");
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    averageWeekly: 0,
    highestCategory: "None",
    categoriesUsed: 0,
  });

  // Load expense data from localStorage
  useEffect(() => {
    const loadExpenseData = () => {
      try {
        const storedExpenses = localStorage.getItem("expenseData");
        if (storedExpenses) {
          const parsedExpenses = JSON.parse(storedExpenses);
          setExpenses(parsedExpenses);
          processExpenseData(parsedExpenses, selectedMonth, selectedWeek);
        }
      } catch (error) {
        console.error("Error loading expense data:", error);
      }
    };

    loadExpenseData();

    // Listen for storage changes (when expense page updates data)
    const handleStorageChange = (e) => {
      if (e.key === "expenseData") {
        loadExpenseData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [selectedMonth, selectedWeek]);

  const getWeekNumber = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    const dayOfWeek = firstDayOfMonth.getDay();

    // Calculate which week of the month this date falls into
    const weekNumber = Math.ceil((dayOfMonth + dayOfWeek) / 7);
    return weekNumber;
  };

  const getWeekRange = (year, month, weekNumber) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const dayOfWeek = firstDayOfMonth.getDay();

    // Calculate start and end dates for the specific week
    const startDate = new Date(
      year,
      month,
      1 + (weekNumber - 1) * 7 - dayOfWeek
    );
    const endDate = new Date(year, month, 1 + weekNumber * 7 - dayOfWeek - 1);

    // Ensure dates are within the month
    if (startDate.getMonth() !== month) {
      startDate.setDate(1);
    }
    if (endDate.getMonth() !== month) {
      endDate.setDate(new Date(year, month + 1, 0).getDate());
    }

    return { startDate, endDate };
  };

  const processExpenseData = (expenseList, month, week) => {
    if (!expenseList || expenseList.length === 0) {
      setCategoryData([]);
      setWeeklyData([]);
      setStats({
        totalExpenses: 0,
        averageWeekly: 0,
        highestCategory: "None",
        categoriesUsed: 0,
      });
      return;
    }

    const [year, monthNum] = month.split("-").map(Number);
    const monthIndex = monthNum - 1;

    // Filter expenses for the selected month
    const monthlyExpenses = expenseList.filter((expense) => {
      try {
        // Parse the formatted date (DD-MMM-YYYY) back to Date object
        const dateParts = expense.date.split("-");
        const day = Number.parseInt(dateParts[0]);
        const monthName = dateParts[1];
        const expenseYear = Number.parseInt(dateParts[2]);

        const monthNames = [
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
        const expenseMonth = monthNames.indexOf(monthName);

        return (
          expenseYear === Number.parseInt(month.split("-")[0]) &&
          expenseMonth === monthIndex
        );
      } catch (error) {
        console.error("Error parsing date:", expense.date);
        return false;
      }
    });

    // Filter by week if specific week is selected
    let filteredExpenses = monthlyExpenses;
    if (week !== "all") {
      const weekNumber = Number.parseInt(week);
      filteredExpenses = monthlyExpenses.filter((expense) => {
        try {
          const dateParts = expense.date.split("-");
          const day = Number.parseInt(dateParts[0]);
          const monthName = dateParts[1];
          const expenseYear = Number.parseInt(dateParts[2]);

          const monthNames = [
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
          const expenseMonth = monthNames.indexOf(monthName);

          const expenseDate = new Date(expenseYear, expenseMonth, day);
          const expenseWeek = getWeekNumber(expenseDate);

          return expenseWeek === weekNumber;
        } catch (error) {
          console.error("Error filtering by week:", expense.date);
          return false;
        }
      });
    }

    // Group expenses by category
    const categoryTotals = {};
    filteredExpenses.forEach((expense) => {
      const category = expense.category;
      categoryTotals[category] =
        (categoryTotals[category] || 0) + expense.amount;
    });

    // Create category data for charts
    const processedCategoryData = Object.entries(categoryTotals).map(
      ([name, value]) => ({
        name,
        value,
        color: COLORS[name] || "#84cc16",
      })
    );

    // Calculate weekly data for the selected month
    const processedWeeklyData = [];
    const weeksInMonth = Math.ceil(
      (new Date(year, monthIndex + 1, 0).getDate() +
        new Date(year, monthIndex, 1).getDay()) /
        7
    );

    for (let weekNum = 1; weekNum <= weeksInMonth; weekNum++) {
      const weekExpenses = monthlyExpenses.filter((expense) => {
        try {
          const dateParts = expense.date.split("-");
          const day = Number.parseInt(dateParts[0]);
          const monthName = dateParts[1];
          const expenseYear = Number.parseInt(dateParts[2]);

          const monthNames = [
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
          const expenseMonth = monthNames.indexOf(monthName);

          const expenseDate = new Date(expenseYear, expenseMonth, day);
          const expenseWeek = getWeekNumber(expenseDate);

          return expenseWeek === weekNum;
        } catch (error) {
          return false;
        }
      });

      const weekTotal = weekExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const { startDate, endDate } = getWeekRange(year, monthIndex, weekNum);

      processedWeeklyData.push({
        week: `Week ${weekNum}`,
        weekNumber: weekNum,
        amount: weekTotal,
        dateRange: `${startDate.getDate()}-${endDate.getDate()}`,
      });
    }

    const totalExpenses = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const averageWeekly =
      totalExpenses / Math.max(processedWeeklyData.length, 1);
    const highestCategory =
      processedCategoryData.length > 0
        ? processedCategoryData.reduce((prev, current) =>
            prev.value > current.value ? prev : current
          ).name
        : "None";

    setCategoryData(processedCategoryData);
    setWeeklyData(processedWeeklyData);
    setStats({
      totalExpenses,
      averageWeekly,
      highestCategory,
      categoriesUsed: processedCategoryData.length,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expenseData");
    navigate("/getStarted");
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setSelectedWeek("all"); // Reset week selection when month changes
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  // Generate week options based on selected month
  const getWeekOptions = () => {
    if (!selectedMonth) return [];

    const [year, month] = selectedMonth.split("-").map(Number);
    const monthIndex = month - 1;
    const weeksInMonth = Math.ceil(
      (new Date(year, monthIndex + 1, 0).getDate() +
        new Date(year, monthIndex, 1).getDay()) /
        7
    );

    const options = [{ value: "all", label: "All Weeks" }];

    for (let i = 1; i <= weeksInMonth; i++) {
      const { startDate, endDate } = getWeekRange(year, monthIndex, i);
      options.push({
        value: i.toString(),
        label: `Week ${i} (${startDate.getDate()}-${endDate.getDate()})`,
      });
    }

    return options;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #333",
            borderRadius: "0.375rem",
            padding: "0.5rem",
          }}
        >
          <p
            style={{ margin: 0, color: "#e0e0e0" }}
          >{`${label}: Rs. ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  const hasData = categoryData.length > 0;

  return (
    <div style={styles.visualizePage}>
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
              <Link
                to="/expense"
                style={styles.navButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.navButtonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Expense
              </Link>
            </li>
            <li style={styles.navItem}>
              <span style={styles.activeNavButton}>Analytics</span>
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

      <div style={{ ...styles.container, ...styles.mainContent }}>
        {/* Header Section */}
        <div style={{ ...styles.card, ...styles.headerSection }}>
          <h1 style={styles.headerTitle}>Expense Analytics</h1>
          <p style={styles.headerSubtitle}>
            {hasData
              ? "Analyze your spending patterns with detailed weekly charts"
              : "Add some expenses to see your analytics"}
          </p>
          <Link
            to="/expense"
            style={styles.backButton}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.backButtonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <FaArrowLeft /> Back to Expenses
          </Link>
        </div>

        {!hasData ? (
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <div style={styles.noDataMessage}>
                <span style={styles.noDataIcon}>📊</span>
                <div>No expense data available yet.</div>
                <div>Start by adding some expenses to see your analytics!</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Month and Week Selector */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  <FaCalendarAlt style={styles.cardIcon} /> Select Time Period
                </h2>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.selectorContainer}>
                  <div style={styles.selectorGroup}>
                    <label>Month:</label>
                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      style={styles.selectorInput}
                    />
                  </div>
                  <div style={styles.selectorGroup}>
                    <label>Week:</label>
                    <select
                      value={selectedWeek}
                      onChange={handleWeekChange}
                      style={styles.selectorInput}
                    >
                      {getWeekOptions().map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  <FaRupeeSign style={styles.cardIcon} />
                  {selectedWeek === "all"
                    ? "Monthly Summary"
                    : `Week ${selectedWeek} Summary`}
                </h2>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>
                      Rs. {stats.totalExpenses.toFixed(2)}
                    </div>
                    <div style={styles.statLabel}>Total Expenses</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>
                      Rs. {stats.averageWeekly.toFixed(2)}
                    </div>
                    <div style={styles.statLabel}>Average Weekly</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.highestCategory}</div>
                    <div style={styles.statLabel}>Highest Category</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.categoriesUsed}</div>
                    <div style={styles.statLabel}>Categories Used</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div
              style={{
                ...styles.chartGrid,
                ...(window.innerWidth >= 768 ? styles.chartGridDesktop : {}),
              }}
            >
              {/* Category Breakdown - Pie Chart */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>
                    <FaChartLine style={styles.cardIcon} /> Category Breakdown
                  </h2>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Category Comparison - Bar Chart */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>
                    <FaChartLine style={styles.cardIcon} /> Category Comparison
                  </h2>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#e0e0e0", fontSize: 12 }}
                          axisLine={{ stroke: "#333" }}
                        />
                        <YAxis
                          tick={{ fill: "#e0e0e0", fontSize: 12 }}
                          axisLine={{ stroke: "#333" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="#14b8a6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Spending Trend - Line Chart */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  <FaChartLine style={styles.cardIcon} /> Weekly Spending Trend
                </h2>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="week"
                        tick={{ fill: "#e0e0e0", fontSize: 12 }}
                        axisLine={{ stroke: "#333" }}
                      />
                      <YAxis
                        tick={{ fill: "#e0e0e0", fontSize: 12 }}
                        axisLine={{ stroke: "#333" }}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div
                                style={{
                                  backgroundColor: "#1e1e1e",
                                  border: "1px solid #333",
                                  borderRadius: "0.375rem",
                                  padding: "0.5rem",
                                }}
                              >
                                <p
                                  style={{ margin: 0, color: "#e0e0e0" }}
                                >{`${label} (${data.dateRange})`}</p>
                                <p style={{ margin: 0, color: "#14b8a6" }}>
                                  {`Amount: Rs. ${payload[0].value.toFixed(2)}`}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        dot={{ fill: "#14b8a6", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Visualize;
