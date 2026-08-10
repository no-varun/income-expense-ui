import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../api/categoryApi";

const ItemForm = ({
    initialValues = {},
    onSubmit,
    loading = false
}) => {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        name: "",
        type: "",
        category: "",
        description: "",
        status: true
    });

    const loadCategories = async (type = "") => {

        try {

            const params = {
                limit: 100
            };

            // Send type only when selected
            if (type) {
                params.type = type;
            }

            const response = await getCategories(params);

            if (response.success) {
                setCategories(
                    response.data.rows ||
                    response.data.data ||
                    []
                );
            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to load categories."
            );

        }

    };

    // Load all categories initially
    useEffect(() => {

        loadCategories();

    }, []);

    // Load initial values when editing
    useEffect(() => {

        if (Object.keys(initialValues).length > 0) {

            const initialType =
                initialValues.type || "";

            setForm({
                name: initialValues.name || "",
                type: initialType,
                category:
                    initialValues.category?._id ||
                    initialValues.category ||
                    "",
                description:
                    initialValues.description || "",
                status:
                    initialValues.status ?? true
            });

            // Load categories according to existing type
            loadCategories(initialType);
        }

    }, [initialValues]);

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;

        // When category type changes
        if (name === "type") {

            setForm(prev => ({
                ...prev,
                type: value,
                category: ""
            }));

            loadCategories(value);

            return;
        }

        setForm(prev => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));

    };

    const handleSubmit = (event) => {

        event.preventDefault();

        if (!form.name.trim()) {
            alert("Item name is required.");
            return;
        }

        if (!form.type) {
            alert("Category type is required.");
            return;
        }

        if (!form.category) {
            alert("Category is required.");
            return;
        }

        onSubmit({
            ...form,
            name: form.name.trim(),
            description: form.description.trim()
        });

    };

    return (

        <div className="card shadow">

            <div className="card-header d-flex justify-content-between align-items-center">

                <h5 className="mb-0">
                    Item Details
                </h5>

                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate("/items")}
                >
                    Back
                </button>

            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    {/* Item Name */}
                    <div className="mb-3">

                        <label className="form-label">
                            Item Name
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter item name"
                            required
                        />

                    </div>

                    {/* Category Type */}
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

                            <option value="">
                                Select category type
                            </option>

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

                    {/* Category */}
                    <div className="mb-3">

                        <label className="form-label">
                            Category
                        </label>

                        <select
                            className="form-select"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                            disabled={!form.type}
                        >

                            <option value="">
                                {
                                    form.type
                                        ? "Select category"
                                        : "Select category type first"
                                }
                            </option>

                            {categories.map(category => (

                                <option
                                    key={category._id}
                                    value={category._id}
                                >
                                    {category.name}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* Description */}
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

                    {/* Status */}
                    <div className="form-check form-switch mb-3">

                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="itemStatus"
                            name="status"
                            checked={form.status}
                            onChange={handleChange}
                        />

                        <label
                            className="form-check-label"
                            htmlFor="itemStatus"
                        >
                            Active
                        </label>

                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : "Save Item"
                        }
                    </button>

                </form>

            </div>

        </div>

    );
};

export default ItemForm;