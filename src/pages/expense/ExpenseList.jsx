import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    deleteExpense,
    exportExpensesExcel,
    getExpenses,
    importExpensesExcel
} from "../../api/expenseApi";
import Pagination from "../../components/common/Pagination";
import {
    getCategoryBadgeStyle,
    getPaymentModeBadgeClass
} from "../../utils/badgeStyles";

const ExpenseList = () => {

    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [fromDateInput, setFromDateInput] = useState("");
    const [toDateInput, setToDateInput] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const loadExpense = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getExpenses({
                page,
                limit,
                search,
                from: fromDate,
                to: toDate
            });

            if (response.success) {

                setExpenses(response.data.data || []);
                setTotal(response.data.total || 0);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to fetch expenses."
            );

        } finally {

            setLoading(false);

        }

    }, [fromDate, limit, page, search, toDate]);

    useEffect(() => {

        loadExpense();

    }, [loadExpense]);

    const handleSearch = (event) => {

        event.preventDefault();
        setSearch(searchInput.trim());
        setFromDate(fromDateInput);
        setToDate(toDateInput);
        setPage(1);

    };

    const handleClearFilter = () => {

        setSearchInput("");
        setSearch("");
        setFromDateInput("");
        setToDateInput("");
        setFromDate("");
        setToDate("");
        setPage(1);

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this expense?")) {

            return;

        }

        try {

            const response = await deleteExpense(id);

            if (response.success) {

                alert(response.message);
                loadExpense();

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Delete failed."
            );

        }

    };

    const handleImportClick = () => {

        fileInputRef.current?.click();

    };

    const handleImport = async (event) => {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {

            setImporting(true);

            const response = await importExpensesExcel(file);

            if (response.success) {

                alert(`${response.data.imported} expenses imported successfully.`);

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

    const handleExport = async () => {

        try {

            setExporting(true);

            const blob = await exportExpensesExcel({
                search,
                from: fromDate,
                to: toDate
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "expense-export.xlsx";
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

    const totalPages = Math.ceil(total / limit) || 1;
    const startRecord = total === 0 ? 0 : ((page - 1) * limit) + 1;
    const endRecord = Math.min(page * limit, total);

    return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h3>

                    Expense List

                </h3>

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

                        {importing ? "Importing..." : "Import Excel"}

                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleExport}
                        disabled={exporting}
                    >

                        {exporting ? "Exporting..." : "Export Excel"}

                    </button>

                    <Link
                        to="/expense/add"
                        className="btn btn-primary"
                    >

                        Add Expense

                    </Link>

                </div>

            </div>

            <div className="card mb-3">

                <div className="card-body">

                    <form
                        className="row g-2 align-items-end"
                        onSubmit={handleSearch}
                    >

                        <div className="col-12 col-lg-3">

                            <label className="form-label">

                                Search

                            </label>

                            <input
                                type="search"
                                className="form-control"
                                value={searchInput}
                                onChange={event => setSearchInput(event.target.value)}
                                placeholder="Search title"
                            />

                        </div>

                        <div className="col-6 col-lg-2">

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

                        <div className="col-6 col-lg-2">

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

                        <div className="col-6 col-lg-2">

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

                        <div className="col-6 col-lg-1">

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                            >

                                Filter

                            </button>

                        </div>

                        <div className="col-6 col-lg-2">

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={handleClearFilter}
                                disabled={!searchInput && !search && !fromDateInput && !toDateInput && !fromDate && !toDate}
                            >

                                Clear

                            </button>

                        </div>

                    </form>

                </div>

            </div>

            <div className="card">

                <div className="card-body table-responsive">

                    <table className="table table-bordered">

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>Title</th>

                                <th>Note</th>
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

                                ) : expenses.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center"
                                        >

                                            No Record Found

                                        </td>

                                    </tr>

                                ) : (

                                    expenses.map((item, index) => (

                                        <tr key={item._id}>

                                            <td>

                                                {((page - 1) * limit) + index + 1}

                                            </td>

                                            <td>

                                                {item.title}

                                            </td>
                                            <td>

                                                {item.note}

                                            </td>
                                            <td>

                                                Rs. {item.amount}

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
                                                    to={`/expense/edit/${item._id}`}
                                                >

                                                    Edit

                                                </Link>

                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(item._id)}
                                                >

                                                    Delete

                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )

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

export default ExpenseList;
