import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerApi } from "../../api/authApi";

const Register = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({

        name: "",
        email: "",
        password: "",
        confirmPassword: ""

    });

    const handleChange = (e) => {

        setForm({

            ...form,
            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (form.password !== form.confirmPassword) {

            alert("Password and Confirm Password do not match.");

            return;

        }

        try {

            setLoading(true);

            const payload = {
                name: form.name,
                email: form.email,
                password: form.password
            };

            const response = await registerApi(payload);

            if (response.success) {

                alert("Registration successful.");

                navigate("/login");

            } else {

                alert(response.message);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div
            className="container mt-5"
            style={{ maxWidth: "450px" }}
        >

            <div className="card shadow">

                <div className="card-body">

                    <h3 className="text-center mb-4">

                        Register

                    </h3>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label>Name</label>

                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label>Email</label>

                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label>Password</label>

                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label>Confirm Password</label>

                            <input
                                type="password"
                                className="form-control"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-success w-100"
                            disabled={loading}
                        >

                            {
                                loading
                                    ? "Please wait..."
                                    : "Register"
                            }

                        </button>

                    </form>

                    <div className="text-center mt-3">

                        Already have an account?

                        <Link
                            to="/login"
                            className="ms-2"
                        >
                            Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Register;