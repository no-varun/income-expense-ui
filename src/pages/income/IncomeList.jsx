import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getIncomes,
    deleteIncome
} from "../../api/incomeApi";

const IncomeList = () => {

    const [loading, setLoading] = useState(true);

    const [incomes, setIncomes] = useState([]);

    const loadIncome = async () => {

        try {

            const response = await getIncomes();
            console.log(response)
            if (response.success) {

                setIncomes(
                    response.data.data || response.data || []
                );

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadIncome();

    }, []);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this income?")) {

            return;

        }

        try {

            const response = await deleteIncome(id);

            if (response.success) {

                alert(response.message);

                loadIncome();

            }

        } catch (error) {

            alert(error.response?.data?.message);

        }

    };

    if (loading) {

        return <h5>Loading...</h5>;

    }

    return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between mb-3">

                <h3>

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

                <div className="card-body table-responsive">

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

                                incomes.length === 0 ?

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

                                    incomes.map((item, index) => (

                                        <tr key={item._id}>

                                            <td>

                                                {index + 1}

                                            </td>

                                            <td>

                                                {item.title}

                                            </td>

                                            <td>

                                                ₹ {item.amount}

                                            </td>

                                            <td>

                                                {item.category?.name}

                                            </td>

                                            <td>

                                                {item.paymentMode}

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

                                                    to={`/income/edit/${item._id}`}

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

            </div>

        </div>

    );

};

export default IncomeList;