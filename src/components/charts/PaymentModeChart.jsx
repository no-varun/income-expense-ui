import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const PaymentModeChart = ({ data = { income: [], expense: [] } }) => {

    const income = data.income || [];

    const expense = data.expense || [];

    return (

        <div className="row">

            {/* Income Payment Mode */}

            <div className="col-md-6 mb-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h5 className="mb-0">

                            Income Payment Modes

                        </h5>

                    </div>

                    <div className="card-body">

                        <Doughnut

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

            {/* Expense Payment Mode */}

            <div className="col-md-6 mb-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h5 className="mb-0">

                            Expense Payment Modes

                        </h5>

                    </div>

                    <div className="card-body">

                        <Doughnut

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

export default PaymentModeChart;