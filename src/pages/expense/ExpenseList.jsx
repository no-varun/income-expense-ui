import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import { Link } from "react-router-dom";

import {
    deleteExpense,
    exportExpensesExcel,
    getExpenses,
    importExpensesExcel
} from "../../api/expenseApi";

import { getCategories } from "../../api/categoryApi";
import { getShops } from "../../api/shopApi";

import Pagination from "../../components/common/Pagination";

import {
    getCategoryBadgeStyle,
    getPaymentModeBadgeClass
} from "../../utils/badgeStyles";


/*
 * =====================================================
 * BANK IMAGES
 * =====================================================
 */

const bankImages = {

    Pnb: "/images/banks/pnb.png",

    Rbl: "/images/banks/rbl.png",

    icici: "/images/banks/icici.png",

    Cash: "/images/banks/cash.png",

    Other: "/images/banks/card.png"

};


/*
 * =====================================================
 * PAYMENT MODE IMAGES
 * =====================================================
 */

const PaymentModeImages = {

    Bhim: "/images/payment/Bhim.png",

    "Amazon Pay": "/images/payment/amazonpay.png",

    "Bank Transfer": "/images/payment/BankTransfer.png",

    GPay: "/images/payment/GPay.png",

    PhonePe: "/images/payment/phonepe.png",

    Paytm: "/images/payment/paytm.png",

    Cash: "/images/payment/cash.png",

    Other: "/images/payment/card.png"

};


