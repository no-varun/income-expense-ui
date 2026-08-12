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
export const getWeekWiseExpenseChart = async (
    month,
    year
) => {

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
 *
 * All:
 * GET /api/charts/category?year=all&month=all
 *
 * Year:
 * GET /api/charts/category?year=2026&month=all
 *
 * Year + Month:
 * GET /api/charts/category?year=2026&month=8
 *
 * All Years + Month:
 * GET /api/charts/category?year=all&month=8
 */
export const getCategoryChart = async (
    year = "all",
    month = "all"
) => {

    return await axios.get(
        "/charts/category",
        {
            params: {
                year,
                month
            }
        }
    );

};


/**
 * Payment Mode Wise Chart
 *
 * All:
 * GET /api/charts/payment-mode?year=all&month=all
 *
 * Year:
 * GET /api/charts/payment-mode?year=2026&month=all
 *
 * Year + Month:
 * GET /api/charts/payment-mode?year=2026&month=8
 *
 * All Years + Month:
 * GET /api/charts/payment-mode?year=all&month=8
 */
export const getPaymentModeChart = async (
    year = "all",
    month = "all"
) => {

    return await axios.get(
        "/charts/payment-mode",
        {
            params: {
                year,
                month
            }
        }
    );

};


/**
 * Dashboard Chart
 *
 * Default:
 * GET /api/charts/dashboard?year=all
 *
 * Specific year:
 * GET /api/charts/dashboard?year=2026
 */
export const getDashboardChart = async (
    year = "all"
) => {

    return await axios.get(
        "/charts/dashboard",
        {
            params: {
                year
            }
        }
    );

};
export const getTitleTypeChart = async (
    year = "all",
    month = "all"
) => {

    return await axios.get(
        "/charts/titleTypeChart",
        {
            params: {
                year,
                month
            }
        }
    );

};