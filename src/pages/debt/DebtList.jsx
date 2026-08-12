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

    // Input filters
    const [categoryInput, setCategoryInput] = useState("");
    const [fromDateInput, setFromDateInput] = useState("");
    const [toDateInput, setToDateInput] = useState("");

    // Applied filters
    const [category, setCategory] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");


    /*
     * Load Debt Categories
     */
    const loadCategories = useCallback(async () => {

        try {

            const response = await getCategories({
                limit: 100,
                type: "DEBT"
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

    }, []);


    /*
     * Load Debts
     */
    const loadDebt = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getDebts({

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

                setDebts(rows);

                setTotal(
                    response.data.total ||
                    rows.length
                );

            } else {

                setDebts([]);

                setTotal(0);

            }

        } catch (error) {

            console.log("Debt fetch error:", error);

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
        category
    ]);


    /*
     * Load categories on page load
     */
    useEffect(() => {

        loadCategories();

    }, [loadCategories]);


    /*
     * Load debts whenever
     * pagination/filter changes
     */
    useEffect(() => {

        loadDebt();

    }, [loadDebt]);


    /*
     * Delete Debt
     */
    const handleDelete = async (id) => {

        if (!window.confirm("Delete this debt?")) {

            return;

        }


        try {

            const response = await deleteDebt(id);

            if (response.success) {

                alert(response.message);

                /*
                 * If last record on current page
                 * and page > 1, go previous page.
                 */
                if (debts.length === 1 && page > 1) {

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
     * Apply Filters
     */
    const handleFilter = (event) => {

        event.preventDefault();

        setCategory(categoryInput);

        setFromDate(fromDateInput);

        setToDate(toDateInput);

        setPage(1);

    };


    /*
     * Clear Filters
     */
    const handleClearFilter = () => {

        setCategoryInput("");

        setFromDateInput("");

        setToDateInput("");

        setCategory("");

        setFromDate("");

        setToDate("");

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


            {/* ================= HEADER ================= */}

            <div className="d-flex justify-content-between mb-3">

                <h3>
                    Debt List
                </h3>


                <Link
                    to="/debt/add"
                    className="btn btn-primary"
                >
                    Add Debt
                </Link>

            </div>


            {/* ================= CARD ================= */}

            <div className="card">


                <div className="card-body table-responsive">


                    {/* ================= FILTER ================= */}

                    <form
                        className="row g-2 align-items-end mb-3"
                        onSubmit={handleFilter}
                    >


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


                                {categories.map(categoryItem => (

                                    <option
                                        key={categoryItem._id}
                                        value={categoryItem._id}
                                    >

                                        {categoryItem.name}

                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* From */}

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


                        {/* To */}

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


                        {/* Per Page */}

                        <div className="col-6 col-md-2">

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

                        <div className="col-6 col-md-2">

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={handleClearFilter}
                                disabled={
                                    !categoryInput &&
                                    !fromDateInput &&
                                    !toDateInput &&
                                    !category &&
                                    !fromDate &&
                                    !toDate
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

                                <th>
                                    #
                                </th>

                                <th>
                                    Title
                                </th>

                                <th>
                                    Total  Amount
                                </th>
                                <th>
                                    Pending  Amount
                                </th>
                                <th>
                                    Recovered  Amount
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

                                <th width="170">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            {/* Loading */}

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center"
                                    >
                                        Loading...
                                    </td>

                                </tr>

                            ) : debts.length === 0 ? (

                                /* No Data */

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center"
                                    >
                                        No Record Found
                                    </td>

                                </tr>

                            ) : (

                                /* Data */

                                debts.map((item, index) => (

                                    <tr key={item._id}>


                                        <td>

                                            {
                                                ((page - 1) * limit)
                                                + index
                                                + 1
                                            }

                                        </td>


                                        <td>

                                            {item.title}

                                        </td>


                                        <td>₹{" "} {Number(item.amount || 0).toLocaleString("en-IN")}</td>
                                        <td>₹{" "} {Number(item.pendingAmount || 0).toLocaleString("en-IN")}</td>
                                        <td>₹ {Number((item.amount || 0) - (item.pendingAmount || 0)).toLocaleString("en-IN")}</td>

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
                                                    item.paymentMode ||
                                                    "-"
                                                }

                                            </span>

                                        </td>


                                        <td>

                                            {
                                                item.date
                                                    ? new Date(
                                                        item.date
                                                    ).toLocaleDateString()
                                                    : "-"
                                            }

                                        </td>


                                        <td>


                                            <Link
                                                className="btn btn-warning btn-sm me-2"
                                                to={`/debt/edit/${item._id}`}
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

                                ))

                            )}


                        </tbody>

                    </table>

                </div>


                {/* ================= PAGINATION ================= */}

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
                        onPageChange={(nextPage) => {

                            if (
                                nextPage >= 1 &&
                                nextPage <= totalPages
                            ) {

                                setPage(nextPage);

                            }

                        }}
                    />

                </div>


            </div>

        </div>

    );

};

export default DebtList;