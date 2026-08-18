import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCategories } from "../../api/categoryApi";
import { getItems } from "../../api/itemApi";
import { getShops } from "../../api/shopApi";

const IncomeForm = ({
    initialValues = {},
    onSubmit,
    loading = false
}) => {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [shops, setShops] = useState([]);

    const [itemsLoading, setItemsLoading] = useState(false);
    const [shopsLoading, setShopsLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        itemId: "",
        amount: "",
        category: "",
        shopType: "",
        shop: "",
        paymentMode: "Cash",
        bank: "icici",
        date: new Date().toISOString().split("T")[0],
        note: ""
    });


    /*
     * =====================================================
     * LOAD CATEGORIES
     * =====================================================
     */

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const response = await getCategories({
                    limit: 100,
                    type: "INCOME"
                });

                if (response.success) {

                    const rows =
                        response.data?.rows ||
                        response.data?.data?.rows ||
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
     * =====================================================
     * LOAD SHOPS
     * =====================================================
     */

    useEffect(() => {

        const loadShops = async () => {

            try {

                setShopsLoading(true);

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
                    "Shop fetch error:",
                    error
                );

                setShops([]);

            } finally {

                setShopsLoading(false);

            }

        };

        loadShops();

    }, []);


    /*
     * =====================================================
     * LOAD ITEMS BY CATEGORY
     * =====================================================
     */

    const loadItems = async (categoryId) => {

        try {

            if (!categoryId) {

                setItems([]);

                return [];

            }

            setItemsLoading(true);

            setItems([]);

            const response = await getItems({

                limit: 1000,

                category: categoryId,

                type: "INCOME",

                status: true

            });


            if (response.success) {

                const rows =
                    response.data?.rows ||
                    response.data?.data?.rows ||
                    response.data?.data ||
                    response.data ||
                    [];

                const itemRows =
                    Array.isArray(rows)
                        ? rows
                        : [];

                setItems(itemRows);

                return itemRows;

            }

            setItems([]);

            return [];

        } catch (error) {

            console.error(
                "Item fetch error:",
                error
            );

            setItems([]);

            return [];

        } finally {

            setItemsLoading(false);

        }

    };


    /*
     * =====================================================
     * EDIT MODE
     * =====================================================
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


        const shopType =
            initialValues.shopType ||
            initialValues.shop?.type ||
            "";


        const title =
            initialValues.title ||
            "";


        const itemId =
            initialValues.item?._id ||
            initialValues.itemId ||
            "";


        setForm({

            title,

            itemId,

            amount:
                initialValues.amount ?? "",

            category:
                categoryId,

            shopType:
                shopType,

            shop:
                shopId,

            paymentMode:
                initialValues.paymentMode ||
                "Cash",

            bank:
                initialValues.bank ||
                "icici",

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


        /*
         * Load items for existing category
         */

        if (categoryId) {

            loadItems(categoryId);

        } else {

            setItems([]);

        }

    }, [initialValues]);


    /*
     * =====================================================
     * HANDLE NORMAL CHANGE
     * =====================================================
     */

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        /*
         * SHOP TYPE CHANGE
         */

        if (name === "shopType") {

            setForm(prev => ({

                ...prev,

                shopType: value,

                shop: ""

            }));

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
     * =====================================================
     * CATEGORY CHANGE
     * =====================================================
     */

    const handleCategoryChange = async (e) => {

        const categoryId =
            e.target.value;


        setForm(prev => ({

            ...prev,

            category: categoryId,

            title: "",

            itemId: ""

        }));


        setItems([]);


        if (categoryId) {

            await loadItems(categoryId);

        }

    };


    /*
     * =====================================================
     * ITEM CHANGE
     * =====================================================
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

            itemId,

            title:
                selectedItem?.name ||
                ""

        }));

    };


    /*
     * =====================================================
     * FILTER SHOPS BY SHOP TYPE
     * =====================================================
     */

    const filteredShops = shops.filter(shop => {

        if (!form.shopType) {

            return false;

        }


        return (
            String(shop.type).toUpperCase() ===
            String(form.shopType).toUpperCase()
        );

    });


    /*
     * =====================================================
     * SUBMIT
     * =====================================================
     */

    const handleSubmit = (e) => {

        e.preventDefault();


        if (!form.category) {

            alert(
                "Please select category"
            );

            return;

        }


        if (
            !form.itemId &&
            !form.title.trim()
        ) {

            alert(
                "Please select item"
            );

            return;

        }


        if (!form.shopType) {

            alert(
                "Please select Shop Type"
            );

            return;

        }


        if (!form.shop) {

            alert(
                "Please select Shop"
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


        onSubmit({

            ...form,

            amount:
                Number(form.amount)

        });

    };


    /*
     * =====================================================
     * SELECTED ITEM
     * =====================================================
     */

    const selectedItemId =
        form.itemId ||
        items.find(
            item =>
                item.name ===
                form.title
        )?._id ||
        "";


    return (

        <div className="card shadow">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="card-header d-flex justify-content-between align-items-center">

                <h5 className="mb-0">
                    Income Details
                </h5>


                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                        navigate("/income")
                    }
                >
                    Back
                </button>

            </div>


            <div className="card-body">

                <form onSubmit={handleSubmit}>


                    {/* =================================================
                        SHOP TYPE
                    ================================================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Shop Type
                        </label>


                        <select
                            className="form-select"
                            name="shopType"
                            value={form.shopType}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Shop Type
                            </option>


                            <option value="ONLINE">
                                ONLINE
                            </option>


                            <option value="OFFLINE">
                                OFFLINE
                            </option>

                        </select>

                    </div>


                    {/* =================================================
                        SHOP
                    ================================================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Shop
                        </label>


                        <select
                            className="form-select"
                            name="shop"
                            value={form.shop}
                            onChange={handleChange}
                            disabled={
                                !form.shopType ||
                                shopsLoading
                            }
                            required
                        >

                            <option value="">

                                {shopsLoading

                                    ? "Loading shops..."

                                    : !form.shopType

                                        ? "First select shop type"

                                        : filteredShops.length === 0

                                            ? "No shops found"

                                            : "Select Shop"

                                }

                            </option>


                            {filteredShops.map(shop => (

                                <option
                                    key={shop._id}
                                    value={shop._id}
                                >

                                    {shop.name}

                                </option>

                            ))}

                        </select>


                        {form.shopType &&
                            !shopsLoading &&
                            filteredShops.length === 0 && (

                                <small className="text-danger">

                                    No{" "}
                                    {form.shopType}
                                    {" "}shops available

                                </small>

                            )}

                    </div>


                    {/* =================================================
                        CATEGORY
                    ================================================= */}

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


                    {/* =================================================
                        ITEM
                    ================================================= */}

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

                                            : "Select Item"

                                }

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


                    {/* =================================================
                        AMOUNT
                    ================================================= */}

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


                    {/* =================================================
                        PAYMENT MODE
                    ================================================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Payment Mode
                        </label>


                        <select
                            className="form-select"
                            name="paymentMode"
                            value={form.paymentMode}
                            onChange={handleChange}
                            required
                        >

                            <option value="Cash">
                                Cash
                            </option>

                            <option value="Paytm">
                                Paytm
                            </option>

                            <option value="PhonePe">
                                PhonePe
                            </option>

                            <option value="GPay">
                                GPay
                            </option>

                            <option value="Bhim">
                                Bhim
                            </option>

                            <option value="Amazon Pay">
                                Amazon Pay
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    {/* =================================================
                        BANK
                    ================================================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Bank
                        </label>


                        <select
                            className="form-select"
                            name="bank"
                            value={form.bank}
                            onChange={handleChange}
                            required
                        >

                            <option value="Pnb">
                                Pnb
                            </option>

                            <option value="Rbl">
                                Rbl
                            </option>

                            <option value="icici">
                                icici
                            </option>

                            <option value="Cash">
                                Cash
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    {/* =================================================
                        DATE
                    ================================================= */}

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


                    {/* =================================================
                        NOTE
                    ================================================= */}

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
                            placeholder="Enter note"
                        />

                    </div>


                    {/* =================================================
                        SUBMIT
                    ================================================= */}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={
                            loading ||
                            itemsLoading ||
                            shopsLoading
                        }
                    >

                        {loading
                            ? "Please wait..."
                            : "Save Income"
                        }

                    </button>

                </form>

            </div>

        </div>

    );

};

export default IncomeForm;