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

const DashboardChart = ({
    data = {
        income: [],
        expense: [],
        Saving: [],
        Debt: [],
        pendingDebt: []
    }
}) => {

    /*
     * API data
     */
    const income = data.income || [];
    const expense = data.expense || [];

    const saving = data.Saving || data.saving || [];
    const debt = data.Debt || data.debt || [];
    const pendingDebt =
        data.pendingDebt || data.PendingDebt || [];


    /*
     * Get all available months
     *
     * Example:
     * income  -> [2, 3, 5, 6]
     * expense -> [2, 3, 5, 6]
     * saving  -> [1, 2, 3, ...]
     *
     * Result:
     * [1, 2, 3, 4, 5, ...]
     */
    const labels = [
        ...new Set([
            ...income.map(item => Number(item._id)),
            ...expense.map(item => Number(item._id)),
            ...saving.map(item => Number(item._id)),
            ...debt.map(item => Number(item._id)),
            ...pendingDebt.map(item => Number(item._id))
        ])
    ]
        .filter(month => month >= 1 && month <= 12)
        .sort((a, b) => a - b);


    /*
     * Month names
     */
    const monthLabels = labels.map(month => {
        return new Date(
            2000,
            month - 1
        ).toLocaleString(
            "default",
            {
                month: "short"
            }
        );
    });


    /*
     * Helper
     *
     * Finds the total for a particular month.
     */
    const getMonthValue = (items, month) => {

        const row = items.find(
            item => Number(item._id) === month
        );

        return row
            ? Number(row.total) || 0
            : 0;
    };


    /*
     * Chart data
     */
    const chartData = {
        labels: monthLabels,

        datasets: [

            {
                label: "Income",

                data: labels.map(month =>
                    getMonthValue(income, month)
                ),

                backgroundColor: incomeColor,
                borderColor: incomeBorderColor,
                borderWidth: 1
            },

            {
                label: "Expense",

                data: labels.map(month =>
                    getMonthValue(expense, month)
                ),

                backgroundColor: expenseColor,
                borderColor: expenseBorderColor,
                borderWidth: 1
            },

            {
                label: "Saving",

                data: labels.map(month =>
                    getMonthValue(saving, month)
                ),

                backgroundColor: "#198754",
                borderColor: "#146c43",
                borderWidth: 1
            },

            {
                label: "Debt",

                data: labels.map(month =>
                    getMonthValue(debt, month)
                ),

                backgroundColor: "#ffc107",
                borderColor: "#cc9a06",
                borderWidth: 1
            },

            {
                label: "Pending Debt",

                data: labels.map(month =>
                    getMonthValue(
                        pendingDebt,
                        month
                    )
                ),

                backgroundColor: "#0dcaf0",
                borderColor: "#0aa2c0",
                borderWidth: 1
            }

        ]
    };


    /*
     * Chart options
     */
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
                text: "Dashboard Income vs Expense"
            },

            tooltip: {

                callbacks: {

                    label: context => {

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

                    callback: value => {
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
                    Dashboard Chart (₹)
                </h5>

            </div>

            <div
                className="card-body chart-body"
                style={{
                    minWidth: 0,
                    position: "relative"
                }}
            >

                {labels.length > 0 ? (

                    <Bar
                        data={chartData}
                        options={options}
                    />

                ) : (

                    <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                        No chart data available
                    </div>

                )}

            </div>

        </div>
    );
};

export default DashboardChart;