import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await loginApi(form);

            if (response.success) {

                login(
                    response.data.token,
                    response.data.user
                );

                navigate("/");

            } else {

                alert(response.message);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
        >

            <div
                className="card shadow"
                style={{ width: "420px" }}
            >

                <div className="card-body p-4">

                    <h2 className="text-center mb-4">
                        Income & Expense
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Password
                            </label>

                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? "Please wait..." : "Login"}
                        </button>

                    </form>

                    <div className="text-center mt-4">

                        <span>
                            Don't have an account?
                        </span>

                        <Link
                            to="/register"
                            className="ms-2 text-decoration-none fw-bold"
                        >
                            Register
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Login;