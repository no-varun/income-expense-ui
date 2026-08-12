import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FaTachometerAlt,
    FaTags,
    FaBoxOpen,
    FaMoneyBillWave,
    FaWallet,
    FaChartBar,
    FaChartPie,
    FaUser,
    FaSignOutAlt,
    FaTimes,
    FaSave
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {

    const { logout } = useAuth();

    const navigate = useNavigate();

    const [chartOpen, setChartOpen] = useState(false);

    const menu = [

        {
            title: "Dashboard",
            path: "/",
            icon: <FaTachometerAlt />
        },

        {
            title: "Category",
            path: "/categories",
            icon: <FaTags />
        },

        {
            title: "Items",
            path: "/items",
            icon: <FaBoxOpen />
        },

        {
            title: "Income",
            path: "/income",
            icon: <FaMoneyBillWave />
        },

        {
            title: "Expense",
            path: "/expense",
            icon: <FaWallet />
        },
        {
            title: "Saving",
            path: "/saving",
            icon: <FaSave />
        },

        {
            title: "Debts",
            path: "/debt",
            icon: <FaWallet />
        },
        {
            title: "Reports",
            path: "/reports",
            icon: <FaChartBar />
        },

        {
            title: "Profile",
            path: "/profile",
            icon: <FaUser />
        }

    ];

    const handleLogout = () => {

        logout();

        navigate("/login", { replace: true });

    };

    return (

        <>

            {/* Mobile Overlay */}

            {

                sidebarOpen &&

                <div

                    className="d-lg-none position-fixed top-0 start-0 w-100 h-100"

                    style={{
                        background: "rgba(0,0,0,0.5)",
                        zIndex: 1040
                    }}

                    onClick={() => setSidebarOpen(false)}

                />

            }

            <aside
                className={`sidebar bg-dark text-white d-flex flex-column shadow ${sidebarOpen ? "sidebar-open" : ""
                    }`}
            >

                {/* Mobile Close */}

                <div className="d-lg-none text-end p-3">

                    <button

                        className="btn btn-outline-light btn-sm"

                        onClick={() => setSidebarOpen(false)}

                    >

                        <FaTimes />

                    </button>

                </div>

                {/* Logo */}

                <div className="py-3 text-center border-bottom">

                    <h4 className="fw-bold">

                        💰 Income Tracker

                    </h4>

                    <small>

                        Admin Panel

                    </small>

                </div>

                {/* Menu */}

                <div className="flex-grow-1">

                    <ul className="nav flex-column py-3">

                        {

                            menu.map(item => (

                                <li

                                    className="nav-item"

                                    key={item.path}

                                >

                                    <NavLink

                                        to={item.path}

                                        end={item.path === "/"}

                                        onClick={() => setSidebarOpen(false)}

                                        className={({ isActive }) =>

                                            `nav-link d-flex align-items-center px-4 py-3 ${isActive

                                                ? "bg-primary text-white fw-bold"

                                                : "text-light"

                                            }`

                                        }

                                    >

                                        <span className="me-3">

                                            {item.icon}

                                        </span>

                                        {item.title}

                                    </NavLink>

                                </li>

                            ))

                        }

                        {/* Charts */}
                        {/* Charts */}

                        <li className="nav-item">

                            <button

                                className="btn text-light w-100 text-start px-4 py-3"

                                onClick={() => setChartOpen(!chartOpen)}

                            >

                                <FaChartPie className="me-3" />

                                Charts

                            </button>

                            {

                                chartOpen &&

                                <ul className="nav flex-column">

                                    <li>

                                        <NavLink
                                            to="/charts/daily"
                                            className="nav-link text-light ps-5"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            Daily Chart
                                        </NavLink>

                                    </li>
                                    <li>

                                        <NavLink
                                            to="/charts/weekly"
                                            className="nav-link text-light ps-5"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            This  Week Chart
                                        </NavLink>

                                    </li>
                                    <li>

                                        <NavLink
                                            to="/charts/week-wise"
                                            className="nav-link text-light ps-5"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            Week Wise Chart
                                        </NavLink>

                                    </li>

                                    <li>

                                        <NavLink
                                            to="/charts/monthly"
                                            className="nav-link text-light ps-5"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            Monthly Chart
                                        </NavLink>

                                    </li>




                                    <li>

                                        <NavLink
                                            to="/charts/yearly"
                                            className="nav-link text-light ps-5"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            Yearly Chart
                                        </NavLink>

                                    </li>

                                    <li>

                                        <NavLink
                                            to="/charts/category"
                                            className="nav-link text-light ps-5"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            Category Chart
                                        </NavLink>

                                    </li>

                                    <li>

                                        <NavLink
                                            to="/charts/titleType"
                                            className="nav-link text-light ps-5"
                                            onClick={() => setSidebarOpen(false)}
                                        >Item Wise Chart
                                        </NavLink>

                                    </li>
                                    <li>

                                        <NavLink
                                            to="/charts/payment-mode"
                                            className="nav-link text-light ps-5"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            Payment Mode Chart
                                        </NavLink>

                                    </li>

                                    <li>

                                        <NavLink
                                            to="/charts/dashboard"
                                            className="nav-link text-light ps-5"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            Dashboard Chart
                                        </NavLink>

                                    </li>

                                </ul>

                            }

                        </li>

                    </ul>

                </div>

                {/* Logout */}

                <div className="border-top p-3">

                    <button

                        className="btn btn-danger w-100"

                        onClick={handleLogout}

                    >

                        <FaSignOutAlt className="me-2" />

                        Logout

                    </button>

                </div>

            </aside>

            {/* Desktop Spacer */}
            {/* <div
                className="d-none d-lg-block"
                style={{
                    width: "260px"
                }}
            /> */}

        </>

    );

};

export default Sidebar;
