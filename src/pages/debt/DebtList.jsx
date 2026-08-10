import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDebts, deleteDebt } from "../../api/debtApi";
import Pagination from "../../components/common/Pagination";
import { getCategoryBadgeStyle, getPaymentModeBadgeClass } from "../../utils/badgeStyles";

const DebtList = () => {

    const [loading, setLoading] = useState(true);

    const [debts, setDebts] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [fromDateInput, setFromDateInput] = useState("");
    const [toDateInput, setToDateInput] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const loadDebt = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getDebts({
                page,
                limit,
                from: fromDate,
                to: toDate
            });

            if (response.success) {

                const rows = response.data.data || response.data || [];

                setDebts(rows);
                setTotal(response.data.total || rows.length);

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    }, [fromDate, limit, page, toDate]);

    useEffect(() => {

        loadDebt();

    }, [loadDebt]);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this debt?")) {

            return;

        }

        try {

            const response = await deleteDebt(id);

            if (response.success) {

                alert(response.message);

                if (debts.length === 1 && page > 1) {
                    setPage(page - 1);
                } else {
                    loadDebt();
                }

            }

        } catch (error) {

            alert(error.response?.data?.message);

        }

    };

    const handleFilter = (event) => {

        event.preventDefault();
        setFromDate(fromDateInput);
        setToDate(toDateInput);
        setPage(1);

    };

    const handleClearFilter = () => {

        setFromDateInput("");
        setToDateInput("");
        setFromDate("");
        setToDate("");
        setPage(1);

    };

    const totalPages = Math.ceil(total / limit) || 1;
    const startRecord = total === 0 ? 0 : ((page - 1) * limit) + 1;
    const endRecord = Math.min(page * limit, total);

    return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between mb-3">

                <h3>

                    Debt List

                </h3>

                <Link
                    to="/debt/add"
                    className="btn btn-primary"
                >

                    Add debt

                </Link>

            </div>

            <div className="card">

                <div className="card-body table-responsive">

                    <form
                        className="row g-2 align-items-end mb-3"
                        onSubmit={handleFilter}
                    >

                        <div className="col-12 col-md-3">

                            <label className="form-label">

                                From

                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={fromDateInput}
                                onChange={event => setFromDateInput(event.target.value)}
                            />

                        </div>

                        <div className="col-12 col-md-3">

                            <label className="form-label">

                                To

                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={toDateInput}
                                onChange={event => setToDateInput(event.target.value)}
                            />

                        </div>

                        <div className="col-6 col-md-2">

                            <label className="form-label">

                                Per page

                            </label>

                            <select
                                className="form-select"
                                value={limit}
                                onChange={event => {
                                    setLimit(Number(event.target.value));
                                    setPage(1);
                                }}
                            >

                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>

                            </select>

                        </div>

                        <div className="col-6 col-md-2">

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                            >

                                Filter

                            </button>

                        </div>

                        <div className="col-6 col-md-2">

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={handleClearFilter}
                                disabled={!fromDateInput && !toDateInput && !fromDate && !toDate}
                            >

                                Clear

                            </button>

                        </div>

                    </form>

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

                            {

                                loading ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center"
                                        >

                                            Loading...

                                        </td>

                                    </tr>

                                ) : debts.length === 0 ?

                                    (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="text-center"
                                            >

                                                No Record Found

                                            </td>

                                        </tr>

                                    )

                                    :

                                    debts.map((item, index) => (

                                        <tr key={item._id}>

                                            <td>

                                                {((page - 1) * limit) + index + 1}

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
                                                    style={getCategoryBadgeStyle(item.category)}
                                                >

                                                    {item.category?.name || "-"}

                                                </span>

                                            </td>

                                            <td>

                                                <span className={getPaymentModeBadgeClass(item.paymentMode)}>

                                                    {item.paymentMode}

                                                </span>

                                            </td>

                                            <td>

                                                {

                                                    new Date(item.date)
                                                        .toLocaleDateString()

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

                                                    onClick={() => handleDelete(item._id)}

                                                >

                                                    Delete

                                                </button>

                                            </td>

                                        </tr>

                                    ))

                            }

                        </tbody>

                    </table>

                </div>

                <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2 bg-white">

                    <small className="text-muted">

                        Showing {startRecord} to {endRecord} of {total} records

                    </small>

                    <Pagination
                        page={page}
                        limit={limit}
                        total={total}
                        onPageChange={nextPage => {
                            if (nextPage >= 1 && nextPage <= totalPages) {
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
