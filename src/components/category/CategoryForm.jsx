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

    useEffect(() => {

        if (Object.keys(initialValues).length > 0) {

            setForm({
                name: initialValues.name || "",
                type: initialValues.type || "INCOME",
                description: initialValues.description || ""
            });

        }

    }, [initialValues]);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!form.name.trim()) {
            alert("Category name is required.");
            return;
        }

        onSubmit({
            ...form,
            type: form.type.toUpperCase()
        });

    };

    return (

        <div className="card shadow">

            <div className="card-header d-flex justify-content-between align-items-center">

                <h5 className="mb-0">
                    Category Details
                </h5>

                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate("/categories")}
                >
                    ← Back
                </button>

            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

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

                    <div className="mb-3">

                        <label className="form-label">
                            Category Type
                        </label>

                        <select className="form-select" name="type" value={form.type} onChange={handleChange} >
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                            <option value="SAVING">Saving</option>

                        </select>

                    </div>

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

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : "Save Category"}
                    </button>

                </form>

            </div>

        </div>

    );

};

export default CategoryForm;