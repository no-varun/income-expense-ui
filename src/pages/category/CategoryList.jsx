import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getCategories,
    deleteCategory
} from "../../api/categoryApi";
import Pagination from "../../components/common/Pagination";

const CategoryList = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    const loadCategories = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getCategories({
                page,
                limit
            });

            if (response.success) {
                const rows = response.data.rows || response.data.data || [];

                setCategories(rows);
                setTotal(response.data.total || rows.length);
            }

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to fetch categories."
            );

        } finally {

            setLoading(false);

        }

    }, [limit, page]);

    useEffect(() => {

        loadCategories();

    }, [loadCategories]);

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) return;

        try {

            const response = await deleteCategory(id);

            if (response.success) {

                alert(response.message);

                if (categories.length === 1 && page > 1) {
                    setPage(page - 1);
                } else {
                    loadCategories();
                }

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Delete failed."
            );

        }

    };

    const totalPages = Math.ceil(total / limit) || 1;
    const startRecord = total === 0 ? 0 : ((page - 1) * limit) + 1;
    const endRecord = Math.min(page * limit, total);

    return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3>

                    Category List

                </h3>

                <Link
                    to="/categories/add"
                    className="btn btn-primary"
                >

                    + Add Category

                </Link>

            </div>

            <div className="card shadow">

                <div className="card-body p-0">

                    <div className="d-flex justify-content-end p-3">

                        <div style={{ width: "140px" }}>

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

                    </div>

                    <table className="table table-bordered table-hover mb-0">

                        <thead className="table-dark">

                            <tr>

                                <th width="80">

                                    #

                                </th>

                                <th>

                                    Name

                                </th>

                                <th>

                                    Type

                                </th>

                                <th>

                                    Color

                                </th>

                                <th width="180">

                                    Action

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                loading ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center"
                                        >

                                            Loading...

                                        </td>

                                    </tr>

                                ) : categories.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center"
                                        >

                                            No Category Found

                                        </td>

                                    </tr>

                                ) : (

                                    categories.map((item, index) => (

                                        <tr
                                            key={item._id}
                                        >

                                            <td>

                                                {((page - 1) * limit) + index + 1}

                                            </td>

                                            <td>

                                                {item.name}

                                            </td>

                                            <td>
                                                <span className={`badge ${item.type === "INCOME" ? "bg-success" : item.type === "EXPENSE" ? "bg-danger" : "bg-info"}`}>
                                                    {item.type}
                                                </span>
                                            </td>

                                            <td>

                                                <span
                                                    style={{
                                                        width: "25px",
                                                        height: "25px",
                                                        display: "inline-block",
                                                        borderRadius: "50%",
                                                        background: item.color
                                                    }}
                                                />

                                            </td>

                                            <td>

                                                <Link
                                                    to={`/categories/edit/${item._id}`}
                                                    className="btn btn-warning btn-sm me-2"
                                                >

                                                    Edit

                                                </Link>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        handleDelete(item._id)
                                                    }
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

export default CategoryList;
