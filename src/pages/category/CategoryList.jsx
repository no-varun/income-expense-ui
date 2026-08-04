import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getCategories,
    deleteCategory
} from "../../api/categoryApi";

const CategoryList = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCategories = async () => {

        try {

            const response = await getCategories();
            if (response.success) {
                setCategories(response.data.rows || []);
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

    };

    useEffect(() => {

        loadCategories();

    }, []);

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) return;

        try {

            const response = await deleteCategory(id);

            if (response.success) {

                alert(response.message);

                loadCategories();

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Delete failed."
            );

        }

    };

    if (loading) {

        return (

            <div className="text-center mt-5">

                Loading...

            </div>

        );

    }

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

                                categories.length === 0 ? (

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

                                                {index + 1}

                                            </td>

                                            <td>

                                                {item.name}

                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        item.type === "Income"
                                                            ? "badge bg-success"
                                                            : "badge bg-danger"
                                                    }
                                                >

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

            </div>

        </div>

    );

};

export default CategoryList;