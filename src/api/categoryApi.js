import axios from "./axios";

/**
 * Get All Categories
 */
export const getCategories = async (params = {}) => {

    return await axios.get("/categories", {
        params
    });

};

/**
 * Get Single Category
 */
export const getCategory = async (id) => {

    return await axios.get(`/categories/${id}`);

};

/**
 * Create Category
 */
export const createCategory = async (data) => {

    return await axios.post("/categories", data);

};

/**
 * Update Category
 */
export const updateCategory = async (id, data) => {

    return await axios.put(`/categories/${id}`, data);

};

/**
 * Delete Category
 */
export const deleteCategory = async (id) => {

    return await axios.delete(`/categories/${id}`);

};