const ExpenseList = () => {

    const fileInputRef = useRef(null);


    /*
     * =====================================================
     * DATA
     * =====================================================
     */

    const [expenses, setExpenses] = useState([]);

    const [categories, setCategories] = useState([]);

    const [shops, setShops] = useState([]);

    const [total, setTotal] = useState(0);

    const [totalAmount, setTotalAmount] = useState(0);


    /*
     * =====================================================
     * LOADING
     * =====================================================
     */

    const [loading, setLoading] = useState(true);

    const [importing, setImporting] = useState(false);

    const [exporting, setExporting] = useState(false);

    const [categoryLoading, setCategoryLoading] = useState(false);

    const [shopLoading, setShopLoading] = useState(false);


    /*
     * =====================================================
     * SEARCH
     * =====================================================
     */

    const [searchInput, setSearchInput] = useState("");

    const [search, setSearch] = useState("");


    /*
     * =====================================================
     * CATEGORY
     * =====================================================
     */

    const [categoryInput, setCategoryInput] = useState("");

    const [category, setCategory] = useState("");


    /*
     * =====================================================
     * SHOP TYPE
     * =====================================================
     */

    const [shopTypeInput, setShopTypeInput] = useState("");

    const [shopType, setShopType] = useState("");


    /*
     * =====================================================
     * SHOP
     * =====================================================
     */

    const [shopInput, setShopInput] = useState("");

    const [shop, setShop] = useState("");


    /*
     * =====================================================
     * PAYMENT MODE
     * =====================================================
     */

    const [paymentModeInput, setPaymentModeInput] = useState("");

    const [paymentMode, setPaymentMode] = useState("");


    /*
     * =====================================================
     * BANK
     * =====================================================
     */

    const [bankInput, setBankInput] = useState("");

    const [bank, setBank] = useState("");


    /*
     * =====================================================
     * DATE
     * =====================================================
     */

    const [fromDateInput, setFromDateInput] = useState("");

    const [toDateInput, setToDateInput] = useState("");

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");


    /*
     * =====================================================
     * PAGINATION
     * =====================================================
     */

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);


    /*
     * =====================================================
     * ENUM VALUES
     * =====================================================
     */

    const paymentModes = [
        "Cash",
        "Paytm",
        "PhonePe",
        "GPay",
        "Bhim",
        "Amazon Pay",
        "Bank Transfer",
        "Other"
    ];


    const banks = [
        "Pnb",
        "Rbl",
        "icici",
        "Cash",
        "Other"
    ];


    const shopTypes = [
        "ONLINE",
        "OFFLINE"
    ];


    /*
     * =====================================================
     * LOAD CATEGORIES
     * =====================================================
     */

    const loadCategories = useCallback(async () => {

        try {

            setCategoryLoading(true);

            const response = await getCategories({
                limit: 100,
                type: "EXPENSE"
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

        } finally {

            setCategoryLoading(false);

        }

    }, []);


    /*
     * =====================================================
     * LOAD SHOPS
     * =====================================================
     */

    const loadShops = useCallback(async () => {

        try {

            setShopLoading(true);

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

            setShopLoading(false);

        }

    }, []);


    /*
     * =====================================================
     * FILTER SHOPS BY TYPE
     * =====================================================
     */

    const filteredShops = shops.filter(item => {

        if (!shopTypeInput) {

            return true;

        }


        return (
            String(item.type || "").toUpperCase() ===
            String(shopTypeInput || "").toUpperCase()
        );

    });


    /*
     * =====================================================
     * LOAD EXPENSES
     * =====================================================
     */

    const loadExpense = useCallback(async () => {

        try {

            setLoading(true);


            const response = await getExpenses({

                page,

                limit,

                search,

                category,

                shopType,

                shop,

                paymentMode,

                bank,

                from: fromDate,

                to: toDate

            });


            if (response.success) {

                setExpenses(
                    response.data?.data || []
                );


                setTotal(
                    response.data?.total || 0
                );


                setTotalAmount(
                    response.data?.totalAmount || 0
                );

            } else {

                setExpenses([]);

                setTotal(0);

                setTotalAmount(0);

            }

        } catch (error) {

            console.error(
                "Expense fetch error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Unable to fetch expenses."
            );

        } finally {

            setLoading(false);

        }

    }, [

        page,

        limit,

        search,

        category,

        shopType,

        shop,

        paymentMode,

        bank,

        fromDate,

        toDate

    ]);


    /*
     * =====================================================
     * INITIAL DATA
     * =====================================================
     */

    useEffect(() => {

        loadCategories();

        loadShops();

    }, [

        loadCategories,

        loadShops

    ]);


    /*
     * =====================================================
     * LOAD EXPENSE DATA
     * =====================================================
     */

    useEffect(() => {

        loadExpense();

    }, [

        loadExpense

    ]);


    /*
     * =====================================================
     * APPLY FILTER
     * =====================================================
     */

    const handleFilter = (event) => {

        event.preventDefault();


        setSearch(
            searchInput.trim()
        );


        setCategory(
            categoryInput
        );


        setShopType(
            shopTypeInput
        );


        setShop(
            shopInput
        );


        setPaymentMode(
            paymentModeInput
        );


        setBank(
            bankInput
        );


        setFromDate(
            fromDateInput
        );


        setToDate(
            toDateInput
        );


        setPage(1);

    };


    /*
     * =====================================================
     * CLEAR FILTER
     * =====================================================
     */

    const handleClearFilter = () => {

        setSearchInput("");

        setSearch("");


        setCategoryInput("");

        setCategory("");


        setShopTypeInput("");

        setShopType("");


        setShopInput("");

        setShop("");


        setPaymentModeInput("");

        setPaymentMode("");


        setBankInput("");

        setBank("");


        setFromDateInput("");

        setToDateInput("");


        setFromDate("");

        setToDate("");


        setPage(1);

    };


    /*
     * =====================================================
     * DELETE
     * =====================================================
     */

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Delete this expense?"
            )
        ) {

            return;

        }


        try {

            const response =
                await deleteExpense(id);


            if (response.success) {

                alert(
                    response.message ||
                    "Expense deleted successfully."
                );


                loadExpense();

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Delete failed."
            );

        }

    };


    /*
     * =====================================================
     * IMPORT
     * =====================================================
     */

    const handleImportClick = () => {

        fileInputRef.current?.click();

    };


    const handleImport = async (event) => {

        const file =
            event.target.files?.[0];


        if (!file) {

            return;

        }


        try {

            setImporting(true);


            const response =
                await importExpensesExcel(file);


            if (response.success) {

                alert(
                    `${response.data.imported} expenses imported successfully.`
                );


                if (page === 1) {

                    loadExpense();

                } else {

                    setPage(1);

                }

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Import failed."
            );

        } finally {

            setImporting(false);

            event.target.value = "";

        }

    };


    /*
     * =====================================================
     * EXPORT
     * =====================================================
     */

    const handleExport = async () => {

        try {

            setExporting(true);


            const blob =
                await exportExpensesExcel({

                    search,

                    category,

                    shopType,

                    shop,

                    paymentMode,

                    bank,

                    from: fromDate,

                    to: toDate

                });


            const url =
                window.URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;


            link.download =
                "expense-export.xlsx";


            document.body.appendChild(link);


            link.click();


            link.remove();


            window.URL.revokeObjectURL(url);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Export failed."
            );

        } finally {

            setExporting(false);

        }

    };


    /*
     * =====================================================
     * PAGINATION
     * =====================================================
     */

    const totalPages =
        Math.ceil(
            total / limit
        ) || 1;


    const startRecord =
        total === 0
            ? 0
            : ((page - 1) * limit) + 1;


    const endRecord =
        Math.min(
            page * limit,
            total
        );


    /*
     * =====================================================
     * BANK IMAGE HELPER
     * =====================================================
     */

    const getBankImage = (bankName) => {

        if (!bankName) {

            return null;

        }


        return (
            bankImages[bankName] ||
            bankImages.Other
        );

    };


    /*
     * =====================================================
     * PAYMENT MODE IMAGE HELPER
     * =====================================================
     */

    const getPaymentModeImage = (paymentModeName) => {

        if (!paymentModeName) {

            return PaymentModeImages.Other;

        }


        /*
         * Exact match
         */

        if (
            PaymentModeImages[paymentModeName]
        ) {

            return PaymentModeImages[
                paymentModeName
            ];

        }


        /*
         * Case-insensitive match
         */

        const matchedMode =
            Object.keys(
                PaymentModeImages
            ).find(
                key =>
                    key.toLowerCase() ===
                    String(paymentModeName)
                        .toLowerCase()
            );


        return matchedMode
            ? PaymentModeImages[matchedMode]
            : PaymentModeImages.Other;

    };


    /*
     * =====================================================
     * RENDER
     * =====================================================
     */

    return (

        <div className="container-fluid">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">

                <div className="d-flex align-items-center gap-4">

                    <h3 className="mb-0">
                        Expense List
                    </h3>


                    <h5 className="mb-0 text-danger">

                        Total Expense: ₹{" "}

                        {Number(
                            totalAmount || 0
                        ).toLocaleString(
                            "en-IN",
                            {
                                maximumFractionDigits: 2
                            }
                        )}

                    </h5>

                </div>


                <div className="d-flex gap-2 flex-wrap">

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx"
                        className="d-none"
                        onChange={handleImport}
                    />


                    <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={handleImportClick}
                        disabled={importing}
                    >

                        {importing
                            ? "Importing..."
                            : "Import Excel"
                        }

                    </button>


                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleExport}
                        disabled={exporting}
                    >

                        {exporting
                            ? "Exporting..."
                            : "Export Excel"
                        }

                    </button>


                    <Link
                        to="/expense/add"
                        className="btn btn-primary"
                    >
                        Add Expense
                    </Link>

                </div>

            </div>


            {/* =================================================
                FILTER CARD
            ================================================= */}

            <div className="card mb-3">

                <div className="card-body">

                    <form
                        className="row g-3 align-items-end"
                        onSubmit={handleFilter}
                    >


                        {/* SEARCH */}

                        <div className="col-12 col-md-6 col-lg-2">

                            <label className="form-label">
                                Search
                            </label>


                            <input
                                type="search"
                                className="form-control"
                                value={searchInput}
                                onChange={(e) =>
                                    setSearchInput(
                                        e.target.value
                                    )
                                }
                                placeholder="Search title"
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="col-12 col-md-6 col-lg-2">

                            <label className="form-label">
                                Category
                            </label>


                            <select
                                className="form-select"
                                value={categoryInput}
                                onChange={(e) =>
                                    setCategoryInput(
                                        e.target.value
                                    )
                                }
                                disabled={categoryLoading}
                            >

                                <option value="">
                                    All Categories
                                </option>


                                {categories.map(
                                    categoryItem => (

                                        <option
                                            key={
                                                categoryItem._id
                                            }
                                            value={
                                                categoryItem._id
                                            }
                                        >

                                            {
                                                categoryItem.name
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* SHOP TYPE */}

                        <div className="col-12 col-md-6 col-lg-2">

                            <label className="form-label">
                                Shop Type
                            </label>


                            <select
                                className="form-select"
                                value={shopTypeInput}
                                onChange={(e) => {

                                    setShopTypeInput(
                                        e.target.value
                                    );

                                    setShopInput("");

                                }}
                            >

                                <option value="">
                                    All Shop Types
                                </option>


                                {shopTypes.map(type => (

                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* SHOP */}

                        <div className="col-12 col-md-6 col-lg-2">

                            <label className="form-label">
                                Shop
                            </label>


                            <select
                                className="form-select"
                                value={shopInput}
                                onChange={(e) =>
                                    setShopInput(
                                        e.target.value
                                    )
                                }
                                disabled={shopLoading}
                            >

                                <option value="">
                                    All Shops
                                </option>


                                {filteredShops.map(
                                    shopItem => (

                                        <option
                                            key={
                                                shopItem._id
                                            }
                                            value={
                                                shopItem._id
                                            }
                                        >

                                            {
                                                shopItem.name
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* PAYMENT MODE */}

                        <div className="col-12 col-md-6 col-lg-2">

                            <label className="form-label">
                                Payment Mode
                            </label>


                            <select
                                className="form-select"
                                value={paymentModeInput}
                                onChange={(e) =>
                                    setPaymentModeInput(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Payment Modes
                                </option>


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


                        {/* BANK */}

                        <div className="col-12 col-md-6 col-lg-2">

                            <label className="form-label">
                                Bank
                            </label>


                            <select
                                className="form-select"
                                value={bankInput}
                                onChange={(e) =>
                                    setBankInput(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Banks
                                </option>


                                {banks.map(
                                    bankItem => (

                                        <option
                                            key={bankItem}
                                            value={bankItem}
                                        >
                                            {bankItem}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* FROM DATE */}

                        <div className="col-6 col-md-6 col-lg-2">

                            <label className="form-label">
                                From
                            </label>


                            <input
                                type="date"
                                className="form-control"
                                value={fromDateInput}
                                onChange={(e) =>
                                    setFromDateInput(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* TO DATE */}

                        <div className="col-6 col-md-6 col-lg-2">

                            <label className="form-label">
                                To
                            </label>


                            <input
                                type="date"
                                className="form-control"
                                value={toDateInput}
                                onChange={(e) =>
                                    setToDateInput(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* PER PAGE */}

                        <div className="col-6 col-md-3 col-lg-1">

                            <label className="form-label">
                                Per Page
                            </label>


                            <select
                                className="form-select"
                                value={limit}
                                onChange={(e) => {

                                    setLimit(
                                        Number(
                                            e.target.value
                                        )
                                    );

                                    setPage(1);

                                }}
                            >

                                <option value="10">
                                    10
                                </option>

                                <option value="25">
                                    25
                                </option>

                                <option value="50">
                                    50
                                </option>

                                <option value="75">
                                    75
                                </option>

                                <option value="100">
                                    100
                                </option>

                                <option value="150">
                                    150
                                </option>

                            </select>

                        </div>


                        {/* FILTER */}

                        <div className="col-6 col-md-3 col-lg-1">

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                            >
                                Filter
                            </button>

                        </div>


                        {/* CLEAR */}

                        <div className="col-6 col-md-3 col-lg-1">

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={
                                    handleClearFilter
                                }
                            >
                                Clear
                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="card">

                <div className="card-body table-responsive">

                    <table className="table table-bordered table-hover align-middle">

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>Title</th>

                                <th>Note</th>

                                <th>Amount</th>

                                <th>Category</th>

                                <th>Shop Type</th>

                                <th>Shop</th>

                                <th>Payment Mode</th>

                                <th>Bank</th>

                                <th>Date</th>

                                <th width="170">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="11"
                                        className="text-center"
                                    >

                                        <div
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        />

                                        Loading...

                                    </td>

                                </tr>

                            ) : expenses.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="11"
                                        className="text-center text-muted py-4"
                                    >
                                        No Record Found
                                    </td>

                                </tr>

                            ) : (

                                expenses.map(
                                    (item, index) => (

                                        <tr
                                            key={
                                                item._id
                                            }
                                        >


                                            {/* # */}

                                            <td>

                                                {
                                                    (
                                                        (page - 1) *
                                                        limit
                                                    ) +
                                                    index +
                                                    1
                                                }

                                            </td>


                                            {/* TITLE */}

                                            <td>

                                                {
                                                    item.title ||
                                                    "-"
                                                }

                                            </td>


                                            {/* NOTE */}

                                            <td>

                                                {
                                                    item.note ||
                                                    "-"
                                                }

                                            </td>


                                            {/* AMOUNT */}

                                            <td>

                                                ₹{" "}

                                                {Number(
                                                    item.amount || 0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        maximumFractionDigits: 2
                                                    }
                                                )}

                                            </td>


                                            {/* CATEGORY */}

                                            <td>

                                                <span
                                                    className="badge"
                                                    style={
                                                        getCategoryBadgeStyle(
                                                            item.category
                                                        )
                                                    }
                                                >

                                                    {
                                                        item.category?.name ||
                                                        item.categoryName ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            {/* SHOP TYPE */}

                                            <td>

                                                {
                                                    item.shopType ===
                                                        "ONLINE" ? (

                                                        <span className="badge bg-primary">
                                                            ONLINE
                                                        </span>

                                                    ) : item.shopType ===
                                                        "OFFLINE" ? (

                                                        <span className="badge bg-success">
                                                            OFFLINE
                                                        </span>

                                                    ) : (

                                                        <span className="text-muted">
                                                            -
                                                        </span>

                                                    )
                                                }

                                            </td>


                                            {/* SHOP */}

                                            <td>

                                                {
                                                    item.shop?.name ||
                                                    item.shopName ||
                                                    "-"
                                                }

                                            </td>


                                            {/* PAYMENT MODE */}

                                            <td>

                                                {item.paymentMode ? (

                                                    <div
                                                        className="d-flex align-items-center gap-2"
                                                        style={{
                                                            minWidth: "130px"
                                                        }}
                                                    >

                                                        <img
                                                            src={
                                                                getPaymentModeImage(
                                                                    item.paymentMode
                                                                )
                                                            }
                                                            alt={
                                                                item.paymentMode
                                                            }
                                                            title={
                                                                item.paymentMode
                                                            }
                                                            style={{
                                                                width: "45px",
                                                                height: "45px",
                                                                objectFit: "contain",
                                                                borderRadius: "6px",
                                                                flexShrink: 0
                                                            }}
                                                            onError={(e) => {

                                                                e.currentTarget.src =
                                                                    PaymentModeImages.Other;

                                                            }}
                                                        />


                                                        <span
                                                            className={
                                                                getPaymentModeBadgeClass(
                                                                    item.paymentMode
                                                                )
                                                            }
                                                        >

                                                            {
                                                                item.paymentMode
                                                            }

                                                        </span>

                                                    </div>

                                                ) : (

                                                    <span className="text-muted">
                                                        -
                                                    </span>

                                                )}

                                            </td>


                                            {/* BANK IMAGE */}

                                            <td>

                                                {item.bank ? (

                                                    <div
                                                        className="d-flex align-items-center"
                                                        style={{
                                                            minWidth: "80px"
                                                        }}
                                                    >

                                                        <img
                                                            src={
                                                                getBankImage(
                                                                    item.bank
                                                                )
                                                            }
                                                            alt={
                                                                item.bank
                                                            }
                                                            title={
                                                                item.bank
                                                            }
                                                            style={{
                                                                width: "50px",
                                                                height: "45px",
                                                                objectFit: "contain"
                                                            }}
                                                            onError={(e) => {

                                                                e.currentTarget.src =
                                                                    bankImages.Other;

                                                            }}
                                                        />

                                                    </div>

                                                ) : (

                                                    <span className="text-muted">
                                                        -
                                                    </span>

                                                )}

                                            </td>


                                            {/* DATE */}

                                            <td>

                                                {
                                                    item.date
                                                        ? new Date(
                                                            item.date
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )
                                                        : "-"
                                                }

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                <Link
                                                    className="btn btn-warning btn-sm me-2"
                                                    to={
                                                        `/expense/edit/${item._id}`
                                                    }
                                                >
                                                    Edit
                                                </Link>


                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        handleDelete(
                                                            item._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    PAGINATION
                ================================================= */}

                <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2 bg-white">

                    <small className="text-muted">

                        Showing{" "}

                        {startRecord}

                        {" "}to{" "}

                        {endRecord}

                        {" "}of{" "}

                        {total}

                        {" "}records

                    </small>


                    <Pagination
                        page={page}
                        limit={limit}
                        total={total}
                        onPageChange={
                            (nextPage) => {

                                if (
                                    nextPage >= 1 &&
                                    nextPage <= totalPages
                                ) {

                                    setPage(
                                        nextPage
                                    );

                                }

                            }
                        }
                    />

                </div>

            </div>

        </div>

    );

};


export default ExpenseList;