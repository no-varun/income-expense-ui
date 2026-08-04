import axios from "./axios";

/**
 * Get All Expense
 */
export const getExpenses = async (params = {}) => {

    return await axios.get("/expense", {
        params
    });

};

/**
 * Get Single Expense
 */
export const getExpense = async (id) => {

    return await axios.get(`/expense/${id}`);

};

/**
 * Create Expense
 */
export const createExpense = async (data) => {

    return await axios.post("/expense", data);

};

/**
 * Update Expense
 */
export const updateExpense = async (id, data) => {

    return await axios.put(`/expense/${id}`, data);

};

/**
 * Delete Expense
 */
export const deleteExpense = async (id) => {

    return await axios.delete(`/expense/${id}`);

};