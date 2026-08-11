import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCategories } from "../../api/categoryApi";
import {
    deleteItem,
    getItems
} from "../../api/itemApi";

import Pagination from "../../components/common/Pagination";

const ItemList = () => {

    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [type, setType] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);


    /*
     * =========================
     * LOAD CATEGORIES
     * =========================
     */

    const loadCategories = async () => {

        try {

            const response = await getCategories({
                limit: 1000
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

        }

    };


    /*
     * =========================
     * FILTER CATEGORIES BY TYPE
     * =========================
     */

    const filteredCategories = categories.filter(item => {

        if (!type) {
            return true;
        }

        return item.type === type;

    });


    /*
     * =========================
     * LOAD ITEMS
     * =========================
     */

    const loadItems = useCallback(async () => {

        try {

            setLoading(true);

            const params = {
                page,
                limit
            };


            if (search) {
                params.search = search;
            }


            if (type) {
                params.type = type;
            }


            if (category) {
                params.category = category;
            }


            if (status !== "") {
                params.status = status;
            }


            const response = await getItems(params);


            if (response.success) {

                const rows =
                    response.data?.data ||
                    response.data?.rows ||
                    response.data ||
                    [];

                setItems(
                    Array.isArray(rows)
                        ? rows
                        : []
                );

                setTotal(
                    response.data?.total ||
                    rows.length ||
                    0
                );

            } else {

                setItems([]);
                setTotal(0);

            }

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to fetch items."
            );

            setItems([]);
            setTotal(0);

        } finally {

            setLoading(false);

        }

    }, [
        category,
        limit,
        page,
        search,
        status,
        type
    ]);


    /*
     * =========================
     * LOAD CATEGORIES ONCE
     * =========================
     */

    useEffect(() => {

        loadCategories();

    }, []);


    /*
     * =========================
     * LOAD ITEMS
     * =========================
     */

    useEffect(() => {

        loadItems();

    }, [loadItems]);


    /*
     * =========================
     * FILTER
     * =========================
     */

    const handleFilter = (event) => {

        event.preventDefault();

        setSearch(
            searchInput.trim()
        );

        setPage(1);

    };


    /*
     * =========================
     * TYPE CHANGE
     * =========================
     */

    const handleTypeChange = (event) => {

        const selectedType =
            event.target.value;

        setType(selectedType);

        setCategory("");

        setPage(1);

    };


    /*
     * =========================
     * CATEGORY CHANGE
     * =========================
     */

    const handleCategoryChange = (event) => {

        setCategory(
            event.target.value
        );

        setPage(1);

    };


    /*
     * =========================
     * STATUS CHANGE
     * =========================
     */

    const handleStatusChange = (event) => {

        setStatus(
            event.target.value
        );

        setPage(1);

    };


    /*
     * =========================
     * DELETE
     * =========================
     */

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this item?")) {
            return;
        }

        try {

            const response =
                await deleteItem(id);

            if (response.success) {

                alert(response.message);

                /*
                 * Reload current page
                 */
                loadItems();

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


            {/* ================= HEADER ================= */}

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h3 className="mb-0">
                    Item List
                </h3>

                <Link
                    to="/items/add"
                    className="btn btn-primary"
                >
                    Add Item
                </Link>

            </div>


            {/* ================= FILTER ================= */}

            <div className="card mb-3">

                <div className="card-body">

                    <form
                        className="row g-2 align-items-end"
                        onSubmit={handleFilter}
                    >


                        {/* SEARCH */}

                        <div className="col-12 col-lg-3">

                            <label className="form-label">
                                Search
                            </label>

                            <input
                                type="search"
                                className="form-control"
                                value={searchInput}
                                onChange={event =>
                                    setSearchInput(
                                        event.target.value
                                    )
                                }
                                placeholder="Search item name"
                            />

                        </div>


                        {/* TYPE */}

                        <div className="col-12 col-lg-2">

                            <label className="form-label">
                                Type
                            </label>

                            <select
                                className="form-select"
                                value={type}
                                onChange={handleTypeChange}
                            >

                                <option value="">
                                    All Types
                                </option>

                                <option value="INCOME">
                                    Income
                                </option>

                                <option value="EXPENSE">
                                    Expense
                                </option>

                                <option value="SAVING">
                                    Saving
                                </option>

                                <option value="DEBT">
                                    Debt
                                </option>

                            </select>

                        </div>


                        {/* CATEGORY */}

                        <div className="col-12 col-lg-3">

                            <label className="form-label">
                                Category
                            </label>

                            <select
                                className="form-select"
                                value={category}
                                onChange={handleCategoryChange}
                            >

                                <option value="">
                                    All Categories
                                </option>

                                {filteredCategories.map(item => (

                                    <option
                                        key={item._id}
                                        value={item._id}
                                    >
                                        {item.name}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* STATUS */}

                        <div className="col-6 col-lg-2">

                            <label className="form-label">
                                Status
                            </label>

                            <select
                                className="form-select"
                                value={status}
                                onChange={handleStatusChange}
                            >

                                <option value="">
                                    All
                                </option>

                                <option value="true">
                                    Active
                                </option>

                                <option value="false">
                                    Inactive
                                </option>

                            </select>

                        </div>


                        {/* PER PAGE */}

                        <div className="col-6 col-lg-1">

                            <label className="form-label">
                                Per page
                            </label>

                            <select
                                className="form-select"
                                value={limit}
                                onChange={event => {

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

                                <option value="20">
                                    20
                                </option>

                                <option value="50">
                                    50
                                </option>

                            </select>

                        </div>


                        {/* GO */}

                        <div className="col-12 col-lg-1">

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                            >
                                Go
                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* ================= TABLE ================= */}

            <div className="card">

                <div className="card-body table-responsive">

                    <table className="table table-bordered">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Type
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Description
                                </th>

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

                            ) : items.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center"
                                    >
                                        No Item Found
                                    </td>

                                </tr>

                            ) : (

                                items.map(
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
                                                {item.name}
                                            </td>


                                            <td>

                                                <span className="badge bg-info">

                                                    {
                                                        item.type ||
                                                        item.category?.type ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            <td>
                                                {
                                                    item.category?.name ||
                                                    "-"
                                                }
                                            </td>


                                            <td>

                                                <span
                                                    className={`badge ${
                                                        item.status
                                                            ? "bg-success"
                                                            : "bg-secondary"
                                                    }`}
                                                >

                                                    {
                                                        item.status
                                                            ? "Active"
                                                            : "Inactive"
                                                    }

                                                </span>

                                            </td>


                                            <td>
                                                {
                                                    item.description ||
                                                    "-"
                                                }
                                            </td>


                                            <td>

                                                <Link
                                                    to={`/items/edit/${item._id}`}
                                                    className="btn btn-warning btn-sm me-2"
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
                        onPageChange={nextPage => {

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

export default ItemList;