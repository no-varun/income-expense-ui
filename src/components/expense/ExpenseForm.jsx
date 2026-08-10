import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCategories } from "../../api/categoryApi";
import { getItems } from "../../api/itemApi";

const ExpenseForm = ({
    initialValues = {},
    onSubmit,
    loading = false
}) => {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [items, setItems] = useState([]);

    const [form, setForm] = useState({

        title: "",

        amount: "",

        category: "",

        paymentMode: "UPI",

        date: new Date().toISOString().split("T")[0],

        note: ""

    });

    useEffect(() => {

        loadCategories();

    }, []);

    useEffect(() => {

        if (Object.keys(initialValues).length > 0) {

            const categoryId =
                initialValues.category?._id ||
                initialValues.category ||
                "";

            setForm({

                title: initialValues.title || "",

                amount: initialValues.amount || "",

                category: categoryId,

                paymentMode:
                    initialValues.paymentMode || "UPI",

                date: initialValues.date
                    ? initialValues.date.substring(0, 10)
                    : new Date().toISOString().split("T")[0],

                note: initialValues.note || ""

            });

            if (categoryId) {

                loadItems(categoryId);

            }

        }

    }, [initialValues]);

    const loadCategories = async () => {

        try {

            const response = await getCategories({

                limit: 100,

                type: "EXPENSE"

            });

            if (response.success) {

                const rows =
                    response.data.rows ||
                    response.data.data ||
                    response.data ||
                    [];

                setCategories(rows);

            }

        } catch (error) {

            console.log(error);

        }

    };

    const loadItems = async (categoryId) => {

        try {

            if (!categoryId) {

                setItems([]);

                return;

            }

            const response = await getItems({

                limit: 100,

                status: true,

                category: categoryId,

                type: "EXPENSE",

            });

            if (response.success) {

                const rows =
                    response.data.rows ||
                    response.data.data?.rows ||
                    response.data.data ||
                    response.data ||
                    [];

                setItems(rows);

            }

        } catch (error) {

            console.log(error);

        }

    };

    const handleChange = async (e) => {

        const { name, value } = e.target;

        const nextForm = {

            ...form,

            [name]: value

        };

        if (name === "category") {

            nextForm.title = "";

            setForm(nextForm);

            await loadItems(value);

            return;

        }

        setForm(nextForm);

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!form.title) {

            alert("Please select Item");

            return;

        }

        if (!form.category) {

            alert("Please select Category");

            return;

        }

        if (Number(form.amount) <= 0) {

            alert("Amount must be greater than zero");

            return;

        }

        onSubmit({

            ...form,

            amount: Number(form.amount)

        });

    };

    return (

        <div className="card shadow">

            <div className="card-header d-flex justify-content-between align-items-center">

                <h5 className="mb-0">

                    Expense Details

                </h5>

                <button

                    type="button"

                    className="btn btn-secondary btn-sm"

                    onClick={() => navigate("/expense")}

                >

                    Back

                </button>

            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

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

                            {

                                categories.map(category => (

                                    <option

                                        key={category._id}

                                        value={category._id}

                                    >

                                        {category.name}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div className="mb-3">

                        <label className="form-label">

                            Item

                        </label>

                        <select

                            className="form-select"

                            name="title"

                            value={form.title}

                            onChange={handleChange}

                            required

                            disabled={!form.category}

                        >

                            <option value="">

                                Select Item

                            </option>

                            {

                                items.map(item => (

                                    <option

                                        key={item._id}

                                        value={item.name}

                                    >

                                        {item.name}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

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

                            required

                        />

                    </div>

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

                            <option>UPI</option>
                            <option>Cash</option>
                            <option>Card</option>

                            <option>Bank Transfer</option>

                            <option>Cheque</option>

                            <option>Other</option>

                        </select>

                    </div>

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

                    <div className="mb-3">

                        <label className="form-label">

                            Note

                        </label>

                        <textarea

                            className="form-control"

                            rows="3"

                            name="note"

                            value={form.note}

                            onChange={handleChange}

                        />

                    </div>

                    <button

                        className="btn btn-primary"

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Please wait..."

                                : "Save Expense"

                        }

                    </button>

                </form>

            </div>

        </div>

    );

};

export default ExpenseForm;