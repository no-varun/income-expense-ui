import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getShops, deleteShop } from "../../api/shopApi";

import Pagination from "../../components/common/Pagination";

const ShopList = () => {

    const [shops, setShop] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    /*
     * =========================
     * TYPE FILTER
     * =========================
     */

    const [typeInput, setTypeInput] = useState("");
    const [type, setType] = useState("");


    /*
     * =========================
     * LOAD shops
     * =========================
     */

    const loadShop = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getShops({

                page,
                limit,

                ...(type && {
                    type
                })

            });


            if (response.success) {

                const rows =
                    response.data?.rows ||
                    response.data?.data ||
                    response.data ||
                    [];

                setShop(
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

                setShop([]);
                setTotal(0);

            }

        } catch (error) {

            console.error(error);

            setShop([]);
            setTotal(0);

            alert(
                error.response?.data?.message ||
                "Unable to fetch shops."
            );

        } finally {

            setLoading(false);

        }

    }, [
        limit,
        page,
        type
    ]);


    /*
     * =========================
     * INITIAL / DATA LOAD
     * =========================
     */

    useEffect(() => {

        loadShop();

    }, [loadShop]);


    /*
     * =========================
     * TYPE FILTER
     * =========================
     */

    const handleTypeChange = (event) => {

        setTypeInput(
            event.target.value
        );

        setType(
            event.target.value
        );

        setPage(1);

    };


    /*
     * =========================
     * CLEAR FILTER
     * =========================
     */

    const handleClearFilter = () => {

        setTypeInput("");
        setType("");

        setPage(1);

    };


    /*
     * =========================
     * DELETE
     * =========================
     */

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this shop?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            const response =
                await deleteShop(id);


            if (response.success) {

                alert(
                    response.message
                );


                if (
                    shops.length === 1 &&
                    page > 1
                ) {

                    setPage(
                        page - 1
                    );

                } else {

                    loadShop();

                }

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


            {/* ================= HEADER ================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3 className="mb-0">
                    Shop List
                </h3>


                <Link
                    to="/shops/add"
                    className="btn btn-primary"
                >

                    + Add Shop

                </Link>

            </div>


            {/* ================= CARD ================= */}

            <div className="card shadow">


                {/* ================= FILTER ================= */}

                <div className="card-body">

                    <div className="row g-2 align-items-end">


                        {/* TYPE */}

                        <div className="col-12 col-md-4">

                            <label className="form-label">

                                Type

                            </label>


                            <select
                                className="form-select"
                                value={typeInput}
                                onChange={
                                    handleTypeChange
                                }
                            >

                                <option value="">

                                    All Types

                                </option>

                                <option value="ONLINE">On line</option>

                                <option value="OFFLINE">Off Line</option>


                            </select>

                        </div>


                        {/* PER PAGE */}

                        <div className="col-6 col-md-2">

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

                                <option value="25">
                                    25
                                </option>

                                <option value="50">
                                    50
                                </option>

                            </select>

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
                                    !typeInput
                                }
                            >

                                Clear

                            </button>

                        </div>

                    </div>

                </div>


                {/* ================= TABLE ================= */}

                <div className="card-body p-0 table-responsive">

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

                                ) : shops.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center"
                                        >

                                            No Shop Found

                                        </td>

                                    </tr>

                                ) : (

                                    shops.map(
                                        (item, index) => (

                                            <tr
                                                key={
                                                    item._id
                                                }
                                            >

                                                <td>

                                                    {
                                                        ((page - 1) * limit) +
                                                        index +
                                                        1
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        item.name
                                                    }

                                                </td>


                                                <td>

                                                    <span
                                                        className={`
                                                            badge
                                                            ${item.type === "INCOME"
                                                                ? "bg-success"
                                                                : item.type === "EXPENSE"
                                                                    ? "bg-danger"
                                                                    : item.type === "SAVING"
                                                                        ? "bg-warning text-dark"
                                                                        : item.type === "DEBT"
                                                                            ? "bg-info"
                                                                            : "bg-secondary"
                                                            }
                                                        `}
                                                    >

                                                        {
                                                            item.type
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        style={{
                                                            width: "25px",
                                                            height: "25px",
                                                            display: "inline-block",
                                                            borderRadius: "50%",
                                                            background:
                                                                item.color
                                                        }}
                                                    />

                                                </td>


                                                <td>

                                                    <Link
                                                        to={`/shops/edit/${item._id}`}
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

                                )

                            }

                        </tbody>

                    </table>

                </div>


                {/* ================= FOOTER ================= */}

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

                                setPage(
                                    nextPage
                                );

                            }

                        }}
                    />

                </div>

            </div>

        </div>

    );

};

export default ShopList;