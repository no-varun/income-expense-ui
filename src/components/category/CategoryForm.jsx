import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CategoryForm = ({
    initialValues = {},
    onSubmit,
    loading = false
}) => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        type: "INCOME",
        description: ""
    });


    /*
     * =========================
     * EDIT MODE
     * =========================
     */

    useEffect(() => {

        if (Object.keys(initialValues).length > 0) {

            setForm({

                name:
                    initialValues.name || "",

                type:
                    initialValues.type || "INCOME",

                description:
                    initialValues.description || ""

            });

        }

    }, [initialValues]);


    /*
     * =========================
     * HANDLE CHANGE
     * =========================
     */

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };


    /*
     * =========================
     * SUBMIT
     * =========================
     */

    const handleSubmit = (e) => {

        e.preventDefault();


        if (!form.name.trim()) {

            alert(
                "Category name is required."
            );

            return;

        }


        if (!form.type) {

            alert(
                "Category type is required."
            );

            return;

        }


        onSubmit({

            ...form,

            name:
                form.name.trim(),

            type:
                form.type.toUpperCase()

        });

    };


    /*
     * =========================
     * RENDER
     * =========================
     */

    return (

        <div className="card shadow">

            {/* ================= HEADER ================= */}

            <div className="card-header d-flex justify-content-between align-items-center">

                <h5 className="mb-0">
                    Category Details
                </h5>


                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                        navigate("/categories")
                    }
                >

                    ← Back

                </button>

            </div>


            {/* ================= BODY ================= */}

            <div className="card-body">

                <form onSubmit={handleSubmit}>


                    {/* ================= NAME ================= */}

                    <div className="mb-3">

                        <label className="form-label">

                            Category Name

                        </label>


                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            required
                        />

                    </div>


                    {/* ================= TYPE ================= */}

                    <div className="mb-3">

                        <label className="form-label">

                            Category Type

                        </label>


                        <select
                            className="form-select"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            required
                        >

                            <option value="INCOME">
                                Income
                            </option>

                            <option value="EXPENSE">
                                Expense
                            </option>

                            <option value="SAVING">
                                Saving
                            </option>

                            <option value="DEBT">
                                Debt
                            </option>

                        </select>

                    </div>


                    {/* ================= DESCRIPTION ================= */}

                    <div className="mb-3">

                        <label className="form-label">

                            Description

                        </label>


                        <textarea
                            className="form-control"
                            rows="4"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                        />

                    </div>


                    {/* ================= SUBMIT ================= */}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >

                        {loading
                            ? "Please wait..."
                            : "Save Category"}

                    </button>

                </form>

            </div>

        </div>

    );

};

export default CategoryForm;