import { Link } from "react-router-dom";
import {
    FaGithub,
    FaLinkedin,
    FaEnvelope
} from "react-icons/fa";

const Footer = () => {

    return (

        <footer
            className="footer bg-white border-top py-3 mt-auto"
        >

            <div className="container-fluid">

                <div className="row align-items-center gy-2">

                    {/* Copyright */}

                    <div className="col-lg-4 col-md-12 text-center text-lg-start">

                        <small className="text-muted">

                            © {new Date().getFullYear()} <strong>Income Expense Tracker</strong>

                        </small>

                    </div>

                    {/* Navigation */}

                    <div className="col-lg-4 col-md-12 text-center">

                        <Link
                            to="/"
                            className="text-decoration-none text-secondary me-3"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/reports"
                            className="text-decoration-none text-secondary me-3"
                        >
                            Reports
                        </Link>

                        <Link
                            to="/charts"
                            className="text-decoration-none text-secondary me-3"
                        >
                            Charts
                        </Link>

                        <Link
                            to="/profile"
                            className="text-decoration-none text-secondary"
                        >
                            Profile
                        </Link>

                    </div>

                    {/* Social / Developer */}

                    <div className="col-lg-4 col-md-12 text-center text-lg-end">

                        <small className="text-muted me-2">

                            Developed by <strong>Your Company</strong>

                        </small>

                        <a
                            href="#"
                            className="text-dark me-2"
                        >
                            <FaGithub />
                        </a>

                        <a
                            href="#"
                            className="text-primary me-2"
                        >
                            <FaLinkedin />
                        </a>

                        <a
                            href="mailto:info@example.com"
                            className="text-danger"
                        >
                            <FaEnvelope />
                        </a>

                    </div>

                </div>

            </div>

        </footer>

    );

};

export default Footer;