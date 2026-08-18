import {
    useCallback,
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

import {
    getIncomes,
    deleteIncome
} from "../../api/incomeApi";

import { getCategories } from "../../api/categoryApi";

import Pagination from "../../components/common/Pagination";

import {
    getCategoryBadgeStyle
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

    Cash: "/images/payment/cash.png",

    Paytm: "/images/payment/paytm.png",

    PhonePe: "/images/payment/phonepe.png",

    GPay: "/images/payment/GPay.png",

    Bhim: "/images/payment/Bhim.png",

    "Amazon Pay": "/images/payment/amazonpay.png",

    "Bank Transfer": "/images/payment/BankTransfer.png",

    Other: "/images/payment/card.png"

};


/*
 * =====================================================
 * PAYMENT MODES
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


/*
 * =====================================================
 * BANKS
 * =====================================================
 */

const banks = [

    "Pnb",

    "Rbl",

    "icici",

    "Cash",

    "Other"

];


const IncomeList = () => {


    /*
     * =====================================================
     * DATA STATES
     * =====================================================
     */

    const [loading, setLoading] =
        useState(true);

    const [incomes, setIncomes] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [totalAmount, setTotalAmount] =
        useState(0);


    /*
     * =====================================================
     * PAGINATION
     * =====================================================
     */

    const [page, setPage] =
        useState(1);

    const [limit, setLimit] =
        useState(10);

    const [total, setTotal] =
        useState(0);


    /*
     * =====================================================
     * SEARCH
     * =====================================================
     */

    const [searchInput, setSearchInput] =
        useState("");

    const [search, setSearch] =
        useState("");


    /*
     * =====================================================
     * CATEGORY
     * =====================================================
     */

    const [categoryInput, setCategoryInput] =
        useState("");

    const [category, setCategory] =
        useState("");


    /*
     * =====================================================
     * PAYMENT MODE
     * =====================================================
     */

    const [paymentModeInput, setPaymentModeInput] =
        useState("");

    const [paymentMode, setPaymentMode] =
        useState("");


    /*
     * =====================================================
     * BANK
     * =====================================================
     */

    const [bankInput, setBankInput] =
        useState("");

    const [bank, setBank] =
        useState("");


    /*
     * =====================================================
     * DATE FILTERS
     * =====================================================
     */

    const [fromDateInput, setFromDateInput] =
        useState("");

    const [toDateInput, setToDateInput] =
        useState("");

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");


    /*
     * =====================================================
     * LOAD CATEGORIES
     * =====================================================
     */

    const loadCategories = useCallback(
        async () => {

            try {

                const response =
                    await getCategories({

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
                    "Category load error:",
                    error
                );

                setCategories([]);

            }

        },
        []
    );


    /*
     * =====================================================
     * LOAD INCOME
     * =====================================================
     */

    const loadIncome = useCallback(
        async () => {

            try {

                setLoading(true);


                const response =
                    await getIncomes({

                        page,

                        limit,

                        search,

                        category,

                        paymentMode,

                        bank,

                        from: fromDate,

                        to: toDate

                    });


                if (response.success) {

                    const rows =
                        response.data?.data ||
                        response.data?.rows ||
                        response.data ||
                        [];


                    const incomeRows =
                        Array.isArray(rows)

                            ? rows

                            : [];


                    setIncomes(
                        incomeRows
                    );


                    setTotal(
                        response.data?.total ??
                        incomeRows.length
                    );


                    /*
                     * =================================================
                     * TOTAL AMOUNT
                     * =================================================
                     */

                    if (
                        response.data?.totalAmount !==
                        undefined
                    ) {

                        setTotalAmount(

                            Number(
                                response.data.totalAmount ||
                                0
                            )

                        );

                    } else {

                        const amount =
                            incomeRows.reduce(

                                (
                                    sum,
                                    item
                                ) => {

                                    return (

                                        sum +

                                        Number(
                                            item.amount ||
                                            0
                                        )

                                    );

                                },

                                0

                            );


                        setTotalAmount(
                            amount
                        );

                    }

                } else {

                    setIncomes([]);

                    setTotal(0);

                    setTotalAmount(0);

                }

            } catch (error) {

                console.error(
                    "Income load error:",
                    error
                );


                setIncomes([]);

                setTotal(0);

                setTotalAmount(0);

            } finally {

                setLoading(false);

            }

        },

        [

            page,

            limit,

            search,

            category,

            paymentMode,

            bank,

            fromDate,

            toDate

        ]

    );


    /*
     * =====================================================
     * INITIAL LOAD
     * =====================================================
     */

    useEffect(() => {

        loadCategories();

    }, [

        loadCategories

    ]);


    /*
     * =====================================================
     * LOAD INCOME DATA
     * =====================================================
     */

    useEffect(() => {

        loadIncome();

    }, [

        loadIncome

    ]);


    /*
     * =====================================================
     * DELETE INCOME
     * =====================================================
     */

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Delete this income?"
            )
        ) {

            return;

        }


        try {

            const response =
                await deleteIncome(id);


            if (response.success) {

                alert(

                    response.message ||
                    "Income deleted successfully."

                );


                if (

                    incomes.length === 1 &&

                    page > 1

                ) {

                    setPage(
                        page - 1
                    );

                } else {

                    loadIncome();

                }

            }

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Unable to delete income."

            );

        }

    };


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
     * TOTAL PAGES
     * =====================================================
     */

    const totalPages =
        Math.ceil(
            total / limit
        ) || 1;


    /*
     * =====================================================
     * RECORD RANGE
     * =====================================================
     */

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
     * GET PAYMENT IMAGE
     * =====================================================
     */

    const getPaymentModeImage = (
        paymentModeName
    ) => {

        if (!paymentModeName) {

            return null;

        }


        /*
         * Exact match
         */

        if (
            PaymentModeImages[
                paymentModeName
            ]
        ) {

            return (
                PaymentModeImages[
                    paymentModeName
                ]
            );

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
                    String(
                        paymentModeName
                    ).toLowerCase()

            );


        return matchedMode

            ? PaymentModeImages[
                matchedMode
            ]

            : PaymentModeImages.Other;

    };


    /*
     * =====================================================
     * GET BANK IMAGE
     * =====================================================
     */

    const getBankImage = (
        bankName
    ) => {

        if (!bankName) {

            return null;

        }


        /*
         * Exact match
         */

        if (
            bankImages[bankName]
        ) {

            return bankImages[bankName];

        }


        /*
         * Case-insensitive match
         */

        const matchedBank =
            Object.keys(
                bankImages
            ).find(

                key =>

                    key.toLowerCase() ===
                    String(
                        bankName
                    ).toLowerCase()

            );


        return matchedBank

            ? bankImages[
                matchedBank
            ]

            : bankImages.Other;

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
                        Income List
                    </h3>


                    <h5 className="mb-0 text-success">

                        Total Income: ₹{" "}

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


                <Link
                    to="/income/add"
                    className="btn btn-primary"
                >

                    Add Income

                </Link>

            </div>


            {/* =================================================
                FILTER CARD
            ================================================= */}

            <div className="card mb-3">

                <div className="card-body">

                    <form
                        className="row g-2 align-items-end"
                        onSubmit={
                            handleFilter
                        }
                    >


                        {/* SEARCH */}

                        <div className="col-12 col-lg-2">

                            <label className="form-label">
                                Search
                            </label>


                            <input
                                type="search"
                                className="form-control"
                                value={
                                    searchInput
                                }
                                onChange={
                                    event =>
                                        setSearchInput(
                                            event.target.value
                                        )
                                }
                                placeholder="Search title"
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="col-12 col-lg-2">

                            <label className="form-label">
                                Category
                            </label>


                            <select
                                className="form-select"
                                value={
                                    categoryInput
                                }
                                onChange={
                                    event =>
                                        setCategoryInput(
                                            event.target.value
                                        )
                                }
                            >

                                <option value="">
                                    All Categories
                                </option>


                                {categories.map(
                                    item => (

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

                                    )
                                )}

                            </select>

                        </div>


                        {/* PAYMENT MODE */}

                        <div className="col-12 col-lg-2">

                            <label className="form-label">
                                Payment Mode
                            </label>


                            <select
                                className="form-select"
                                value={
                                    paymentModeInput
                                }
                                onChange={
                                    event =>
                                        setPaymentModeInput(
                                            event.target.value
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

                        <div className="col-12 col-lg-2">

                            <label className="form-label">
                                Bank
                            </label>


                            <select
                                className="form-select"
                                value={
                                    bankInput
                                }
                                onChange={
                                    event =>
                                        setBankInput(
                                            event.target.value
                                        )
                                }
                            >

                                <option value="">
                                    All Banks
                                </option>


                                {banks.map(
                                    bankName => (

                                        <option
                                            key={bankName}
                                            value={bankName}
                                        >

                                            {bankName}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* FROM */}

                        <div className="col-6 col-lg-1">

                            <label className="form-label">
                                From
                            </label>


                            <input
                                type="date"
                                className="form-control"
                                value={
                                    fromDateInput
                                }
                                onChange={
                                    event =>
                                        setFromDateInput(
                                            event.target.value
                                        )
                                }
                            />

                        </div>


                        {/* TO */}

                        <div className="col-6 col-lg-1">

                            <label className="form-label">
                                To
                            </label>


                            <input
                                type="date"
                                className="form-control"
                                value={
                                    toDateInput
                                }
                                onChange={
                                    event =>
                                        setToDateInput(
                                            event.target.value
                                        )
                                }
                            />

                        </div>


                        {/* PER PAGE */}

                        <div className="col-6 col-lg-1">

                            <label className="form-label">
                                Per page
                            </label>


                            <select
                                className="form-select"
                                value={limit}
                                onChange={
                                    event => {

                                        setLimit(
                                            Number(
                                                event.target.value
                                            )
                                        );

                                        setPage(1);

                                    }
                                }
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

                        <div className="col-6 col-lg-1">

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                            >

                                Filter

                            </button>

                        </div>


                        {/* CLEAR */}

                        <div className="col-6 col-lg-1">

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={
                                    handleClearFilter
                                }
                                disabled={

                                    !searchInput &&
                                    !search &&
                                    !categoryInput &&
                                    !category &&
                                    !paymentModeInput &&
                                    !paymentMode &&
                                    !bankInput &&
                                    !bank &&
                                    !fromDateInput &&
                                    !toDateInput &&
                                    !fromDate &&
                                    !toDate

                                }
                            >

                                Clear

                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* =================================================
                INCOME TABLE
            ================================================= */}

            <div className="card">

                <div className="card-body table-responsive">

                    <table className="table table-bordered table-hover align-middle">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Title
                                </th>

                                <th>
                                    Amount
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Payment
                                </th>

                                <th className="text-center">
                                    Bank
                                </th>

                                <th>
                                    Date
                                </th>

                                <th width="170">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            {/* LOADING */}

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center py-4"
                                    >

                                        <div
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        />

                                        Loading...

                                    </td>

                                </tr>

                            ) : incomes.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center text-muted py-4"
                                    >

                                        No Record Found

                                    </td>

                                </tr>

                            ) : (

                                incomes.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const paymentImage =
                                            getPaymentModeImage(
                                                item.paymentMode
                                            );


                                        const bankImage =
                                            getBankImage(
                                                item.bank
                                            );


                                        return (

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


                                                {/* AMOUNT */}

                                                <td>

                                                    ₹{" "}

                                                    {Number(
                                                        item.amount ||
                                                        0
                                                    ).toLocaleString(

                                                        "en-IN",

                                                        {
                                                            maximumFractionDigits:
                                                                2
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


                                                {/* PAYMENT MODE */}

                                                <td>

                                                    {item.paymentMode ? (

                                                        <div
                                                            className="d-flex align-items-center gap-2"
                                                            style={{
                                                                minWidth:
                                                                    "130px"
                                                            }}
                                                        >

                                                            {paymentImage && (

                                                                <img
                                                                    src={
                                                                        paymentImage
                                                                    }
                                                                    alt={
                                                                        item.paymentMode
                                                                    }
                                                                    title={
                                                                        item.paymentMode
                                                                    }
                                                                    style={{
                                                                        width:
                                                                            "55px",

                                                                        height:
                                                                            "55px",

                                                                        objectFit:
                                                                            "contain",

                                                                        display:
                                                                            "block"
                                                                    }}
                                                                    onError={(
                                                                        event
                                                                    ) => {

                                                                        event.currentTarget.src =
                                                                            PaymentModeImages.Other;

                                                                    }}
                                                                />

                                                            )}


                                                            <span
                                                                className="badge"
                                                                style={{
                                                                    fontSize:
                                                                        "12px"
                                                                }}
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

                                                <td className="text-center">

                                                    {item.bank ? (

                                                        bankImage ? (

                                                            <img
                                                                src={
                                                                    bankImage
                                                                }
                                                                alt={
                                                                    item.bank
                                                                }
                                                                title={
                                                                    item.bank
                                                                }
                                                                style={{
                                                                    width:
                                                                        "65px",

                                                                    height:
                                                                        "55px",

                                                                    objectFit:
                                                                        "contain",

                                                                    display:
                                                                        "inline-block"
                                                                }}
                                                                onError={(
                                                                    event
                                                                ) => {

                                                                    event.currentTarget.src =
                                                                        bankImages.Other;

                                                                }}
                                                            />

                                                        ) : (

                                                            <span>
                                                                {
                                                                    item.bank
                                                                }
                                                            </span>

                                                        )

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
                                                            `/income/edit/${item._id}`
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

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    FOOTER / PAGINATION
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
                            nextPage => {

                                if (

                                    nextPage >= 1 &&

                                    nextPage <=
                                    totalPages

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


export default IncomeList;