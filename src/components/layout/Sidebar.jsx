import { NavLink, useNavigate } from "react-router-dom";
import {
    FaTachometerAlt,
    FaTags,
    FaMoneyBillWave,
    FaWallet,
    FaChartBar,
    FaChartPie,
    FaUser,
    FaSignOutAlt
} from "react-icons/fa";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {

    const { logout } = useAuth();

    const navigate = useNavigate();

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
            title: "Reports",
            path: "/reports",
            icon: <FaChartBar />
        },

        {
            title: "Charts",
            path: "/charts",
            icon: <FaChartPie />
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

        <aside
            className="bg-dark text-white d-flex flex-column shadow"
            style={{
                width: "260px",
                minHeight: "100vh",
                position: "sticky",
                top: 0
            }}
        >

            {/* Logo */}

            <div className="py-4 text-center border-bottom">

                <h3 className="fw-bold mb-0">

                    💰 Income Tracker

                </h3>

                <small className="text-light">

                    Admin Panel

                </small>

            </div>

            {/* Menu */}

            <div className="flex-grow-1">

                <ul className="nav flex-column py-3">

                    {

                        menu.map((item) => (

                            <li
                                key={item.path}
                                className="nav-item"
                            >

                                <NavLink

                                    to={item.path}

                                    end={item.path === "/"}

                                    className={({ isActive }) =>

                                        `nav-link d-flex align-items-center px-4 py-3 ${

                                            isActive

                                                ? "bg-primary text-white fw-bold"

                                                : "text-light"

                                        }`

                                    }

                                >

                                    <span
                                        className="me-3 fs-5"
                                    >

                                        {item.icon}

                                    </span>

                                    {item.title}

                                </NavLink>

                            </li>

                        ))

                    }

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

    );

};

export default Sidebar;