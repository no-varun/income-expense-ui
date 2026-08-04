// src/utils/storage.js

const TOKEN_KEY = "token";
const USER_KEY = "user";

const storage = {

    // Token
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    // User
    setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    getUser() {
        const user = localStorage.getItem(USER_KEY);

        return user ? JSON.parse(user) : null;
    },

    removeUser() {
        localStorage.removeItem(USER_KEY);
    },

    // Clear All
    clear() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

};

export default storage;