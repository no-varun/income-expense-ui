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


/* =========================================================
   Colors
========================================================= */

const savingColor = "#198754";
const savingBorderColor = "#146c43";

const debtColor = "#ffc107";
const debtBorderColor = "#cc9a06";

const pendingDebtColor = "#0dcaf0";
const pendingDebtBorderColor = "#0aa2c0";


/* =========================================================
   Format Date
========================================================= */

const formatDate = (date) => {

    if (!date) {
        return "-";
    }

    const parsedDate = new Date(
        `${date}T00:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
};


/* =========================================================
   Format Amount
========================================================= */

const formatAmount = (amount) => {

    return Number(
        amount || 0
    ).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );
};


/* =========================================================
   Daily Section
========================================================= */

const DailySection = ({
    title,
    tableTitle,
    data = [],
    field,
    color,
    borderColor,
    badgeColor,
    amountLabel
}) => {

    const rows = Array.isArray(data)
        ? data
        : [];


    /* -----------------------------------------------------
       Total
    ----------------------------------------------------- */

    const total = rows.reduce(
        (sum, item) =>
            sum + Number(item[field] || 0),
        0
    );


    /* -----------------------------------------------------
       Chart Data
    ----------------------------------------------------- */

    const chartData = {

        labels: rows.map(
            item => item.day
        ),

        datasets: [

            {
                label: title,

                data: rows.map(
                    item =>
                        Number(
                            item[field] || 0
                        )
                ),

                backgroundColor: color,

                borderColor: borderColor,

                borderWidth: 1
            }

        ]

    };


    /* -----------------------------------------------------
       Chart Options
    ----------------------------------------------------- */

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

                text: title

            },

            tooltip: {

                callbacks: {

                    label: context => {

                        return `${context.dataset.label}: ₹${formatAmount(
                            context.raw
                        )}`;

                    }

                }

            }

        },

        scales: {

            x: {

                title: {

                    display: true,

                    text: "Day"

                }

            },

            y: {

                beginAtZero: true,

                ticks: {

                    callback: value => {

                        return `₹${Number(
                            value
                        ).toLocaleString(
                            "en-IN"
                        )}`;

                    }

                }

            }

        }

    };


    return (

        <div className="card shadow h-100">

            {/* =========================================
                Header
            ========================================= */}

            <div className="card-header d-flex justify-content-between align-items-center gap-2">

                <h5 className="mb-0">
                    {title}
                </h5>

                <span
                    className={`badge ${badgeColor}`}
                    style={{
                        whiteSpace: "nowrap"
                    }}
                >
                    ₹{formatAmount(total)}
                </span>

            </div>


            {/* =========================================
                Chart
            ========================================= */}

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

                        No data found

                    </div>

                )}

            </div>


            {/* =========================================
                Table
            ========================================= */}

            <div className="border-top">

                <div className="px-3 py-2 bg-light">

                    <h6 className="mb-0">
                        {tableTitle}
                    </h6>

                </div>


                <div className="table-responsive">

                    <table className="table table-bordered table-hover mb-0">

                        <thead>

                            <tr>

                                <th>
                                    Date
                                </th>

                                <th>
                                    {amountLabel}
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {rows.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="2"
                                        className="text-center text-muted"
                                    >
                                        No data found
                                    </td>

                                </tr>

                            ) : (

                                rows.map(item => (

                                    <tr
                                        key={
                                            `${item.date}-${field}`
                                        }
                                    >

                                        <td>
                                            {formatDate(
                                                item.date
                                            )}
                                        </td>

                                        <td>

                                            <span
                                                className={`badge ${badgeColor}`}
                                            >
                                                ₹
                                                {formatAmount(
                                                    item[field]
                                                )}
                                            </span>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );
};


/* =========================================================
   Daily Chart
========================================================= */

const DailyChart = ({
    data = [],
    month,
    year
}) => {

    const rows = Array.isArray(data)
        ? data
        : [];


    /*
     * month and year are no longer required
     * because API already gives:
     *
     * date: "2026-08-01"
     *
     * Keeping them in props prevents breaking
     * your existing component usage.
     */


    return (

        <div className="container-fluid px-0">

            {/* =========================================
                Page Header
            ========================================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3 className="mb-0">
                    Daily Charts
                </h3>

            </div>


            {/* =========================================
                5 Charts + 5 Tables
            ========================================= */}

            <div className="row g-4">


                {/* =====================================
                    1. Income
                ===================================== */}

                <div className="col-12 col-xl-6">

                    <DailySection
                        title="Daily Income"
                        tableTitle="Date Wise Income List"
                        data={rows}
                        field="income"
                        color={incomeColor}
                        borderColor={incomeBorderColor}
                        badgeColor="bg-success"
                        amountLabel="Total Income"
                    />

                </div>


                {/* =====================================
                    2. Expense
                ===================================== */}

                <div className="col-12 col-xl-6">

                    <DailySection
                        title="Daily Expense"
                        tableTitle="Date Wise Expense List"
                        data={rows}
                        field="expense"
                        color={expenseColor}
                        borderColor={expenseBorderColor}
                        badgeColor="bg-danger"
                        amountLabel="Total Expense"
                    />

                </div>


                {/* =====================================
                    3. Saving
                ===================================== */}

                <div className="col-12 col-xl-6">

                    <DailySection
                        title="Daily Saving"
                        tableTitle="Date Wise Saving List"
                        data={rows}
                        field="saving"
                        color={savingColor}
                        borderColor={savingBorderColor}
                        badgeColor="bg-success"
                        amountLabel="Total Saving"
                    />

                </div>


                {/* =====================================
                    4. Debt
                ===================================== */}

                <div className="col-12 col-xl-6">

                    <DailySection
                        title="Daily Debt"
                        tableTitle="Date Wise Debt List"
                        data={rows}
                        field="totalDebt"
                        color={debtColor}
                        borderColor={debtBorderColor}
                        badgeColor="bg-warning text-dark"
                        amountLabel="Total Debt"
                    />

                </div>


                {/* =====================================
                    5. Pending Debt
                ===================================== */}

                <div className="col-12 col-xl-6">

                    <DailySection
                        title="Daily Pending Debt"
                        tableTitle="Date Wise Pending Debt List"
                        data={rows}
                        field="pendingDebt"
                        color={pendingDebtColor}
                        borderColor={pendingDebtBorderColor}
                        badgeColor="bg-info text-dark"
                        amountLabel="Pending Debt"
                    />

                </div>

            </div>

        </div>

    );
};

export default DailyChart;