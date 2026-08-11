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


const PaymentModeChart = ({
    data = {
        income: [],
        expense: []
    }
}) => {

    const income = Array.isArray(data?.income)
        ? data.income
        : [];

    const expense = Array.isArray(data?.expense)
        ? data.expense
        : [];


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


    /*
     * Calculate total
     */
    const getTotal = items => {

        return items.reduce(
            (sum, item) =>
                sum + (Number(item.value) || 0),
            0
        );

    };


    const incomeTotal =
        getTotal(income);

    const expenseTotal =
        getTotal(expense);


    /*
     * Percentage
     */
    const getPercentage = (
        value,
        total
    ) => {

        if (!total) {
            return 0;
        }

        return (
            (Number(value) / total) *
            100
        );

    };


    /*
     * Income chart
     */
    const incomeChartData = {

        labels: income.map(
            item => item._id || "Unknown"
        ),

        datasets: [

            {
                label: "Income",

                data: income.map(
                    item =>
                        Number(item.value) || 0
                ),

                backgroundColor:
                    getSliceColors(
                        income.length
                    ),

                borderColor: "#ffffff",

                borderWidth: 2

            }

        ]

    };


    /*
     * Expense chart
     */
    const expenseChartData = {

        labels: expense.map(
            item => item._id || "Unknown"
        ),

        datasets: [

            {
                label: "Expense",

                data: expense.map(
                    item =>
                        Number(item.value) || 0
                ),

                backgroundColor:
                    getSliceColors(
                        expense.length,
                        4
                    ),

                borderColor: "#ffffff",

                borderWidth: 2

            }

        ]

    };


    /*
     * Common chart options
     */
    const chartOptions = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                position: "bottom"

            },

            tooltip: {

                callbacks: {

                    label: context => {

                        const value =
                            Number(
                                context.raw
                            ) || 0;

                        const total =
                            context.dataset.data.reduce(
                                (sum, item) =>
                                    sum +
                                    Number(item || 0),
                                0
                            );

                        const percentage =
                            getPercentage(
                                value,
                                total
                            );

                        return (
                            `${context.label}: ` +
                            `${formatCurrency(value)} ` +
                            `(${percentage.toFixed(2)}%)`
                        );

                    }

                }

            }

        }

    };


    return (

        <div className="row">


            {/* =========================
                INCOME
            ========================= */}

            <div className="col-md-6 mb-4">

                <div className="card shadow">

                    <div className="card-header">

                        <div className="d-flex justify-content-between align-items-center">

                            <h5 className="mb-0">
                                Income Payment Modes (₹)
                            </h5>

                            <strong>
                                {formatCurrency(
                                    incomeTotal
                                )}
                            </strong>

                        </div>

                    </div>


                    <div
                        className="card-body chart-body chart-body-pie"
                        style={{
                            height: "350px"
                        }}
                    >

                        {
                            income.length > 0 ? (

                                <Doughnut
                                    data={incomeChartData}
                                    options={chartOptions}
                                />

                            ) : (

                                <div className="d-flex justify-content-center align-items-center h-100 text-muted">

                                    No income payment data

                                </div>

                            )
                        }

                    </div>

                </div>

            </div>


            {/* =========================
                EXPENSE
            ========================= */}

            <div className="col-md-6 mb-4">

                <div className="card shadow">

                    <div className="card-header">

                        <div className="d-flex justify-content-between align-items-center">

                            <h5 className="mb-0">
                                Expense Payment Modes (₹)
                            </h5>

                            <strong>
                                {formatCurrency(
                                    expenseTotal
                                )}
                            </strong>

                        </div>

                    </div>


                    <div
                        className="card-body chart-body chart-body-pie"
                        style={{
                            height: "350px"
                        }}
                    >

                        {
                            expense.length > 0 ? (

                                <Doughnut
                                    data={expenseChartData}
                                    options={chartOptions}
                                />

                            ) : (

                                <div className="d-flex justify-content-center align-items-center h-100 text-muted">

                                    No expense payment data

                                </div>

                            )
                        }

                    </div>

                </div>

            </div>


            {/* =========================
                LIST / TABLE
            ========================= */}

            <div className="col-12">

                <div className="card shadow mb-4">

                    <div className="card-header">

                        <h5 className="mb-0">
                            Payment Mode Summary
                        </h5>

                    </div>


                    <div className="card-body">

                        <div className="row">


                            {/* Income List */}

                            <div className="col-md-6 mb-4">

                                <h6 className="mb-3">
                                    Income
                                </h6>


                                {
                                    income.length > 0 ? (

                                        <div className="table-responsive">

                                            <table className="table table-bordered table-hover align-middle mb-0">

                                                <thead className="table-light">

                                                    <tr>

                                                        <th>
                                                            Payment Mode
                                                        </th>

                                                        <th className="text-end">
                                                            Amount
                                                        </th>

                                                        <th className="text-end">
                                                            %
                                                        </th>

                                                    </tr>

                                                </thead>


                                                <tbody>

                                                    {
                                                        income.map(
                                                            (item, index) => {

                                                                const value =
                                                                    Number(
                                                                        item.value
                                                                    ) || 0;

                                                                const percentage =
                                                                    getPercentage(
                                                                        value,
                                                                        incomeTotal
                                                                    );


                                                                return (

                                                                    <tr
                                                                        key={`${item._id}-${index}`}
                                                                    >

                                                                        <td>
                                                                            <strong>
                                                                                {
                                                                                    item._id ||
                                                                                    "Unknown"
                                                                                }
                                                                            </strong>
                                                                        </td>

                                                                        <td className="text-end">
                                                                            {
                                                                                formatCurrency(
                                                                                    value
                                                                                )
                                                                            }
                                                                        </td>

                                                                        <td className="text-end">
                                                                            {
                                                                                percentage.toFixed(
                                                                                    2
                                                                                )
                                                                            }%
                                                                        </td>

                                                                    </tr>

                                                                );

                                                            }
                                                        )
                                                    }

                                                </tbody>


                                                <tfoot className="table-light">

                                                    <tr>

                                                        <th>
                                                            Total
                                                        </th>

                                                        <th className="text-end">
                                                            {
                                                                formatCurrency(
                                                                    incomeTotal
                                                                )
                                                            }
                                                        </th>

                                                        <th className="text-end">
                                                            100%
                                                        </th>

                                                    </tr>

                                                </tfoot>

                                            </table>

                                        </div>

                                    ) : (

                                        <div className="text-muted">
                                            No income payment data
                                        </div>

                                    )
                                }

                            </div>


                            {/* Expense List */}

                            <div className="col-md-6 mb-4">

                                <h6 className="mb-3">
                                    Expense
                                </h6>


                                {
                                    expense.length > 0 ? (

                                        <div className="table-responsive">

                                            <table className="table table-bordered table-hover align-middle mb-0">

                                                <thead className="table-light">

                                                    <tr>

                                                        <th>
                                                            Payment Mode
                                                        </th>

                                                        <th className="text-end">
                                                            Amount
                                                        </th>

                                                        <th className="text-end">
                                                            %
                                                        </th>

                                                    </tr>

                                                </thead>


                                                <tbody>

                                                    {
                                                        expense.map(
                                                            (item, index) => {

                                                                const value =
                                                                    Number(
                                                                        item.value
                                                                    ) || 0;

                                                                const percentage =
                                                                    getPercentage(
                                                                        value,
                                                                        expenseTotal
                                                                    );


                                                                return (

                                                                    <tr
                                                                        key={`${item._id}-${index}`}
                                                                    >

                                                                        <td>
                                                                            <strong>
                                                                                {
                                                                                    item._id ||
                                                                                    "Unknown"
                                                                                }
                                                                            </strong>
                                                                        </td>

                                                                        <td className="text-end">
                                                                            {
                                                                                formatCurrency(
                                                                                    value
                                                                                )
                                                                            }
                                                                        </td>

                                                                        <td className="text-end">
                                                                            {
                                                                                percentage.toFixed(
                                                                                    2
                                                                                )
                                                                            }%
                                                                        </td>

                                                                    </tr>

                                                                );

                                                            }
                                                        )
                                                    }

                                                </tbody>


                                                <tfoot className="table-light">

                                                    <tr>

                                                        <th>
                                                            Total
                                                        </th>

                                                        <th className="text-end">
                                                            {
                                                                formatCurrency(
                                                                    expenseTotal
                                                                )
                                                            }
                                                        </th>

                                                        <th className="text-end">
                                                            100%
                                                        </th>

                                                    </tr>

                                                </tfoot>

                                            </table>

                                        </div>

                                    ) : (

                                        <div className="text-muted">
                                            No expense payment data
                                        </div>

                                    )
                                }

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};
export default PaymentModeChart;