import axios from "axios";

const API_BASE_URL = "http://localhost:5050";

// Helper function to get authorization headers
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

// Color mapping for different expense categories
export const EXPENSE_COLORS = {
  Rent: "#14b8a6",
  Groceries: "#f59e0b",
  Entertainment: "#ef4444",
  Utilities: "#8b5cf6",
  Transportation: "#06b6d4",
  Miscellaneous: "#84cc16",
  Healthcare: "#ec4899",
  Education: "#10b981",
  Shopping: "#f97316",
  Dining: "#84cc16",
};

export interface Expense {
  id: string;
  _id?: string;
  category: string;
  amount: number;
  date: string;
  status: string;
  notes?: string;
}

export interface ChartData {
  categoryData: Array<{ name: string; value: number; color: string }>;
  dailyData: Array<{ day: number; amount: number; date: string }>;
  weeklyData: Array<{ week: string; amount: number }>;
  totalExpenses: number;
  averageDaily: number;
  highestCategory: string;
  categoriesUsed: number;
}

class ExpenseDataService {
  // Fetch all expenses from API
  async fetchExpenses(): Promise<Expense[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/expense/list`, {
        headers: getAuthHeaders(),
      });

      return response.data.map((exp: any) => ({
        ...exp,
        id: exp._id || exp.id,
        date: exp.date, // Keep original date format for processing
        status: exp.status || "Normal",
      }));
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  }

  // Filter expenses by date range
  filterExpensesByDateRange(
    expenses: Expense[],
    startDate: string,
    endDate: string
  ): Expense[] {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return expenseDate >= start && expenseDate <= end;
    });
  }

  // Get expenses for a specific week
  getWeeklyExpenses(expenses: Expense[], weekStartDate: string): Expense[] {
    const startDate = new Date(weekStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // 7 days total

    return this.filterExpensesByDateRange(
      expenses,
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    );
  }

  // Get expenses for a specific month
  getMonthlyExpenses(
    expenses: Expense[],
    year: number,
    month: number
  ): Expense[] {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getFullYear() === year && expenseDate.getMonth() === month
      );
    });
  }

  // Transform expenses into chart data format
  transformToChartData(
    expenses: Expense[],
    dateRange: { start: string; end: string }
  ): ChartData {
    // Group by category
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    // Create category data for pie/bar charts
    const categoryData = Object.entries(categoryTotals).map(
      ([category, total]) => ({
        name: category,
        value: total,
        color:
          EXPENSE_COLORS[category as keyof typeof EXPENSE_COLORS] || "#6b7280",
      })
    );

    // Create daily data for line chart
    const dailyTotals: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      const dateKey = expense.date.split("T")[0]; // Get YYYY-MM-DD format
      dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + expense.amount;
    });

    // Generate daily data for the date range
    const dailyData: Array<{ day: number; amount: number; date: string }> = [];
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      const dayOfMonth = d.getDate();
      dailyData.push({
        day: dayOfMonth,
        amount: dailyTotals[dateStr] || 0,
        date: dateStr,
      });
    }

    // Calculate statistics
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const daysInRange =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    const averageDaily = totalExpenses / daysInRange;

    const highestCategory =
      categoryData.length > 0
        ? categoryData.reduce((prev, current) =>
            prev.value > current.value ? prev : current
          ).name
        : "None";

    // Create weekly data (if needed for weekly view)
    const weeklyData: Array<{ week: string; amount: number }> = [];
    // This can be expanded based on your weekly grouping needs

    return {
      categoryData,
      dailyData,
      weeklyData,
      totalExpenses,
      averageDaily,
      highestCategory,
      categoriesUsed: categoryData.length,
    };
  }

  // Get current week start date (Monday)
  getCurrentWeekStart(): string {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    return monday.toISOString().split("T")[0];
  }

  // Get week date range
  getWeekDateRange(weekStartDate: string): { start: string; end: string } {
    const start = new Date(weekStartDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  }

  // Get month date range
  getMonthDateRange(
    year: number,
    month: number
  ): { start: string; end: string } {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0); // Last day of month

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  }
}

export default new ExpenseDataService();
