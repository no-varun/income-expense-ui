import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCategories } from "../../api/categoryApi";
import { getItems } from "../../api/itemApi";
import { getShops } from "../../api/shopApi";

const ExpenseForm = ({
    initialValues = {},
    onSubmit,
    loading = false
}) => {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [shops, setShops] = useState([]);

    const [form, setForm] = useState({
        title: "",
        amount: "",
        category: "",
        shop: "",
        paymentMode: "UPI",
        date: new Date().toISOString().split("T")[0],
        note: ""
    });


    /*
     * =========================
     * LOAD CATEGORIES
     * =========================
     */

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const response = await getCategories({
                    limit: 100,
                    type: "EXPENSE"
                });

                if (response.success) {

                    const rows =
                        response.data?.rows ||
                        response.data?.data ||
                        response.data ||
                        [];

                    setCategories(
                        Array.isArray(rows)
                            ? rows
                            : []
                    );

                }

            } catch (error) {

                console.error(
                    "Category load error:",
                    error
                );

            }

        };

        loadCategories();

    }, []);


    /*
     * =========================
     * LOAD SHOPS
     * =========================
     */

    useEffect(() => {

        const loadShops = async () => {

            try {

                const response = await getShops({
                    limit: 100,
                    status: true
                });

                if (response.success) {

                    const rows =
                        response.data?.rows ||
                        response.data?.data?.rows ||
                        response.data?.data ||
                        response.data ||
                        [];

                    setShops(
                        Array.isArray(rows)
                            ? rows
                            : []
                    );

                } else {

                    setShops([]);

                }

            } catch (error) {

                console.error(
                    "Shop load error:",
                    error
                );

                setShops([]);

            }

        };

        loadShops();

    }, []);


    /*
     * =========================
     * LOAD ITEMS BY CATEGORY
     * =========================
     */

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

                type: "EXPENSE"

            });


            if (response.success) {

                const rows =
                    response.data?.rows ||
                    response.data?.data?.rows ||
                    response.data?.data ||
                    response.data ||
                    [];

                setItems(
                    Array.isArray(rows)
                        ? rows
                        : []
                );

            } else {

                setItems([]);

            }

        } catch (error) {

            console.error(
                "Item load error:",
                error
            );

            setItems([]);

        }

    };


    /*
     * =========================
     * EDIT MODE
     * =========================
     */

    useEffect(() => {

        if (
            !initialValues ||
            Object.keys(initialValues).length === 0
        ) {

            return;

        }


        const categoryId =
            initialValues.category?._id ||
            initialValues.category ||
            "";


        const shopId =
            initialValues.shop?._id ||
            initialValues.shop ||
            "";


        setForm({

            title:
                initialValues.title ||
                "",

            amount:
                initialValues.amount ??
                "",

            category:
                categoryId,

            shop:
                shopId,

            paymentMode:
                initialValues.paymentMode ||
                "UPI",

            date:
                initialValues.date
                    ? initialValues.date.substring(0, 10)
                    : new Date()
                        .toISOString()
                        .split("T")[0],

            note:
                initialValues.note ||
                ""

        });


        if (categoryId) {

            loadItems(categoryId);

        } else {

            setItems([]);

        }

    }, [initialValues]);


    /*
     * =========================
     * HANDLE CHANGE
     * =========================
     */

    const handleChange = async (e) => {

        const {
            name,
            value
        } = e.target;


        /*
         * CATEGORY CHANGED
         */

        if (name === "category") {

            setForm(prev => ({

                ...prev,

                category: value,

                title: ""

            }));


            await loadItems(value);

            return;

        }


        /*
         * NORMAL FIELD
         */

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


        if (!form.category) {

            alert(
                "Please select Category"
            );

            return;

        }


        if (!form.shop) {

            alert(
                "Please select Shop"
            );

            return;

        }


        if (!form.title) {

            alert(
                "Please select Item"
            );

            return;

        }


        if (
            !form.amount ||
            Number(form.amount) <= 0
        ) {

            alert(
                "Amount must be greater than zero"
            );

            return;

        }


        onSubmit({

            ...form,

            amount: Number(form.amount)

        });

    };


    return (

        <div className="card shadow">

            {/* =========================
                HEADER
            ========================= */}

            <div className="card-header d-flex justify-content-between align-items-center">

                <h5 className="mb-0">
                    Expense Details
                </h5>

                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                        navigate("/expense")
                    }
                >
                    Back
                </button>

            </div>


            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    {/* =========================
                        SHOP
                    ========================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Shop
                        </label>

                        <select
                            className="form-select"
                            name="shop"
                            value={form.shop}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Shop
                            </option>

                            {shops.map(shop => (

                                <option
                                    key={shop._id}
                                    value={shop._id}
                                >
                                    {shop.name}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* =========================
                        CATEGORY
                    ========================= */}

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


                    {/* =========================
                        ITEM
                    ========================= */}

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

                                {form.category
                                    ? "Select Item"
                                    : "Select Category First"}

                            </option>

                            {items.map(item => (

                                <option
                                    key={item._id}
                                    value={item.name}
                                >
                                    {item.name}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* =========================
                        AMOUNT
                    ========================= */}

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
                            min="0"
                            step="0.01"
                            required
                        />

                    </div>


                    {/* =========================
                        PAYMENT MODE
                    ========================= */}

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

                            <option value="UPI">
                                UPI
                            </option>

                            <option value="Cash">
                                Cash
                            </option>

                            <option value="Card">
                                Card
                            </option>

                            <option value="Bank Transfer">
                                Bank Transfer
                            </option>

                            <option value="Cheque">
                                Cheque
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    {/* =========================
                        DATE
                    ========================= */}

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


                    {/* =========================
                        NOTE
                    ========================= */}

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
                            placeholder="Enter note"
                        />

                    </div>


                    {/* =========================
                        SUBMIT
                    ========================= */}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >

                        {loading
                            ? "Please wait..."
                            : "Save Expense"}

                    </button>

                </form>

            </div>

        </div>

    );

};

export default ExpenseForm;