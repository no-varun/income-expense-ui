import axios from "./axios";

/**
 * Get All Expense
 */
export const getShops = async (params = {}) => {

    return await axios.get("/shop", {
        params
    });

};

/**
 * Get Single Expense
 */
export const getShop = async (id) => {

    return await axios.get(`/shop/${id}`);

};

/**
 * Create Expense
 */
export const createShop = async (data) => {

    return await axios.post("/shop", data);

};

/**
 * Update Expense
 */
export const updateShop = async (id, data) => {

    return await axios.put(`/shop/${id}`, data);

};

/**
 * Delete Expense
 */
export const deleteShop = async (id) => {

    return await axios.delete(`/shop/${id}`);

};