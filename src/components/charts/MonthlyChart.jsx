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

const MonthlyChart = ({ data = [] }) => {

    const rows = Array.isArray(data) ? data : [];

    const formatAmount = (value) => {
        return `₹${Number(value || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2
        })}`;
    };

    const getTypeClass = (type) => {
        switch (type) {
            case "Income":
                return "text-success";

            case "Expense":
                return "text-danger";

            case "Saving":
                return "text-primary";

            case "Debt":
                return "text-warning";

            default:
                return "text-muted";
        }
    };

    /*
     * Chart Data
     */
    const chartData = {

        labels: rows.map(item => item.month),

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


    /*
     * Chart Options
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

                text: "Monthly Income vs Expense"

            },

            tooltip: {

                callbacks: {

                    label: (context) => {

                        const value =
                            Number(context.raw) || 0;

                        return `${context.dataset.label}: ${formatAmount(value)}`;

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
                        return formatAmount(value);
                    }

                }

            }

        }

    };


    /*
     * Get transactions
     */
    const hasTransactions = rows.some(
        item =>
            Array.isArray(item.transactions) &&
            item.transactions.length > 0
    );


    return (

        <div className="card shadow mb-4">

            {/* ================= CHART ================= */}

            <div className="card-header">

                <h5 className="mb-0">
                    Monthly Income vs Expense (₹)
                </h5>

            </div>


            <div
                className="card-body chart-body"
                style={{
                    minWidth: 0,
                    position: "relative",
                    height: "400px"
                }}
            >

                {rows.length > 0 ? (

                    <Bar
                        data={chartData}
                        options={options}
                    />

                ) : (

                    <div className="d-flex justify-content-center align-items-center h-100 text-muted">

                        No monthly data available

                    </div>

                )}

            </div>


            {/* ================= MONTHLY LIST ================= */}

            {hasTransactions && (

                <div className="card-body border-top">

                    <h5 className="mb-3">
                        Monthly Transactions
                    </h5>


                    {rows.map((monthData) => {

                        const transactions =
                            Array.isArray(monthData.transactions)
                                ? monthData.transactions
                                : [];


                        /*
                         * Don't show empty months
                         */
                        if (transactions.length === 0) {
                            return null;
                        }


                        return (

                            <div
                                key={monthData.month}
                                className="mb-4"
                            >

                                {/* Month Header */}

                                <div className="d-flex justify-content-between align-items-center mb-2">

                                    <h6 className="mb-0 fw-bold">
                                        {monthData.month}
                                    </h6>

                                    <span className="text-muted">
                                        {transactions.length} transaction
                                        {transactions.length !== 1
                                            ? "s"
                                            : ""}
                                    </span>

                                </div>


                                {/* Month Summary */}

                                <div className="row g-2 mb-3">

                                    <div className="col-6 col-md-3">

                                        <div className="border rounded p-2">

                                            <small className="text-muted">
                                                Income
                                            </small>

                                            <div className="text-success fw-bold">
                                                {formatAmount(
                                                    monthData.income
                                                )}
                                            </div>

                                        </div>

                                    </div>


                                    <div className="col-6 col-md-3">

                                        <div className="border rounded p-2">

                                            <small className="text-muted">
                                                Expense
                                            </small>

                                            <div className="text-danger fw-bold">
                                                {formatAmount(
                                                    monthData.expense
                                                )}
                                            </div>

                                        </div>

                                    </div>


                                    <div className="col-6 col-md-3">

                                        <div className="border rounded p-2">

                                            <small className="text-muted">
                                                Saving
                                            </small>

                                            <div className="text-primary fw-bold">
                                                {formatAmount(
                                                    monthData.saving
                                                )}
                                            </div>

                                        </div>

                                    </div>


                                    <div className="col-6 col-md-3">

                                        <div className="border rounded p-2">

                                            <small className="text-muted">
                                                Debt
                                            </small>

                                            <div className="text-warning fw-bold">
                                                {formatAmount(
                                                    monthData.totalDebt
                                                )}
                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* Transaction Table */}

                                <div className="table-responsive">

                                    <table className="table table-hover table-bordered align-middle mb-0">

                                        <thead className="table-light">

                                            <tr>

                                                <th>
                                                    Date
                                                </th>

                                                <th>
                                                    Type
                                                </th>

                                                <th>
                                                    Category
                                                </th>

                                                <th>
                                                    Description
                                                </th>

                                                <th className="text-end">
                                                    Amount
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {transactions.map(
                                                (transaction) => {

                                                    const amount =
                                                        Number(
                                                            transaction.amount
                                                        ) || 0;


                                                    return (

                                                        <tr
                                                            key={
                                                                transaction._id
                                                            }
                                                        >

                                                            <td>
                                                                {transaction.date
                                                                    ? new Date(
                                                                        transaction.date
                                                                    ).toLocaleDateString(
                                                                        "en-IN"
                                                                    )
                                                                    : "-"}
                                                            </td>


                                                            <td>

                                                                <span
                                                                    className={`fw-semibold ${getTypeClass(
                                                                        transaction.type
                                                                    )}`}
                                                                >
                                                                    {
                                                                        transaction.type
                                                                    }
                                                                </span>

                                                            </td>


                                                            <td>
                                                                {
                                                                    transaction.category?.name ||
                                                                    transaction.categoryName ||
                                                                    "-"
                                                                }
                                                            </td>


                                                            <td>
                                                                {
                                                                    transaction.description ||
                                                                    transaction.note ||
                                                                    "-"
                                                                }
                                                            </td>


                                                            <td className="text-end fw-semibold">

                                                                {formatAmount(
                                                                    amount
                                                                )}

                                                            </td>

                                                        </tr>

                                                    );

                                                }
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );
};

export default MonthlyChart;