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

const SavingList = () => {

    const [loading, setLoading] = useState(true);

    const [savings, setSavings] = useState([]);
    const [categories, setCategories] = useState([]);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    const [fromDateInput, setFromDateInput] = useState("");
    const [toDateInput, setToDateInput] = useState("");

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [categoryInput, setCategoryInput] = useState("");
    const [category, setCategory] = useState("");


    /*
     * Load Saving Categories
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

            console.log("Category fetch error:", error);

        }

    };


    /*
     * Load Savings
     */
    const loadSaving = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getSavings({

                page,
                limit,

                from: fromDate,
                to: toDate,

                category

            });


            if (response.success) {

                const rows =
                    response.data.data ||
                    response.data.rows ||
                    response.data ||
                    [];

                setSavings(rows);

                setTotal(
                    response.data.total ??
                    rows.length
                );

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    }, [
        fromDate,
        toDate,
        category,
        page,
        limit
    ]);


    /*
     * Load categories once
     */
    useEffect(() => {

        loadCategories();

    }, []);


    /*
     * Load savings whenever
     * pagination/filter changes
     */
    useEffect(() => {

        loadSaving();

    }, [loadSaving]);


    /*
     * Delete
     */
    const handleDelete = async (id) => {

        if (!window.confirm("Delete this saving?")) {

            return;

        }


        try {

            const response =
                await deleteSaving(id);


            if (response.success) {

                alert(response.message);


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
     * Apply Filter
     */
    const handleFilter = (event) => {

        event.preventDefault();

        setFromDate(fromDateInput);

        setToDate(toDateInput);

        setCategory(categoryInput);

        setPage(1);

    };


    /*
     * Clear Filter
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


    return (

        <div className="container-fluid">

            {/* Header */}

            <div className="d-flex justify-content-between mb-3">

                <h3>
                    Saving List
                </h3>

                <Link
                    to="/saving/add"
                    className="btn btn-primary"
                >
                    Add Saving
                </Link>

            </div>


            <div className="card">

                <div className="card-body table-responsive">


                    {/* ================= FILTER ================= */}

                    <form
                        className="row g-2 align-items-end mb-3"
                        onSubmit={handleFilter}
                    >


                        {/* From */}

                        <div className="col-12 col-md-3">

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


                        {/* To */}

                        <div className="col-12 col-md-3">

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


                        {/* Category */}

                        <div className="col-12 col-md-3">

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


                        {/* Per Page */}

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


                        {/* Filter */}

                        <div className="col-6 col-md-1">

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                            >
                                Filter
                            </button>

                        </div>


                        {/* Clear */}

                        <div className="col-6 col-md-1">

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={handleClearFilter}
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


                    {/* ================= TABLE ================= */}

                    <table className="table table-bordered">

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>Title</th>

                                <th>Amount</th>

                                <th>Category</th>

                                <th>Payment</th>

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
                                        colSpan="7"
                                        className="text-center"
                                    >
                                        Loading...
                                    </td>

                                </tr>

                            ) : savings.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center"
                                    >
                                        No Record Found
                                    </td>

                                </tr>

                            ) : (

                                savings.map(
                                    (item, index) => (

                                        <tr
                                            key={item._id}
                                        >

                                            <td>
                                                {
                                                    ((page - 1) * limit) +
                                                    index +
                                                    1
                                                }
                                            </td>


                                            <td>
                                                {item.title}
                                            </td>


                                            <td>
                                                ₹ {item.amount}
                                            </td>


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


                                            <td>

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

                                            </td>


                                            <td>

                                                {
                                                    new Date(
                                                        item.date
                                                    ).toLocaleDateString()
                                                }

                                            </td>


                                            <td>

                                                <Link
                                                    className="btn btn-warning btn-sm me-2"
                                                    to={`/saving/edit/${item._id}`}
                                                >
                                                    Edit
                                                </Link>


                                                <button
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


                {/* ================= PAGINATION ================= */}

                <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2 bg-white">

                    <small className="text-muted">

                        Showing {startRecord} to {endRecord} of {total} records

                    </small>


                    <Pagination
                        page={page}
                        limit={limit}
                        total={total}
                        onPageChange={
                            nextPage => {

                                if (
                                    nextPage >= 1 &&
                                    nextPage <= totalPages
                                ) {

                                    setPage(nextPage);

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