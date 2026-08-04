import axios from "./axios";

/**
 * Get All Income
 */
export const getIncomes = async (params = {}) => {

    return await axios.get("/income", {
        params
    });

};

/**
 * Get Single Income
 */
export const getIncome = async (id) => {

    return await axios.get(`/income/${id}`);

};

/**
 * Create Income
 */
export const createIncome = async (data) => {

    return await axios.post("/income", data);

};

/**
 * Update Income
 */
export const updateIncome = async (id, data) => {

    return await axios.put(`/income/${id}`, data);

};

/**
 * Delete Income
 */
export const deleteIncome = async (id) => {

    return await axios.delete(`/income/${id}`);

};