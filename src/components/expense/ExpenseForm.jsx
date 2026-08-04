import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../api/categoryApi";

const expenseTitles = [
    "Milk",
    "Vegetables",
    "Fruits",
    "Groceries",
    "Water",
    "Rent",
    "House Rent",
    "Electricity Bill",
    "Water Bill",
    "Gas Cylinder",
    "Internet Bill",
    "Mobile Recharge",
    "Petrol",
    "Diesel",
    "CNG",
    "Bus Fare",
    "Train Fare",
    "Auto Fare",
    "Taxi Fare",
    "Parking",
    "Medicine",
    "Doctor",
    "Hospital",
    "School Fees",
    "College Fees",
    "Shopping",
    "Clothes",
    "Tea",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Travel",
    "Courier",
    "Repair",
    "Maintenance",
    "Donation",
    "Entertainment",
    "Office Expense",
    "Other"
];

const ExpenseForm = ({
    initialValues = {},
    onSubmit,
    loading = false
}) => {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        title: "",
        amount: "",
        category: "",
        paymentMode: "Cash",
        date: new Date().toISOString().split("T")[0],
        note: ""
    });

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (Object.keys(initialValues).length > 0) {
            setForm({
                title: initialValues.title || "",
                amount: initialValues.amount || "",
                category:
                    initialValues.category?._id ||
                    initialValues.category ||
                    "",
                paymentMode:
                    initialValues.paymentMode || "Cash",
                date: initialValues.date
                    ? initialValues.date.substring(0, 10)
                    : new Date().toISOString().split("T")[0],
                note: initialValues.note || ""
            });
        }
    }, [initialValues]);

    const loadCategories = async () => {
        try {
            const response = await getCategories();

            if (response.success) {
                const rows =
                    response.data.rows || response.data || [];

                setCategories(
                    rows.filter(item => item.type === "EXPENSE")
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.title.trim()) {
            alert("Title is required");
            return;
        }

        if (Number(form.amount) <= 0) {
            alert("Amount should be greater than zero");
            return;
        }

        if (!form.category) {
            alert("Please select category");
            return;
        }

        onSubmit({
            ...form,
            amount: Number(form.amount)
        });
    };

    return (
        <div className="card shadow">

            <div className="card-header d-flex justify-content-between">

                <h5 className="mb-0">
                    Expense Details
                </h5>

                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate("/expense")}
                    type="button"
                >
                    Back
                </button>

            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    {/* Title */}
                    <div className="mb-3">
                        <label className="form-label">
                            Title
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            list="expenseTitleList"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Select or type title"
                            autoComplete="off"
                            required
                        />

                        <datalist id="expenseTitleList">
                            {expenseTitles.map((title, index) => (
                                <option
                                    key={index}
                                    value={title}
                                />
                            ))}
                        </datalist>
                    </div>

                    {/* Amount */}
                    <div className="mb-3">
                        <label className="form-label">
                            Amount
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="Enter Amount"
                            required
                        />
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
                        >
                            <option value="">
                                Select Category
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

                    {/* Payment Mode */}
                    <div className="mb-3">
                        <label className="form-label">
                            Payment Mode
                        </label>

                        <select
                            className="form-select"
                            name="paymentMode"
                            value={form.paymentMode}
                            onChange={handleChange}
                        >
                            <option>Cash</option>
                            <option>UPI</option>
                            <option>Card</option>
                            <option>Bank Transfer</option>
                            <option>Cheque</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Date */}
                    <div className="mb-3">
                        <label className="form-label">
                            Date
                        </label>

                        <input
                            type="date"
                            className="form-control"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Note */}
                    <div className="mb-3">
                        <label className="form-label">
                            Note
                        </label>

                        <textarea
                            rows="3"
                            className="form-control"
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            placeholder="Enter Note"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : "Save Expense"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default ExpenseForm;
