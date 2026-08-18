import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDebts, deleteDebt } from "../../api/debtApi";
import { getCategories } from "../../api/categoryApi";

import Pagination from "../../components/common/Pagination";

import {
    getCategoryBadgeStyle,
    getPaymentModeBadgeClass
} from "../../utils/badgeStyles";

const DebtList = () => {

    const [loading, setLoading] = useState(true);

    const [debts, setDebts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    /*
     * =========================
     * INPUT FILTERS
     * =========================
     */

    const [categoryInput, setCategoryInput] = useState("");
    const [paymentModeInput, setPaymentModeInput] = useState("");
    const [bankInput, setBankInput] = useState("");

    const [fromDateInput, setFromDateInput] = useState("");
    const [toDateInput, setToDateInput] = useState("");


    /*
     * =========================
     * APPLIED FILTERS
     * =========================
     */

    const [category, setCategory] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [bank, setBank] = useState("");

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");


    /*
     * =========================
     * PAYMENT MODES
     * =========================
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
     * =========================
     * BANKS
     * =========================
     */

    const banks = [
        "Pnb",
        "Rbl",
        "icici",
        "Cash",
        "Other"
    ];


    /*
     * =========================
     * LOAD CATEGORIES
     * =========================
     */

    const loadCategories = useCallback(async () => {

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

            console.log(
                "Category fetch error:",
                error
            );

            setCategories([]);

        }

    }, []);


    /*
     * =========================
     * LOAD DEBTS
     * =========================
     */

    const loadDebt = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getDebts({

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

                setDebts(
                    Array.isArray(rows)
                        ? rows
                        : []
                );

                setTotal(
                    response.data?.total ??
                    rows.length
                );

            } else {

                setDebts([]);

                setTotal(0);

            }

        } catch (error) {

            console.log(
                "Debt fetch error:",
                error
            );

            setDebts([]);

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
     * =========================
     * LOAD CATEGORIES
     * =========================
     */

    useEffect(() => {

        loadCategories();

    }, [loadCategories]);


    /*
     * =========================
     * LOAD DEBTS
     * =========================
     */

    useEffect(() => {

        loadDebt();

    }, [loadDebt]);


    /*
     * =========================
     * DELETE DEBT
     * =========================
     */

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this debt?")) {

            return;

        }


        try {

            const response =
                await deleteDebt(id);


            if (response.success) {

                alert(response.message);


                if (
                    debts.length === 1 &&
                    page > 1
                ) {

                    setPage(page - 1);

                } else {

                    loadDebt();

                }

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to delete debt."
            );

        }

    };


    /*
     * =========================
     * APPLY FILTER
     * =========================
     */

    const handleFilter = (event) => {

        event.preventDefault();

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
     * =========================
     * CLEAR FILTER
     * =========================
     */

    const handleClearFilter = () => {

        setCategoryInput("");
        setPaymentModeInput("");
        setBankInput("");

        setFromDateInput("");
        setToDateInput("");

        setCategory("");
        setPaymentMode("");
        setBank("");

        setFromDate("");
        setToDate("");

        setPage(1);

    };


    /*
     * =========================
     * PAGINATION
     * =========================
     */

    const totalPages =
        Math.ceil(total / limit) || 1;


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
     * =========================
     * RENDER
     * =========================
     */

    return (

        <div className="container-fluid">


            {/* =========================
                HEADER
            ========================= */}

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h3 className="mb-0">
                    Debt List
                </h3>


                <Link
                    to="/debt/add"
                    className="btn btn-primary"
                >
                    Add Debt
                </Link>

            </div>


            {/* =========================
                CARD
            ========================= */}

            <div className="card">


                <div className="card-body">


                    {/* =========================
                        FILTER
                    ========================= */}

                    <form
                        className="row g-2 align-items-end mb-3"
                        onSubmit={handleFilter}
                    >


                        {/* CATEGORY */}

                        <div className="col-12 col-md-2">

                            <label className="form-label">
                                Category
                            </label>


                            <select
                                className="form-select"
                                value={categoryInput}
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

                        <div className="col-12 col-md-2">

                            <label className="form-label">
                                From
                            </label>


                            <input
                                type="date"
                                className="form-control"
                                value={fromDateInput}
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
                                value={toDateInput}
                                onChange={(event) =>
                                    setToDateInput(
                                        event.target.value
                                    )
                                }
                            />

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
                                    !categoryInput &&
                                    !paymentModeInput &&
                                    !bankInput &&
                                    !fromDateInput &&
                                    !toDateInput &&
                                    !category &&
                                    !paymentMode &&
                                    !bank &&
                                    !fromDate &&
                                    !toDate
                                }
                            >
                                Clear
                            </button>

                        </div>

                    </form>


                    {/* =========================
                        TABLE
                    ========================= */}

                    <div className="table-responsive">

                        <table className="table table-bordered">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Title
                                    </th>

                                    <th>
                                        Total Amount
                                    </th>

                                    <th>
                                        Pending Amount
                                    </th>

                                    <th>
                                        Recovered Amount
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Payment
                                    </th>

                                    <th>
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
                                            colSpan="10"
                                            className="text-center"
                                        >
                                            Loading...
                                        </td>

                                    </tr>

                                ) : debts.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="10"
                                            className="text-center"
                                        >
                                            No Record Found
                                        </td>

                                    </tr>

                                ) : (

                                    debts.map(
                                        (item, index) => {

                                            const amount =
                                                Number(
                                                    item.amount || 0
                                                );

                                            const pendingAmount =
                                                Number(
                                                    item.pendingAmount || 0
                                                );

                                            const recoveredAmount =
                                                amount -
                                                pendingAmount;


                                            return (

                                                <tr
                                                    key={
                                                        item._id
                                                    }
                                                >

                                                    {/* NUMBER */}

                                                    <td>

                                                        {
                                                            ((page - 1) *
                                                                limit) +
                                                            index +
                                                            1
                                                        }

                                                    </td>


                                                    {/* TITLE */}

                                                    <td>

                                                        {
                                                            item.title
                                                        }

                                                    </td>


                                                    {/* TOTAL */}

                                                    <td>

                                                        ₹{" "}

                                                        {
                                                            amount.toLocaleString(
                                                                "en-IN",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                }
                                                            )
                                                        }

                                                    </td>


                                                    {/* PENDING */}

                                                    <td>

                                                        ₹{" "}

                                                        {
                                                            pendingAmount.toLocaleString(
                                                                "en-IN",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                }
                                                            )
                                                        }

                                                    </td>


                                                    {/* RECOVERED */}

                                                    <td>

                                                        ₹{" "}

                                                        {
                                                            recoveredAmount.toLocaleString(
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
                                                                "-"
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* PAYMENT */}

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

                                                    <td>

                                                        <span className="badge bg-secondary">

                                                            {
                                                                item.bank ||
                                                                "-"
                                                            }

                                                        </span>

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
                                                                `/debt/edit/${item._id}`
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


                {/* =========================
                    PAGINATION
                ========================= */}

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

export default DebtList;