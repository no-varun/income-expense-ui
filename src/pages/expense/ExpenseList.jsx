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

import Pagination from "../../components/common/Pagination";

import {
    getCategoryBadgeStyle,
    getPaymentModeBadgeClass
} from "../../utils/badgeStyles";


const ExpenseList = () => {

    const fileInputRef = useRef(null);


    /*
     * =========================
     * DATA STATES
     * =========================
     */

    const [expenses, setExpenses] = useState([]);

    const [categories, setCategories] = useState([]);

    const [totalAmount, setTotalAmount] = useState(0);


    /*
     * =========================
     * LOADING STATES
     * =========================
     */

    const [loading, setLoading] = useState(true);

    const [importing, setImporting] = useState(false);

    const [exporting, setExporting] = useState(false);

    const [categoryLoading, setCategoryLoading] = useState(false);


    /*
     * =========================
     * SEARCH
     * =========================
     */

    const [searchInput, setSearchInput] = useState("");

    const [search, setSearch] = useState("");


    /*
     * =========================
     * CATEGORY
     * =========================
     */

    const [categoryInput, setCategoryInput] = useState("");

    const [category, setCategory] = useState("");


    /*
     * =========================
     * DATE
     * =========================
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
     * =========================
     * PAGINATION
     * =========================
     */

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);

    const [total, setTotal] = useState(0);


    /*
     * =========================
     * LOAD CATEGORIES
     * =========================
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

            console.error(
                "Category fetch error:",
                error
            );

        } finally {

            setCategoryLoading(false);

        }

    }, []);


    /*
     * =========================
     * LOAD EXPENSES
     * =========================
     */

    const loadExpense = useCallback(async () => {

        try {

            setLoading(true);

            const response =
                await getExpenses({

                    page,

                    limit,

                    search,

                    category,

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
        category,
        fromDate,
        limit,
        page,
        search,
        toDate
    ]);


    /*
     * =========================
     * INITIAL LOAD
     * =========================
     */

    useEffect(() => {

        loadCategories();

    }, [
        loadCategories
    ]);


    /*
     * =========================
     * LOAD EXPENSES WHEN
     * FILTER/PAGE CHANGES
     * =========================
     */

    useEffect(() => {

        loadExpense();

    }, [
        loadExpense
    ]);


    /*
     * =========================
     * FILTER
     * =========================
     */

    const handleSearch = event => {

        event.preventDefault();

        setSearch(
            searchInput.trim()
        );

        setCategory(
            categoryInput
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

        setSearchInput("");

        setSearch("");

        setCategoryInput("");

        setCategory("");

        setFromDateInput("");

        setToDateInput("");

        setFromDate("");

        setToDate("");

        setPage(1);

    };


    /*
     * =========================
     * DELETE
     * =========================
     */

    const handleDelete = async id => {

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
                    response.message
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
     * =========================
     * IMPORT CLICK
     * =========================
     */

    const handleImportClick = () => {

        fileInputRef.current?.click();

    };


    /*
     * =========================
     * IMPORT EXCEL
     * =========================
     */

    const handleImport = async event => {

        const file =
            event.target.files?.[0];


        if (!file) {

            return;

        }


        try {

            setImporting(true);

            const response =
                await importExpensesExcel(
                    file
                );


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
     * =========================
     * EXPORT EXCEL
     * =========================
     */

    const handleExport = async () => {

        try {

            setExporting(true);

            const blob =
                await exportExpensesExcel({

                    search,

                    category,

                    from: fromDate,

                    to: toDate

                });


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "expense-export.xlsx";


            document.body.appendChild(
                link
            );


            link.click();

            link.remove();

            window.URL.revokeObjectURL(
                url
            );

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
     * =========================
     * PAGINATION CALCULATIONS
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

                    {/* Hidden file input */}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx"
                        className="d-none"
                        onChange={handleImport}
                    />


                    {/* Import */}

                    <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={
                            handleImportClick
                        }
                        disabled={importing}
                    >

                        {
                            importing
                                ? "Importing..."
                                : "Import Excel"
                        }

                    </button>


                    {/* Export */}

                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleExport}
                        disabled={exporting}
                    >

                        {
                            exporting
                                ? "Exporting..."
                                : "Export Excel"
                        }

                    </button>


                    {/* Add */}

                    <Link
                        to="/expense/add"
                        className="btn btn-primary"
                    >

                        Add Expense

                    </Link>

                </div>

            </div>


            {/* =========================
                FILTER CARD
            ========================= */}

            <div className="card mb-3">

                <div className="card-body">

                    <form
                        className="row g-2 align-items-end"
                        onSubmit={
                            handleSearch
                        }
                    >

                        {/* SEARCH */}

                        <div className="col-12 col-lg-3">

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
                                disabled={
                                    categoryLoading
                                }
                            >

                                <option value="">
                                    All Categories
                                </option>

                                {
                                    categories.map(
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
                                    )
                                }

                            </select>

                        </div>


                        {/* FROM DATE */}

                        <div className="col-6 col-lg-2">

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


                        {/* TO DATE */}

                        <div className="col-6 col-lg-2">

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


            {/* =========================
                EXPENSE TABLE
            ========================= */}

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
                                    Note
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
                                            colSpan="8"
                                            className="text-center"
                                        >

                                            <div
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            />

                                            Loading...

                                        </td>

                                    </tr>

                                )

                                    : expenses.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="text-center text-muted py-4"
                                            >
                                                No Record Found
                                            </td>

                                        </tr>

                                    )

                                        : (

                                            expenses.map(
                                                (
                                                    item,
                                                    index
                                                ) => (

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

                                                            Rs.{" "}

                                                            {
                                                                Number(
                                                                    item.amount ||
                                                                    0
                                                                ).toLocaleString(
                                                                    "en-IN",
                                                                    {
                                                                        maximumFractionDigits:
                                                                            2
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

                                        )

                            }

                        </tbody>

                    </table>

                </div>


                {/* =========================
                    FOOTER / PAGINATION
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
                            nextPage => {

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