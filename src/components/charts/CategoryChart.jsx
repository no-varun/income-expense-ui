import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const CategoryChart = ({ data = { income: [], expense: [] } }) => {

    const income = data.income || [];
    const expense = data.expense || [];

    return (

        <div className="row">

            {/* Income Category */}

            <div className="col-md-6 mb-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h5 className="mb-0">

                            Income Category Chart

                        </h5>

                    </div>

                    <div className="card-body chart-body chart-body-pie">

                        <Pie

                            data={{

                                labels: income.map(item => item._id),

                                datasets: [

                                    {

                                        label: "Income",

                                        data: income.map(item => item.value)

                                    }

                                ]

                            }}

                            options={{

                                responsive: true,
                                maintainAspectRatio: false,

                                plugins: {

                                    legend: {

                                        position: "bottom"

                                    }

                                }

                            }}

                        />

                    </div>

                </div>

            </div>

            {/* Expense Category */}

            <div className="col-md-6 mb-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h5 className="mb-0">

                            Expense Category Chart

                        </h5>

                    </div>

                    <div className="card-body chart-body chart-body-pie">

                        <Pie

                            data={{

                                labels: expense.map(item => item._id),

                                datasets: [

                                    {

                                        label: "Expense",

                                        data: expense.map(item => item.value)

                                    }

                                ]

                            }}

                            options={{

                                responsive: true,
                                maintainAspectRatio: false,

                                plugins: {

                                    legend: {

                                        position: "bottom"

                                    }

                                }

                            }}

                        />

                    </div>

                </div>

            </div>

        </div>

    );

};

export default CategoryChart;
