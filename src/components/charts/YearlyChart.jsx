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
    expenseColor,
    incomeBorderColor,
    incomeColor
} from "./chartColors";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const YearlyChart = ({ data = [] }) => {

    const rows = Array.isArray(data) ? data : [];

    const chartData = {
        labels: rows.map(item => item.year),

        datasets: [

            {
                label: "Income",

                data: rows.map(
                    item => Number(item.income) || 0
                ),

                backgroundColor: incomeColor,
                borderColor: incomeBorderColor,
                borderWidth: 1
            },

            {
                label: "Expense",

                data: rows.map(
                    item => Number(item.expense) || 0
                ),

                backgroundColor: expenseColor,
                borderColor: expenseBorderColor,
                borderWidth: 1
            },

            {
                label: "Saving",

                data: rows.map(
                    item => Number(item.saving) || 0
                ),

                backgroundColor: "#198754",
                borderColor: "#146c43",
                borderWidth: 1
            },

            {
                label: "Debt",

                data: rows.map(
                    item => Number(item.totalDebt) || 0
                ),

                backgroundColor: "#ffc107",
                borderColor: "#cc9a06",
                borderWidth: 1
            },

            {
                label: "Pending Debt",

                data: rows.map(
                    item => Number(item.pendingDebt) || 0
                ),

                backgroundColor: "#0dcaf0",
                borderColor: "#0aa2c0",
                borderWidth: 1
            }

        ]
    };

    const options = {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {
            mode: "index",
            intersect: false
        },

        plugins: {

            legend: {
                position: "top"
            },

            title: {
                display: true,

                text: "Yearly Income vs Expense"
            },

            tooltip: {

                callbacks: {

                    label: (context) => {

                        const value =
                            Number(context.raw) || 0;

                        return `${context.dataset.label}: ₹${value.toLocaleString(
                            "en-IN",
                            {
                                maximumFractionDigits: 2
                            }
                        )}`;
                    }
                }
            }
        },

        scales: {

            x: {
                stacked: false
            },

            y: {

                beginAtZero: true,

                ticks: {

                    callback: (value) => {
                        return `₹${Number(value).toLocaleString(
                            "en-IN"
                        )}`;
                    }
                }
            }
        }
    };

    return (
        <div className="card shadow mb-4">

            <div className="card-header">
                <h5 className="mb-0">
                    Yearly Income vs Expense (₹)
                </h5>
            </div>

            <div
                className="card-body chart-body"
                style={{
                    minWidth: 0,
                    position: "relative"
                }}
            >

                {rows.length > 0 ? (

                    <Bar
                        data={chartData}
                        options={options}
                    />

                ) : (

                    <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                        No yearly data available
                    </div>

                )}

            </div>

        </div>
    );
};

export default YearlyChart;