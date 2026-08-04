import axios from "./axios";

/**
 * Daily Report
 * GET /api/reports/daily?date=2026-08-04
 */
export const getDailyReport = async (date) => {

    return await axios.get(
        "/reports/daily",
        {
            params: {
                date
            }
        }
    );

};

/**
 * Monthly Report
 * GET /api/reports/monthly?month=8&year=2026
 */
export const getMonthlyReport = async (month, year) => {

    return await axios.get(
        "/reports/monthly",
        {
            params: {
                month,
                year
            }
        }
    );

};

/**
 * Yearly Report
 * GET /api/reports/yearly?year=2026
 */
export const getYearlyReport = async (year) => {

    return await axios.get(
        "/reports/yearly",
        {
            params: {
                year
            }
        }
    );

};

/**
 * Date Range Report
 * GET /api/reports/date-range?from=2026-08-01&to=2026-08-31
 */
export const getDateRangeReport = async (from, to) => {

    return await axios.get(
        "/reports/date-range",
        {
            params: {
                from,
                to
            }
        }
    );

};

/**
 * Category Wise Report
 * GET /api/reports/category
 */
export const getCategoryReport = async () => {

    return await axios.get(
        "/reports/category"
    );

};

/**
 * Payment Mode Wise Report
 * GET /api/reports/payment-mode
 */
export const getPaymentModeReport = async () => {

    return await axios.get(
        "/reports/payment-mode"
    );

};