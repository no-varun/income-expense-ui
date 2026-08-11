import axios from "axios";
import storage from "../utils/storage";
const BASE_URL =
    import.meta.env.VITE_API_URL || "https://income-expense-api.vercel.app/api";
    // import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = storage.getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                   storage.clear();

                    if (window.location.pathname !== "/login") {
                        window.location.href = "/login";
                    }
                    break;

                case 403:
                    console.error("Forbidden");
                    break;

                case 404:
                    console.error("API Not Found");
                    break;

                case 500:
                    console.error("Internal Server Error");
                    break;

                default:
                    console.error(error.response.data?.message || "Something went wrong");
            }
        } else {
            console.error("Network Error");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
