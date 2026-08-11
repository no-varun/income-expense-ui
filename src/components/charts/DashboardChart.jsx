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
    },
    year = "all"
}) => {

    /*
     * API data
     */
    const income = data?.income || [];
    const expense = data?.expense || [];

    const saving =
        data?.Saving ||
        data?.saving ||
        [];

    const debt =
        data?.Debt ||
        data?.debt ||
        [];

    const pendingDebt =
        data?.pendingDebt ||
        data?.PendingDebt ||
        [];


    /*
     * Check selected filter
     */
    const isAll =
        String(year).toLowerCase() === "all";


    /*
     * Get all available months
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
        .filter(
            month =>
                Number.isFinite(month) &&
                month >= 1 &&
                month <= 12
        )
        .sort((a, b) => a - b);


    /*
     * Month names
     */
    const monthLabels = labels.map(month => {

        return new Date(
            2000,
            month - 1,
            1
        ).toLocaleString(
            "default",
            {
                month: "short"
            }
        );

    });


    /*
     * Find value for month
     */
    const getMonthValue = (
        items,
        month
    ) => {

        const row = items.find(
            item =>
                Number(item._id) === month
        );

        return row
            ? Number(row.total) || 0
            : 0;

    };


    /*
     * Create monthly rows
     */
    const rows = labels.map(
        (month, index) => {

            const incomeValue =
                getMonthValue(
                    income,
                    month
                );

            const expenseValue =
                getMonthValue(
                    expense,
                    month
                );

            const savingValue =
                getMonthValue(
                    saving,
                    month
                );

            const debtValue =
                getMonthValue(
                    debt,
                    month
                );

            const pendingDebtValue =
                getMonthValue(
                    pendingDebt,
                    month
                );


            return {

                month,

                monthName:
                    monthLabels[index],

                income:
                    incomeValue,

                expense:
                    expenseValue,

                saving:
                    savingValue,

                debt:
                    debtValue,

                pendingDebt:
                    pendingDebtValue

            };

        }
    );


    /*
     * Chart data
     */
    const chartData = {

        labels: monthLabels,

        datasets: [

            {
                label: "Income",

                data: labels.map(
                    month =>
                        getMonthValue(
                            income,
                            month
                        )
                ),

                backgroundColor:
                    incomeColor,

                borderColor:
                    incomeBorderColor,

                borderWidth: 1
            },


            {
                label: "Expense",

                data: labels.map(
                    month =>
                        getMonthValue(
                            expense,
                            month
                        )
                ),

                backgroundColor:
                    expenseColor,

                borderColor:
                    expenseBorderColor,

                borderWidth: 1
            },


            {
                label: "Saving",

                data: labels.map(
                    month =>
                        getMonthValue(
                            saving,
                            month
                        )
                ),

                backgroundColor:
                    "#198754",

                borderColor:
                    "#146c43",

                borderWidth: 1
            },


            {
                label: "Debt",

                data: labels.map(
                    month =>
                        getMonthValue(
                            debt,
                            month
                        )
                ),

                backgroundColor:
                    "#ffc107",

                borderColor:
                    "#cc9a06",

                borderWidth: 1
            },


            {
                label: "Pending Debt",

                data: labels.map(
                    month =>
                        getMonthValue(
                            pendingDebt,
                            month
                        )
                ),

                backgroundColor:
                    "#0dcaf0",

                borderColor:
                    "#0aa2c0",

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

                text: isAll
                    ? "Dashboard Income vs Expense - All"
                    : `Dashboard Income vs Expense - ${year}`

            },

            tooltip: {

                callbacks: {

                    label: context => {

                        const value =
                            Number(
                                context.raw
                            ) || 0;

                        return (
                            `${context.dataset.label}: ₹` +
                            value.toLocaleString(
                                "en-IN",
                                {
                                    maximumFractionDigits: 2
                                }
                            )
                        );

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

                        return (
                            `₹${Number(
                                value
                            ).toLocaleString(
                                "en-IN"
                            )}`
                        );

                    }

                }

            }

        }

    };


    /*
     * Currency formatter
     */
    const formatCurrency = value => {

        return `₹${Number(
            value || 0
        ).toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        )}`;

    };


    return (

        <div className="card shadow mb-4">

            {/* Header */}
            <div className="card-header">

                <div className="d-flex justify-content-between align-items-center">

                    <h5 className="mb-0">
                        Dashboard Chart (₹)
                    </h5>

                    <span className="text-muted">
                        {
                            isAll
                                ? "All"
                                : year
                        }
                    </span>

                </div>

            </div>


            {/* Chart */}
            <div
                className="card-body"
                style={{
                    minWidth: 0,
                    position: "relative",
                    height: "450px"
                }}
            >

                {
                    labels.length > 0 ? (

                        <Bar
                            data={chartData}
                            options={options}
                        />

                    ) : (

                        <div className="d-flex justify-content-center align-items-center h-100 text-muted">

                            No chart data available

                        </div>

                    )
                }

            </div>


            {/* Monthly List */}
            {
                rows.length > 0 && (

                    <div className="card-body pt-0">

                        <h6 className="mb-3">
                            Monthly Summary
                        </h6>


                        <div className="table-responsive">

                            <table className="table table-bordered table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>
                                            Month
                                        </th>

                                        <th className="text-end">
                                            Income
                                        </th>

                                        <th className="text-end">
                                            Expense
                                        </th>

                                        <th className="text-end">
                                            Saving
                                        </th>

                                        <th className="text-end">
                                            Debt
                                        </th>

                                        <th className="text-end">
                                            Pending Debt
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        rows.map(row => (

                                            <tr
                                                key={row.month}
                                            >

                                                <td>
                                                    <strong>
                                                        {row.monthName}
                                                    </strong>
                                                </td>


                                                <td className="text-end">
                                                    {formatCurrency(
                                                        row.income
                                                    )}
                                                </td>


                                                <td className="text-end">
                                                    {formatCurrency(
                                                        row.expense
                                                    )}
                                                </td>


                                                <td className="text-end">
                                                    {formatCurrency(
                                                        row.saving
                                                    )}
                                                </td>


                                                <td className="text-end">
                                                    {formatCurrency(
                                                        row.debt
                                                    )}
                                                </td>


                                                <td className="text-end">
                                                    {formatCurrency(
                                                        row.pendingDebt
                                                    )}
                                                </td>

                                            </tr>

                                        ))
                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                )

            }

        </div>

    );

};


export default DashboardChart;