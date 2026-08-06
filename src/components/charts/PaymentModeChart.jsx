import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { getSliceColors } from "./chartColors";

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

                            Income Payment Modes (₹)

                        </h5>

                    </div>

                    <div className="card-body chart-body chart-body-pie">

                        <Doughnut

                            data={{

                                labels: income.map(item => item._id),

                                datasets: [

                                    {

                                        label: "Income",

                                        data: income.map(item => item.value),
                                        backgroundColor: getSliceColors(income.length),
                                        borderColor: "#ffffff",
                                        borderWidth: 2

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

            {/* Expense Payment Mode */}

            <div className="col-md-6 mb-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h5 className="mb-0">

                            Expense Payment Modes (₹)

                        </h5>

                    </div>

                    <div className="card-body chart-body chart-body-pie">

                        <Doughnut

                            data={{

                                labels: expense.map(item => item._id),

                                datasets: [

                                    {

                                        label: "Expense",

                                        data: expense.map(item => item.value),
                                        backgroundColor: getSliceColors(expense.length, 4),
                                        borderColor: "#ffffff",
                                        borderWidth: 2

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

export default PaymentModeChart;
