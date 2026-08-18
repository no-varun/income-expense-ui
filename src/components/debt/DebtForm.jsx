import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCategories } from "../../api/categoryApi";
import { getItems } from "../../api/itemApi";

const DebtForm = ({
    initialValues = {},
    onSubmit,
    loading = false
}) => {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        amount: "",
        pendingAmount: "",
        category: "",
        paymentMode: "Cash",
        bank: "Cash",
        date: new Date().toISOString().split("T")[0],
        note: ""
    });


    /*
     * ============================
     * PAYMENT MODES
     * ============================
     */

    const paymentModes = [
        "Cash",
        "Paytm",
        "PhonePe",
        "GPay",
        "Bhim",
        "Amazon Pay",
        "Other"
    ];


    /*
     * ============================
     * BANKS
     * ============================
     */

    const banks = [
        "Pnb",
        "Rbl",
        "icici",
        "Cash",
        "Other"
    ];


    /*
     * ============================
     * LOAD DEBT CATEGORIES
     * ============================
     */

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const response = await getCategories({
                    limit: 100,
                    type: "DEBT"
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

                } else {

                    setCategories([]);

                }

            } catch (error) {

                console.error(
                    "Category fetch error:",
                    error
                );

                setCategories([]);

            }

        };

        loadCategories();

    }, []);


    /*
     * ============================
     * LOAD ITEMS BY CATEGORY
     * ============================
     */

    const loadItems = async (categoryId) => {

        if (!categoryId) {

            setItems([]);

            return;

        }

        try {

            setItemsLoading(true);

            setItems([]);

            const response = await getItems({

                limit: 1000,

                category: categoryId,

                type: "DEBT",

                status: true

            });

            if (response.success) {

                const rows =
                    response.data?.data ||
                    response.data?.rows ||
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
                "Item fetch error:",
                error
            );

            setItems([]);

        } finally {

            setItemsLoading(false);

        }

    };


    /*
     * ============================
     * EDIT MODE
     * ============================
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

        const amount =
            initialValues.amount ?? "";

        const pendingAmount =
            initialValues.pendingAmount ??
            amount;

        setForm({

            title:
                initialValues.title ||
                "",

            amount,

            pendingAmount,

            category:
                categoryId,

            paymentMode:
                initialValues.paymentMode ||
                "Cash",

            bank:
                initialValues.bank ||
                "Cash",

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
     * ============================
     * CATEGORY CHANGE
     * ============================
     */

    const handleCategoryChange = async (e) => {

        const categoryId =
            e.target.value;

        setForm(prev => ({

            ...prev,

            category: categoryId,

            title: ""

        }));

        setItems([]);

        if (categoryId) {

            await loadItems(categoryId);

        }

    };


    /*
     * ============================
     * ITEM CHANGE
     * ============================
     */

    const handleItemChange = (e) => {

        const itemId =
            e.target.value;

        const selectedItem =
            items.find(
                item =>
                    String(item._id) ===
                    String(itemId)
            );

        setForm(prev => ({

            ...prev,

            title:
                selectedItem?.name ||
                ""

        }));

    };


    /*
     * ============================
     * NORMAL INPUT CHANGE
     * ============================
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
     * ============================
     * SUBMIT
     * ============================
     */

    const handleSubmit = (e) => {

        e.preventDefault();


        if (!form.category) {

            alert(
                "Please select category"
            );

            return;

        }


        if (!form.title.trim()) {

            alert(
                "Please select item"
            );

            return;

        }


        if (
            !form.amount ||
            Number(form.amount) <= 0
        ) {

            alert(
                "Amount should be greater than zero"
            );

            return;

        }


        if (
            form.pendingAmount === "" ||
            Number(form.pendingAmount) < 0
        ) {

            alert(
                "Please enter valid pending amount"
            );

            return;

        }


        if (
            Number(form.pendingAmount) >
            Number(form.amount)
        ) {

            alert(
                "Pending amount cannot be greater than total amount"
            );

            return;

        }


        onSubmit({

            ...form,

            amount:
                Number(form.amount),

            pendingAmount:
                Number(form.pendingAmount)

        });

    };


    /*
     * ============================
     * SELECTED ITEM
     * ============================
     */

    const selectedItemId =
        items.find(
            item =>
                item.name ===
                form.title
        )?._id || "";


    return (

        <div className="card shadow">


            {/* ================= HEADER ================= */}

            <div className="card-header d-flex justify-content-between align-items-center">

                <h5 className="mb-0">
                    Debt Details
                </h5>


                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                        navigate("/debt")
                    }
                >
                    Back
                </button>

            </div>


            {/* ================= BODY ================= */}

            <div className="card-body">

                <form onSubmit={handleSubmit}>


                    {/* ================= CATEGORY ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Category
                        </label>


                        <select
                            className="form-select"
                            name="category"
                            value={form.category}
                            onChange={
                                handleCategoryChange
                            }
                            required
                        >

                            <option value="">
                                Select Category
                            </option>


                            {categories.map(
                                category => (

                                    <option
                                        key={
                                            category._id
                                        }
                                        value={
                                            category._id
                                        }
                                    >

                                        {
                                            category.name
                                        }

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* ================= ITEM ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Item
                        </label>


                        <select
                            className="form-select"
                            value={
                                selectedItemId
                            }
                            onChange={
                                handleItemChange
                            }
                            disabled={
                                !form.category ||
                                itemsLoading
                            }
                            required
                        >

                            <option value="">

                                {itemsLoading
                                    ? "Loading items..."
                                    : !form.category
                                        ? "First select category"
                                        : items.length === 0
                                            ? "No items found"
                                            : "Select Item"
                                }

                            </option>


                            {items.map(item => (

                                <option
                                    key={
                                        item._id
                                    }
                                    value={
                                        item._id
                                    }
                                >

                                    {
                                        item.name
                                    }

                                </option>

                            ))}

                        </select>

                    </div>


                    {/* ================= TOTAL AMOUNT ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Total Amount
                        </label>


                        <input
                            type="number"
                            className="form-control"
                            name="amount"
                            value={
                                form.amount
                            }
                            onChange={
                                handleChange
                            }
                            min="0"
                            step="0.01"
                            required
                        />

                    </div>


                    {/* ================= PENDING AMOUNT ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Pending Amount
                        </label>


                        <input
                            type="number"
                            className="form-control"
                            name="pendingAmount"
                            value={
                                form.pendingAmount
                            }
                            onChange={
                                handleChange
                            }
                            min="0"
                            step="0.01"
                            max={
                                form.amount ||
                                undefined
                            }
                            required
                        />


                        {form.amount !== "" && (
                            <small className="text-muted">

                                Recovered Amount: ₹{" "}

                                {Math.max(
                                    0,
                                    Number(
                                        form.amount || 0
                                    ) -
                                    Number(
                                        form.pendingAmount || 0
                                    )
                                ).toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}

                            </small>
                        )}

                    </div>


                    {/* ================= PAYMENT MODE ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Payment Mode
                        </label>


                        <select
                            className="form-select"
                            name="paymentMode"
                            value={
                                form.paymentMode
                            }
                            onChange={
                                handleChange
                            }
                            required
                        >

                            {paymentModes.map(
                                mode => (

                                    <option
                                        key={mode}
                                        value={mode}
                                    >

                                        {mode}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* ================= BANK ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Bank
                        </label>


                        <select
                            className="form-select"
                            name="bank"
                            value={
                                form.bank
                            }
                            onChange={
                                handleChange
                            }
                            required
                        >

                            {banks.map(
                                bank => (

                                    <option
                                        key={bank}
                                        value={bank}
                                    >

                                        {bank}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* ================= DATE ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Date
                        </label>


                        <input
                            type="date"
                            className="form-control"
                            name="date"
                            value={
                                form.date
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </div>


                    {/* ================= NOTE ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Note
                        </label>


                        <textarea
                            rows="3"
                            className="form-control"
                            name="note"
                            value={
                                form.note
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter note"
                        />

                    </div>


                    {/* ================= SUBMIT ================= */}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={
                            loading ||
                            itemsLoading
                        }
                    >

                        {loading
                            ? "Please wait..."
                            : "Save Debt"
                        }

                    </button>

                </form>

            </div>

        </div>

    );

};

export default DebtForm;