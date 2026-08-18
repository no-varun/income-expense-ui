import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getSavings,
    deleteSaving
} from "../../api/savingApi";

import { getCategories } from "../../api/categoryApi";

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


const SavingList = () => {

    const [loading, setLoading] = useState(true);

    const [savings, setSavings] = useState([]);

    const [categories, setCategories] = useState([]);


    /*
     * =====================================================
     * PAGINATION
     * =====================================================
     */

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);

    const [total, setTotal] = useState(0);


    /*
     * =====================================================
     * DATE FILTERS
     * =====================================================
     */

    const [fromDateInput, setFromDateInput] = useState("");

    const [toDateInput, setToDateInput] = useState("");

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");


    /*
     * =====================================================
     * CATEGORY FILTER
     * =====================================================
     */

    const [categoryInput, setCategoryInput] = useState("");

    const [category, setCategory] = useState("");


    /*
     * =====================================================
     * PAYMENT MODE FILTER
     * =====================================================
     */

    const [paymentModeInput, setPaymentModeInput] =
        useState("");

    const [paymentMode, setPaymentMode] =
        useState("");


    /*
     * =====================================================
     * BANK FILTER
     * =====================================================
     */

    const [bankInput, setBankInput] = useState("");

    const [bank, setBank] = useState("");


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


    /*
     * =====================================================
     * LOAD CATEGORIES
     * =====================================================
     */

    const loadCategories = useCallback(async () => {

        try {

            const response = await getCategories({

                limit: 100,

                type: "SAVING"

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

            console.log(
                "Category fetch error:",
                error
            );

            setCategories([]);

        }

    }, []);


    /*
     * =====================================================
     * LOAD SAVINGS
     * =====================================================
     */

    const loadSaving = useCallback(async () => {

        try {

            setLoading(true);


            const response = await getSavings({

                page,

                limit,

                from: fromDate,

                to: toDate,

                category,

                paymentMode,

                bank

            });


            if (response.success) {

                const rows =

                    response.data?.data ||

                    response.data?.rows ||

                    response.data ||

                    [];


                const savingRows =

                    Array.isArray(rows)

                        ? rows

                        : [];


                setSavings(
                    savingRows
                );


                setTotal(

                    response.data?.total ??

                    savingRows.length

                );

            } else {

                setSavings([]);

                setTotal(0);

            }

        } catch (error) {

            console.log(
                "Saving load error:",
                error
            );

            setSavings([]);

            setTotal(0);

        } finally {

            setLoading(false);

        }

    }, [

        page,

        limit,

        fromDate,

        toDate,

        category,

        paymentMode,

        bank

    ]);


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
     * LOAD SAVINGS
     * =====================================================
     */

    useEffect(() => {

        loadSaving();

    }, [
        loadSaving
    ]);


    /*
     * =====================================================
     * DELETE SAVING
     * =====================================================
     */

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Delete this saving?"
            )
        ) {

            return;

        }


        try {

            const response =
                await deleteSaving(id);


            if (response.success) {

                alert(
                    response.message ||
                    "Saving deleted successfully."
                );


                if (

                    savings.length === 1 &&

                    page > 1

                ) {

                    setPage(page - 1);

                } else {

                    loadSaving();

                }

            }

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to delete saving"

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


        setFromDate(
            fromDateInput
        );

        setToDate(
            toDateInput
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


        setPage(1);

    };


    /*
     * =====================================================
     * CLEAR FILTER
     * =====================================================
     */

    const handleClearFilter = () => {

        setFromDateInput("");

        setToDateInput("");

        setCategoryInput("");

        setPaymentModeInput("");

        setBankInput("");


        setFromDate("");

        setToDate("");

        setCategory("");

        setPaymentMode("");

        setBank("");


        setPage(1);

    };


    /*
     * =====================================================
     * GET BANK IMAGE
     * =====================================================
     */

    const getBankImage = (bankName) => {

        if (!bankName) {

            return null;

        }


        /*
         * Exact match
         */

        if (bankImages[bankName]) {

            return bankImages[bankName];

        }


        /*
         * Case-insensitive match
         */

        const matchedBank =
            Object.keys(bankImages).find(

                key =>

                    key.toLowerCase() ===
                    String(bankName).toLowerCase()

            );


        /*
         * Return matching image
         * or Other image
         */

        return matchedBank

            ? bankImages[matchedBank]

            : bankImages.Other;

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
     * RENDER
     * =====================================================
     */

    return (

        <div className="container-fluid">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">

                <h3 className="mb-0">

                    Saving List

                </h3>


                <Link
                    to="/saving/add"
                    className="btn btn-primary"
                >

                    Add Saving

                </Link>

            </div>


            {/* =================================================
                CARD
            ================================================= */}

            <div className="card">

                <div className="card-body">


                    {/* =================================================
                        FILTER
                    ================================================= */}

                    <form
                        className="row g-2 align-items-end mb-3"
                        onSubmit={handleFilter}
                    >


                        {/* FROM */}

                        <div className="col-12 col-md-2">

                            <label className="form-label">

                                From

                            </label>


                            <input
                                type="date"
                                className="form-control"
                                value={
                                    fromDateInput
                                }
                                onChange={(event) =>
                                    setFromDateInput(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* TO */}

                        <div className="col-12 col-md-2">

                            <label className="form-label">

                                To

                            </label>


                            <input
                                type="date"
                                className="form-control"
                                value={
                                    toDateInput
                                }
                                onChange={(event) =>
                                    setToDateInput(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="col-12 col-md-2">

                            <label className="form-label">

                                Category

                            </label>


                            <select
                                className="form-select"
                                value={
                                    categoryInput
                                }
                                onChange={(event) =>
                                    setCategoryInput(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">

                                    All Categories

                                </option>


                                {categories.map(
                                    (categoryItem) => (

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


                        {/* PAYMENT MODE */}

                        <div className="col-12 col-md-2">

                            <label className="form-label">

                                Payment Mode

                            </label>


                            <select
                                className="form-select"
                                value={
                                    paymentModeInput
                                }
                                onChange={(event) =>
                                    setPaymentModeInput(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">

                                    All Payment Modes

                                </option>


                                {paymentModes.map(
                                    (mode) => (

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

                        <div className="col-12 col-md-2">

                            <label className="form-label">

                                Bank

                            </label>


                            <select
                                className="form-select"
                                value={bankInput}
                                onChange={(event) =>
                                    setBankInput(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">

                                    All Banks

                                </option>


                                {banks.map(
                                    (bankItem) => (

                                        <option
                                            key={
                                                bankItem
                                            }
                                            value={
                                                bankItem
                                            }
                                        >

                                            {
                                                bankItem
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* PER PAGE */}

                        <div className="col-6 col-md-1">

                            <label className="form-label">

                                Per page

                            </label>


                            <select
                                className="form-select"
                                value={limit}
                                onChange={(event) => {

                                    setLimit(
                                        Number(
                                            event.target.value
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

                            </select>

                        </div>


                        {/* FILTER */}

                        <div className="col-6 col-md-1">

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                            >

                                Filter

                            </button>

                        </div>


                        {/* CLEAR */}

                        <div className="col-6 col-md-1">

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={
                                    handleClearFilter
                                }
                                disabled={

                                    !fromDateInput &&

                                    !toDateInput &&

                                    !categoryInput &&

                                    !paymentModeInput &&

                                    !bankInput &&

                                    !fromDate &&

                                    !toDate &&

                                    !category &&

                                    !paymentMode &&

                                    !bank

                                }
                            >

                                Clear

                            </button>

                        </div>

                    </form>


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="table-responsive">

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
                                        Payment Mode
                                    </th>

                                    <th
                                        style={{
                                            minWidth: "130px"
                                        }}
                                    >
                                        Bank
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th
                                        style={{
                                            minWidth: "170px"
                                        }}
                                    >
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

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

                                ) : savings.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            className="text-center text-muted py-4"
                                        >

                                            No Record Found

                                        </td>

                                    </tr>

                                ) : (

                                    savings.map(
                                        (item, index) => {

                                            const bankName =
                                                item.bank ||
                                                "";

                                            const bankImage =
                                                getBankImage(
                                                    bankName
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        item._id
                                                    }
                                                >


                                                    {/* NUMBER */}

                                                    <td>

                                                        {
                                                            (
                                                                (
                                                                    page -
                                                                    1
                                                                ) *
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

                                                        {
                                                            Number(
                                                                item.amount ||
                                                                0
                                                            ).toLocaleString(
                                                                "en-IN",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                }
                                                            )
                                                        }

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

                                                        <span
                                                            className={
                                                                getPaymentModeBadgeClass(
                                                                    item.paymentMode
                                                                )
                                                            }
                                                        >

                                                            {
                                                                item.paymentMode ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* BANK */}

                                                    <td
                                                        style={{
                                                            minWidth: "130px",
                                                            width: "130px",
                                                            textAlign: "center"
                                                        }}
                                                    >

                                                        {bankName ? (

                                                            <div
                                                                className="d-flex align-items-center justify-content-center"
                                                                style={{
                                                                    width: "120px",
                                                                    minHeight: "60px"
                                                                }}
                                                            >

                                                                {bankImage && (

                                                                    <img
                                                                        src={
                                                                            bankImage
                                                                        }
                                                                        alt={
                                                                            bankName
                                                                        }
                                                                        title={
                                                                            bankName
                                                                        }
                                                                        style={{
                                                                            width: "85px",
                                                                            height: "45px",
                                                                            objectFit: "contain",
                                                                            display: "block"
                                                                        }}
                                                                        onError={(
                                                                            event
                                                                        ) => {

                                                                            event.currentTarget.style.display =
                                                                                "none";

                                                                        }}
                                                                    />

                                                                )}

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
                                                                `/saving/edit/${item._id}`
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


export default SavingList;