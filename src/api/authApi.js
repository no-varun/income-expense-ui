import axios from "./axios";

export const loginApi = async (data) => {

    return await axios.post("/auth/login",data);

};

export const registerApi = async (data) => {

    return await axios.post(
        "/auth/register",
        data
    );

};

export const profileApi = async () => {

    return await axios.get(
        "/auth/profile"
    );

};