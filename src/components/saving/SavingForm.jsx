import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCategories } from "../../api/categoryApi";
import { getItems } from "../../api/itemApi";

const SavingForm = ({
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
        category: "",
        paymentMode: "Cash",
        date: new Date().toISOString().split("T")[0],
        note: ""

    });


    /*
     * Load Saving Categories
     */
    useEffect(() => {

        loadCategories();

    }, []);


    /*
     * Edit Mode
     */
    useEffect(() => {

        if (Object.keys(initialValues).length > 0) {

            const categoryId =
                initialValues.category?._id ||
                initialValues.category ||
                "";

            setForm({

                title:
                    initialValues.title || "",

                amount:
                    initialValues.amount || "",

                category:
                    categoryId,

                paymentMode:
                    initialValues.paymentMode || "Cash",

                date:
                    initialValues.date
                        ? initialValues.date.substring(0, 10)
                        : new Date()
                            .toISOString()
                            .split("T")[0],

                note:
                    initialValues.note || ""

            });

            /*
             * Fetch items for existing category
             */
            if (categoryId) {
                loadItems(categoryId);
            }

        }

    }, [initialValues]);


    /*
     * Fetch Saving Categories
     */
    const loadCategories = async () => {

        try {

            const response = await getCategories({

                limit: 100,

                type: "SAVING"

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

            console.error(
                "Category fetch error:",
                error
            );

        }

    };


    /*
     * Fetch Items According To Category
     */
    const loadItems = async (categoryId) => {

        try {

            setItemsLoading(true);

            setItems([]);

            const response = await getItems({

                limit: 1000,

                category: categoryId,

                type: "SAVING",

                status: true

            });

            if (response.success) {

                const rows =
                    response.data.data ||
                    response.data.rows ||
                    response.data ||
                    [];

                setItems(rows);

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
     * Category Change
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
     * Item Change
     *
     * Selected item name becomes title
     */
    const handleItemChange = (e) => {

        const itemId =
            e.target.value;

        const selectedItem =
            items.find(
                item => item._id === itemId
            );

        setForm(prev => ({

            ...prev,

            title:
                selectedItem?.name || ""

        }));

    };


    /*
     * Normal Input Change
     */
    const handleChange = (e) => {

        setForm(prev => ({

            ...prev,

            [e.target.name]:
                e.target.value

        }));

    };


    /*
     * Submit
     */
    const handleSubmit = (e) => {

        e.preventDefault();


        if (!form.title.trim()) {

            alert("Please select item");

            return;

        }


        if (!form.category) {

            alert(
                "Please select category"
            );

            return;

        }


        onSubmit({

            ...form,

            amount:
                Number(form.amount)

        });

    };


    /*
     * Find selected item for Edit Mode
     */
    const selectedItemId =
        items.find(
            item => item.name === form.title
        )?._id || "";


    return (

        <div className="card shadow">

            {/* ================= HEADER ================= */}

            <div className="card-header d-flex justify-content-between">

                <h5 className="mb-0">

                    Saving Details

                </h5>


                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                        navigate("/saving")
                    }
                    type="button"
                >

                    Back

                </button>

            </div>


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
                            value={selectedItemId}
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
                                            : "Select Item"}

                            </option>


                            {items.map(item => (

                                <option
                                    key={item._id}
                                    value={item._id}
                                >

                                    {item.name}

                                </option>

                            ))}

                        </select>

                    </div>


                    {/* ================= AMOUNT ================= */}

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
                            min="0"
                            step="0.01"
                        />

                    </div>


                    {/* ================= PAYMENT MODE ================= */}

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

                            <option>
                                Cash
                            </option>

                            <option>
                                UPI
                            </option>

                            <option>
                                Card
                            </option>

                            <option>
                                Bank Transfer
                            </option>

                            <option>
                                Cheque
                            </option>

                            <option>
                                Other
                            </option>

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
                            value={form.date}
                            onChange={handleChange}
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
                            value={form.note}
                            onChange={handleChange}
                        />

                    </div>


                    {/* ================= SUBMIT ================= */}

                    <button
                        className="btn btn-primary"
                        disabled={
                            loading ||
                            itemsLoading
                        }
                    >

                        {loading
                            ? "Please wait..."
                            : "Save Saving"}

                    </button>

                </form>

            </div>

        </div>

    );

};

export default SavingForm;
