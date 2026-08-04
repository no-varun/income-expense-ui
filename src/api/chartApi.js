import axios from "./axios";

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