import axios from "./axios";

/**
 * Get All Income
 */
export const getSavings = async (params = {}) => {

    return await axios.get("/saving", {
        params
    });

};

/**
 * Get Single Income
 */
export const getSaving = async (id) => {

    return await axios.get(`/saving/${id}`);

};

/**
 * Create Income
 */
export const createSaving = async (data) => {

    return await axios.post("/saving", data);

};

/**
 * Update Income
 */
export const updateSaving = async (id, data) => {

    return await axios.put(`/saving/${id}`, data);

};

/**
 * Delete Income
 */
export const deleteSaving = async (id) => {

    return await axios.delete(`/saving/${id}`);

};