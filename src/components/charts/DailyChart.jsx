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

const DailyChart = ({
    data = [],
    month,
    year
}) => {

    const rows = Array.isArray(data) ? data : [];
    const totalExpense = rows.reduce(
        (total, item) => total + Number(item.expense || 0),
        0
    );
    const visibleRows = rows.filter(
        item => Number(item.expense || 0) > 0
    );

    const getDisplayDate = (day) => {

        if (!month || !year) {
            return day;
        }

        return new Date(year, month - 1, day).toLocaleDateString();

    };

    const chartData = {

        labels: rows.map(item => item.day),

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
                text: "Daily Expense"
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

                        Daily Expense

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

                        Date Wise Expense List

                    </h5>

                    <div>

                        <span className="badge bg-danger">

                            Total Expense: Rs. {totalExpense.toLocaleString()}

                        </span>

                    </div>

                </div>

                <div className="table-responsive">

                    <table className="table table-bordered mb-0">

                        <thead>

                            <tr>

                                <th>Date</th>
                                <th>Total Expense</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                visibleRows.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="2"
                                            className="text-center"
                                        >

                                            No data found

                                        </td>

                                    </tr>

                                ) : (

                                    visibleRows.map(item => {

                                        const expense = Number(item.expense || 0);

                                        return (

                                            <tr key={item.date || item.day}>

                                                <td>{item.date || getDisplayDate(item.day)}</td>

                                                <td>
                                                    <span className="badge bg-danger">
                                                        Rs. {expense.toLocaleString()}
                                                    </span>
                                                </td>

                                            </tr>

                                        );

                                    })

                                )

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </>

    );

};

export default DailyChart;
