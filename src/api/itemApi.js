import axios from "./axios";

/**
 * Get All Items
 */
export const getItems = async (params = {}) => {

    return await axios.get("/item", {
        params
    });

};

/**
 * Get Single Item
 */
export const getItem = async (id) => {

    return await axios.get(`/item/${id}`);

};

/**
 * Create Item
 */
export const createItem = async (data) => {

    return await axios.post("/item", data);

};

/**
 * Update Item
 */
export const updateItem = async (id, data) => {

    return await axios.put(`/item/${id}`, data);

};

/**
 * Delete Item
 */
export const deleteItem = async (id) => {

    return await axios.delete(`/item/${id}`);

};
