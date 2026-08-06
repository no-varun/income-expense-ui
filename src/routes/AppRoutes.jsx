import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import Layout from "../components/layout/Layout";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Dashboard
import Dashboard from "../pages/dashboard/Dashboard";

// Category
import CategoryList from "../pages/category/CategoryList";
import AddCategory from "../pages/category/AddCategory";
import EditCategory from "../pages/category/EditCategory";

// Items
import ItemList from "../pages/item/ItemList";
import AddItem from "../pages/item/AddItem";
import EditItem from "../pages/item/EditItem";

// Income
import IncomeList from "../pages/income/IncomeList";
import AddIncome from "../pages/income/AddIncome";
import EditIncome from "../pages/income/EditIncome";

// Expense
import ExpenseList from "../pages/expense/ExpenseList";
import AddExpense from "../pages/expense/AddExpense";
import EditExpense from "../pages/expense/EditExpense";

// Reports
import Reports from "../pages/reports/Reports";

// Charts
import Charts from "../pages/charts/Charts";

// Profile
import Profile from "../pages/profile/Profile";

const AppRoutes = () => {

    return (

        <BrowserRouter>

            <Routes>

                {/* Public Routes */}

                <Route element={<PublicRoute />}>

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                </Route>

                {/* Private Routes */}

                <Route element={<PrivateRoute />}>

                    <Route element={<Layout />}>

                        {/* Dashboard */}

                        <Route
                            path="/"
                            element={<Dashboard />}
                        />
                        <Route
                            path=""
                            element={<Dashboard />}
                        />
                        {/* Category */}

                        <Route
                            path="/categories"
                            element={<CategoryList />}
                        />

                        <Route
                            path="/categories/add"
                            element={<AddCategory />}
                        />

                        <Route
                            path="/categories/edit/:id"
                            element={<EditCategory />}
                        />

                        {/* Items */}

                        <Route
                            path="/items"
                            element={<ItemList />}
                        />

                        <Route
                            path="/items/add"
                            element={<AddItem />}
                        />

                        <Route
                            path="/items/edit/:id"
                            element={<EditItem />}
                        />

                        {/* Income */}

                        <Route
                            path="/income"
                            element={<IncomeList />}
                        />

                        <Route
                            path="/income/add"
                            element={<AddIncome />}
                        />

                        <Route
                            path="/income/edit/:id"
                            element={<EditIncome />}
                        />

                        {/* Expense */}

                        
                        <Route
                            path="/expense"
                            element={<ExpenseList />}
                        />

                        <Route
                            path="/expense/add"
                            element={<AddExpense />}
                        />

                        <Route
                            path="/expense/edit/:id"
                            element={<EditExpense />}
                        />
                       

                        {/* Reports */}

                        
                        <Route
                            path="/reports"
                            element={<Reports />}
                        />
                       

                        {/* Charts */}

                        
                        <Route
                            path="/charts"
                            element={<Navigate to="/charts/monthly" replace />}
                        />

                        <Route
                            path="/charts/monthly"
                            element={<Charts module="monthly" />}
                        />

                        <Route
                            path="/charts/weekly"
                            element={<Charts module="weekly" />}
                        />

                        <Route
                            path="/charts/yearly"
                            element={<Charts module="yearly" />}
                        />

                        <Route
                            path="/charts/category"
                            element={<Charts module="category" />}
                        />

                        <Route
                            path="/charts/payment-mode"
                            element={<Charts module="payment-mode" />}
                        />

                        <Route
                            path="/charts/dashboard"
                            element={<Charts module="dashboard" />}
                        />
                       

                        {/* Profile */}

                        
                        <Route
                            path="/profile"
                            element={<Profile />}
                        />
                       

                    </Route>

                </Route>

                {/* 404 */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>

    );

};

export default AppRoutes;
