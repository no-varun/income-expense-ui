import axios from "./axios";

export const getSummary = async () => {

    return await axios.get(
        "/dashboard/summary"
    );

};

export const getRecentIncome = async () => {

    return await axios.get(
        "/dashboard/recent-income"
    );

};

export const getRecentExpense = async () => {

    return await axios.get(
        "/dashboard/recent-expense"
    );

};

export const getRecentTransactions = async () => {

    return await axios.get(
        "/dashboard/recent-transactions"
    );

};