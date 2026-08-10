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
   Dataset Colors
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

    if (!date) return "-";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};


/* =========================================================
   Format Amount
========================================================= */

const formatAmount = (amount) => {

    return Number(amount || 0).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );
};


/* =========================================================
   Weekly Chart + Table
========================================================= */

const WeeklySection = ({
    title,
    tableTitle,
    data = [],
    color,
    borderColor,
    badgeColor = "bg-primary",
    amountLabel = "Total"
}) => {

    const rows = Array.isArray(data)
        ? data
        : [];


    /* -----------------------------------------------------
       Total
    ----------------------------------------------------- */

    const total = rows.reduce(
        (sum, item) =>
            sum + Number(item.total || 0),
        0
    );


    /* -----------------------------------------------------
       Labels
    ----------------------------------------------------- */

    const labels = [
        ...new Set(
            rows.map(item => item._id)
        )
    ].sort();


    /* -----------------------------------------------------
       Chart Data
    ----------------------------------------------------- */

    const chartData = {

        labels: labels.map(
            label => formatDate(label)
        ),

        datasets: [

            {
                label: title,

                data: labels.map(label => {

                    const row = rows.find(
                        item =>
                            item._id === label
                    );

                    return row
                        ? Number(row.total || 0)
                        : 0;
                }),

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

                ticks: {
                    maxRotation: 45,
                    minRotation: 0
                }

            },

            y: {

                beginAtZero: true,

                ticks: {

                    callback: value =>
                        `₹${Number(
                            value
                        ).toLocaleString("en-IN")}`

                }

            }

        }

    };


    return (

        <div className="card shadow h-100">

            {/* =========================================
                Chart Header
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

                                    <tr key={item._id}>

                                        <td>
                                            {formatDate(
                                                item._id
                                            )}
                                        </td>

                                        <td>

                                            <span
                                                className={`badge ${badgeColor}`}
                                            >
                                                ₹
                                                {formatAmount(
                                                    item.total
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
   Weekly Chart Page
========================================================= */

const WeeklyChart = ({
    data = {
        income: [],
        expense: [],
        saving: [],
        totalDebt: [],
        pendingDebt: []
    }
}) => {

    const income =
        Array.isArray(data.income)
            ? data.income
            : [];

    const expense =
        Array.isArray(data.expense)
            ? data.expense
            : [];

    const saving =
        Array.isArray(data.saving)
            ? data.saving
            : [];

    const totalDebt =
        Array.isArray(data.totalDebt)
            ? data.totalDebt
            : [];

    const pendingDebt =
        Array.isArray(data.pendingDebt)
            ? data.pendingDebt
            : [];


    return (

        <div className="container-fluid px-0">

            {/* =========================================
                Page Heading
            ========================================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3 className="mb-0">
                    Weekly Charts
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

                    <WeeklySection
                        title="Weekly Income"
                        tableTitle="Date Wise Income List"
                        data={income}
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

                    <WeeklySection
                        title="Weekly Expense"
                        tableTitle="Date Wise Expense List"
                        data={expense}
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

                    <WeeklySection
                        title="Weekly Saving"
                        tableTitle="Date Wise Saving List"
                        data={saving}
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

                    <WeeklySection
                        title="Weekly Debt"
                        tableTitle="Date Wise Debt List"
                        data={totalDebt}
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

                    <WeeklySection
                        title="Weekly Pending Debt"
                        tableTitle="Date Wise Pending Debt List"
                        data={pendingDebt}
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

export default WeeklyChart;