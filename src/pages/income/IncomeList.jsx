import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getIncomes,
    deleteIncome
} from "../../api/incomeApi";

import { getCategories } from "../../api/categoryApi";

import Pagination from "../../components/common/Pagination";

import {
    getCategoryBadgeStyle,
    getPaymentModeBadgeClass
} from "../../utils/badgeStyles";

const IncomeList = () => {

    const [loading, setLoading] = useState(true);

    const [incomes, setIncomes] = useState([]);

    const [categories, setCategories] = useState([]);

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);

    const [total, setTotal] = useState(0);

    /*
     * =========================
     * DATE FILTERS
     * =========================
     */

    const [fromDateInput, setFromDateInput] = useState("");
    const [toDateInput, setToDateInput] = useState("");

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    /*
     * =========================
     * CATEGORY FILTER
     * =========================
     */

    const [categoryInput, setCategoryInput] = useState("");
    const [category, setCategory] = useState("");

    /*
     * =========================
     * LOAD CATEGORIES
     * =========================
     */

    const loadCategories = useCallback(async () => {

        try {

            const response = await getCategories({
                limit: 100,
                type: "INCOME"
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

            console.log(
                "Category load error:",
                error
            );

        }

    }, []);

    /*
     * =========================
     * LOAD INCOME
     * =========================
     */

    const loadIncome = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getIncomes({

                page,

                limit,

                from: fromDate,

                to: toDate,

                category

            });

            if (response.success) {

                const rows =
                    response.data?.data ||
                    response.data?.rows ||
                    response.data ||
                    [];

                setIncomes(
                    Array.isArray(rows)
                        ? rows
                        : []
                );

                setTotal(
                    response.data?.total ??
                    rows.length
                );

            } else {

                setIncomes([]);

                setTotal(0);

            }

        } catch (error) {

            console.log(
                "Income load error:",
                error
            );

            setIncomes([]);

            setTotal(0);

        } finally {

            setLoading(false);

        }

    }, [
        fromDate,
        toDate,
        category,
        limit,
        page
    ]);

    /*
     * =========================
     * INITIAL LOAD
     * =========================
     */

    useEffect(() => {

        loadCategories();

    }, [loadCategories]);

    /*
     * =========================
     * LOAD INCOME DATA
     * =========================
     */

    useEffect(() => {

        loadIncome();

    }, [loadIncome]);

    /*
     * =========================
     * DELETE INCOME
     * =========================
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

                alert(response.message);

                /*
                 * If last record on current page,
                 * move to previous page.
                 */

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
     * =========================
     * APPLY FILTER
     * =========================
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

        setPage(1);

    };

    /*
     * =========================
     * CLEAR FILTER
     * =========================
     */

    const handleClearFilter = () => {

        setFromDateInput("");

        setToDateInput("");

        setCategoryInput("");

        setFromDate("");

        setToDate("");

        setCategory("");

        setPage(1);

    };

    /*
     * =========================
     * PAGINATION
     * =========================
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
                    Income List
                </h3>

                <Link
                    to="/income/add"
                    className="btn btn-primary"
                >
                    Add Income
                </Link>

            </div>

            <div className="card">

                <div className="card-body">

                    {/* =========================
                        FILTER
                    ========================= */}

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
                                    (item) => (

                                        <option
                                            key={item._id}
                                            value={item._id}
                                        >
                                            {item.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        {/* PER PAGE */}

                        <div className="col-12 col-md-2">

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

                        <div className="col-6 col-md-2">

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                            >
                                Filter
                            </button>

                        </div>

                        {/* CLEAR */}

                        <div className="col-6 col-md-2">

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
                                    !fromDate &&
                                    !toDate &&
                                    !category
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
                                        Amount
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Payment
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
                                            colSpan="7"
                                            className="text-center"
                                        >
                                            Loading...
                                        </td>

                                    </tr>

                                ) : incomes.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center"
                                        >
                                            No Record Found
                                        </td>

                                    </tr>

                                ) : (

                                    incomes.map(
                                        (item, index) => (

                                            <tr
                                                key={
                                                    item._id
                                                }
                                            >

                                                {/* NUMBER */}

                                                <td>

                                                    {
                                                        ((page - 1) * limit) +
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

                                                {/* AMOUNT */}

                                                <td>

                                                    ₹{" "}

                                                    {
                                                        Number(
                                                            item.amount || 0
                                                        ).toLocaleString(
                                                            "en-IN"
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

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

                {/* =========================
                    FOOTER
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

export default IncomeList;