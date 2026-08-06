import { FaBars, FaUserCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Header = ({ sidebarOpen, setSidebarOpen }) => {

    const location = useLocation();

    const getTitle = () => {

        const path = location.pathname;

        if (path === "/") return "Dashboard";

        if (path.startsWith("/categories/add")) return "Add Category";
        if (path.startsWith("/categories/edit")) return "Edit Category";
        if (path.startsWith("/categories")) return "Category";

        if (path.startsWith("/items/add")) return "Add Item";
        if (path.startsWith("/items/edit")) return "Edit Item";
        if (path.startsWith("/items")) return "Items";

        if (path.startsWith("/income/add")) return "Add Income";
        if (path.startsWith("/income/edit")) return "Edit Income";
        if (path.startsWith("/income")) return "Income";

        if (path.startsWith("/expense/add")) return "Add Expense";
        if (path.startsWith("/expense/edit")) return "Edit Expense";
        if (path.startsWith("/expense")) return "Expense";

        if (path.startsWith("/reports")) return "Reports";

        if (path.startsWith("/charts")) return "Charts";

        if (path.startsWith("/profile")) return "Profile";

        return "Income Expense Tracker";

    };

    return (

        <header
            className="header bg-white shadow-sm sticky-top"
            style={{
                height: "70px",
                borderBottom: "1px solid #dee2e6",
                zIndex: 1030
            }}
        >

            <div className="container-fluid h-100">

                <div className="d-flex align-items-center justify-content-between h-100">

                    {/* Left */}

                    <div className="d-flex align-items-center">

                        <button
                            className="btn btn-outline-primary d-lg-none me-3"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >

                            <FaBars />

                        </button>

                        <h4
                            className="fw-bold mb-0"
                            style={{ fontSize: "1.3rem" }}
                        >

                            {getTitle()}

                        </h4>

                    </div>

                    {/* Right */}

                    <Link
                        to="/profile"
                        className="text-decoration-none text-dark"
                    >

                        <div className="d-flex align-items-center">

                            <FaUserCircle
                                size={38}
                                className="text-primary me-2"
                            />

                            <div className="d-none d-md-block">

                                <div className="fw-semibold">

                                    Welcome Admin

                                </div>

                                <small className="text-muted">

                                    View Profile

                                </small>

                            </div>

                        </div>

                    </Link>

                </div>

            </div>

        </header>

    );

};

export default Header;
