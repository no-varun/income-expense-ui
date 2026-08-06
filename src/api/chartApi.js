import axios from "./axios";

/**
 * Daily Chart
 * GET /api/charts/daily?month=8&year=2026
 */
export const getDailyChart = async (month, year) => {

    return await axios.get(
        "/charts/daily",
        {
            params: {
                month,
                year
            }
        }
    );

};

/**
 * Monthly Chart
 * GET /api/charts/monthly?year=2026
 */
export const getMonthlyChart = async (year) => {

    return await axios.get(
        "/charts/monthly",
        {
            params: {
                year
            }
        }
    );

};

/**
 * Yearly Chart
 * GET /api/charts/yearly
 */
export const getYearlyChart = async () => {

    return await axios.get(
        "/charts/yearly"
    );

};

/**
 * Weekly Chart
 * GET /api/charts/weekly
 */
export const getWeeklyChart = async () => {

    return await axios.get(
        "/charts/weekly"
    );

};

/**
 * Week Wise Expense Chart
 * GET /api/charts/week-wise?month=8&year=2026
 */
export const getWeekWiseExpenseChart = async (month, year) => {

    return await axios.get(
        "/charts/week-wise",
        {
            params: {
                month,
                year
            }
        }
    );

};

/**
 * Category Wise Chart
 * GET /api/charts/category
 */
export const getCategoryChart = async () => {

    return await axios.get(
        "/charts/category"
    );

};

/**
 * Payment Mode Wise Chart
 * GET /api/charts/payment-mode
 */
export const getPaymentModeChart = async () => {

    return await axios.get(
        "/charts/payment-mode"
    );

};

/**
 * Dashboard Chart
 * GET /api/charts/dashboard
 */
export const getDashboardChart = async () => {

    return await axios.get(
        "/charts/dashboard"
    );

};
