import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";
import {
    expenseBorderColor,
    expenseColor
} from "./chartColors";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const WeekWiseExpenseChart = ({ data = [] }) => {

    const rows = Array.isArray(data) ? data : [];
    const totalExpense = rows.reduce(
        (total, item) => total + Number(item.expense || 0),
        0
    );

    const chartData = {

        labels: rows.map(item => item.label || `Week ${item.week}`),

        datasets: [

            {
                label: "Expense",
                data: rows.map(item => item.expense),
                backgroundColor: expenseColor,
                borderColor: expenseBorderColor,
                borderWidth: 1
            }

        ]

    };

    const options = {

        responsive: true,
        maintainAspectRatio: false,

        plugins: {

            legend: {
                position: "top"
            },

            title: {
                display: true,
                text: "Week Wise Expense"
            }

        },

        scales: {
            y: {
                beginAtZero: true
            }
        }

    };

    return (

        <>

            <div className="card shadow mb-4">

                <div className="card-header">

                    <h5 className="mb-0">

                        Week Wise Expense

                    </h5>

                </div>

                <div className="card-body chart-body">

                    <Bar
                        data={chartData}
                        options={options}
                    />

                </div>

            </div>

            <div className="card shadow">

                <div className="card-header d-flex justify-content-between align-items-center">

                    <h5 className="mb-0">

                        Week Wise Expense List

                    </h5>

                    <span className="badge bg-danger">

                        Total Expense: Rs. {totalExpense.toLocaleString()}

                    </span>

                </div>

                <div className="table-responsive">

                    <table className="table table-bordered mb-0">

                        <thead>

                            <tr>

                                <th>Week</th>

                                <th>Date Range</th>

                                <th>Total Expense</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                rows.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="3"
                                            className="text-center"
                                        >

                                            No data found

                                        </td>

                                    </tr>

                                ) : (

                                    rows.map(item => (

                                        <tr key={item.week}>

                                            <td>

                                                {item.label || `Week ${item.week}`}

                                            </td>

                                            <td>

                                                {
                                                    new Date(item.startDate)
                                                        .toLocaleDateString()
                                                }
                                                {" - "}
                                                {
                                                    new Date(item.endDate)
                                                        .toLocaleDateString()
                                                }

                                            </td>

                                            <td>

                                                <span className="badge bg-danger">

                                                    Rs. {Number(item.expense || 0).toLocaleString()}

                                                </span>

                                            </td>

                                        </tr>

                                    ))

                                )

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </>

    );

};

export default WeekWiseExpenseChart;
