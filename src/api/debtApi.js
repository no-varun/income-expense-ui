import axios from "./axios";

/**
 * Get All Income
 */
export const getDebts = async (params = {}) => {

    return await axios.get("/debt", {
        params
    });

};

/**
 * Get Single Income
 */
export const getDebt = async (id) => {

    return await axios.get(`/debt/${id}`);

};

/**
 * Create Income
 */
export const createDebt = async (data) => {

    return await axios.post("/debt", data);

};

/**
 * Update Income
 */
export const updateDebt = async (id, data) => {

    return await axios.put(`/debt/${id}`, data);

};

/**
 * Delete Income
 */
export const deleteDebt = async (id) => {

    return await axios.delete(`/debt/${id}`);

};