import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

import { getSliceColors } from "./chartColors";

/*
 * ============================================================
 * CENTER TEXT PLUGIN
 * ============================================================
 */

const centerTextPlugin = {
    id: "centerText",

    beforeDraw(chart, args, options) {
        if (!options?.display) {
            return;
        }

        const meta = chart.getDatasetMeta(0);

        if (!meta.data.length) {
            return;
        }

        const { ctx } = chart;

        const x = meta.data[0].x;
        const y = meta.data[0].y;

        ctx.save();

        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "#212529";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            `₹${Number(options.total || 0).toLocaleString("en-IN", {
                maximumFractionDigits: 2,
            })}`,
            x,
            y
        );

        ctx.restore();
    },
};

/*
 * ============================================================
 * REGISTER CHART
 * ============================================================
 */

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    centerTextPlugin
);

/*
 * ============================================================
 * CURRENCY FORMATTER
 * ============================================================
 */

const formatCurrency = value => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    })}`;
};

/*
 * ============================================================
 * PERCENTAGE
 * ============================================================
 */

const getPercentage = (value, total) => {
    if (!total) {
        return 0;
    }

    return (Number(value) / Number(total)) * 100;
};

/*
 * ============================================================
 * PIE CARD
 * ============================================================
 */

const PieCard = ({
    title,
    badgeColor,
    data = [],
    total = 0,
    pendingTotal = 0,
    recoveredTotal = 0,
    isDebt = false,
    offset = 0,
}) => {
    return (
        <div className="col-12 col-md-6 col-xl-4">
            <div
                className="card shadow-sm h-100"
                style={{
                    overflow: "hidden",
                    minWidth: 0,
                }}
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6
                            className="mb-0 text-truncate"
                            title={title}
                        >
                            {title}
                        </h6>

                        <span
                            className={`badge ${badgeColor} fs-6`}
                        >
                            {formatCurrency(total)}
                        </span>
                    </div>

                    {/* =================================================
                        DEBT SUMMARY
                    ================================================= */}

                    {isDebt && (
                        <div className="row mt-3 g-2">

                            {/* ACTUAL */}

                            <div className="col-4">
                                <div className="border rounded p-2 text-center">
                                    <div className="small text-muted">
                                        Actual
                                    </div>

                                    <div className="fw-bold">
                                        {formatCurrency(total)}
                                    </div>
                                </div>
                            </div>

                            {/* PENDING */}

                            <div className="col-4">
                                <div className="border rounded p-2 text-center">
                                    <div className="small text-muted">
                                        Pending
                                    </div>

                                    <div className="fw-bold text-warning">
                                        {formatCurrency(pendingTotal)}
                                    </div>
                                </div>
                            </div>

                            {/* RECOVERED */}

                            <div className="col-4">
                                <div className="border rounded p-2 text-center">
                                    <div className="small text-muted">
                                        Recovered
                                    </div>

                                    <div className="fw-bold text-success">
                                        {formatCurrency(recoveredTotal)}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* =================================================
                    CHART
                ================================================= */}

                <div
                    className="card-body"
                    style={{
                        height: 350,
                        position: "relative",
                    }}
                >
                    {data.length > 0 ? (
                        <Pie
                            data={{
                                labels: data.map(
                                    item =>
                                        item.label ||
                                        item.title ||
                                        "Unknown"
                                ),

                                datasets: [
                                    {
                                        data: data.map(
                                            item =>
                                                Number(item.amount) || 0
                                        ),

                                        backgroundColor:
                                            getSliceColors(
                                                data.length,
                                                offset
                                            ),

                                        borderColor: "#fff",

                                        borderWidth: 2,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,

                                maintainAspectRatio: false,

                                plugins: {
                                    legend: {
                                        position: "bottom",

                                        labels: {
                                            boxWidth: 12,
                                            padding: 10,
                                            usePointStyle: true,
                                        },
                                    },

                                    tooltip: {
                                        callbacks: {
                                            label: context => {
                                                const value =
                                                    Number(
                                                        context.raw
                                                    ) || 0;

                                                const totalValue =
                                                    context.dataset.data.reduce(
                                                        (sum, item) =>
                                                            sum +
                                                            Number(item),
                                                        0
                                                    );

                                                const percentage =
                                                    getPercentage(
                                                        value,
                                                        totalValue
                                                    );

                                                return (
                                                    `${context.label}: ` +
                                                    `${formatCurrency(value)} ` +
                                                    `(${percentage.toFixed(
                                                        2
                                                    )}%)`
                                                );
                                            },
                                        },
                                    },

                                    centerText: {
                                        display: true,
                                        total,
                                    },
                                },
                            }}
                        />
                    ) : (
                        <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                            No data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/*
 * ============================================================
 * TITLE TABLE
 * ============================================================
 */

const TitleTable = ({
    title,
    data = [],
    total = 0,
    pendingTotal = 0,
    recoveredTotal = 0,
    isDebt = false,
}) => {
    return (
        <div className="col-12 mb-4">
            <div className="card shadow-sm">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">
                            {title}
                        </h6>

                        <strong>
                            {formatCurrency(total)}
                        </strong>
                    </div>

                    {/* =================================================
                        DEBT HEADER SUMMARY
                    ================================================= */}

                    {isDebt && (
                        <div className="row mt-3 g-2">

                            <div className="col-4">
                                <div className="bg-light rounded p-2">
                                    <div className="small text-muted">
                                        Actual Debt
                                    </div>

                                    <div className="fw-bold">
                                        {formatCurrency(total)}
                                    </div>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="bg-light rounded p-2">
                                    <div className="small text-muted">
                                        Pending Debt
                                    </div>

                                    <div className="fw-bold text-warning">
                                        {formatCurrency(pendingTotal)}
                                    </div>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="bg-light rounded p-2">
                                    <div className="small text-muted">
                                        Recovered
                                    </div>

                                    <div className="fw-bold text-success">
                                        {formatCurrency(recoveredTotal)}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="card-body p-0">

                    {data.length > 0 ? (

                        <div className="table-responsive">

                            <table className="table table-bordered table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>
                                            Title
                                        </th>

                                        {/* EXISTS */}

                                        <th>
                                            Exists
                                        </th>

                                        {/* ACTUAL */}

                                        <th className="text-end">
                                            Actual
                                        </th>

                                        {/* PENDING */}

                                        {isDebt && (
                                            <th className="text-end">
                                                Pending
                                            </th>
                                        )}

                                        {/* RECOVERED */}

                                        {isDebt && (
                                            <th className="text-end">
                                                Recovered
                                            </th>
                                        )}

                                        {/* COUNT */}

                                        <th className="text-end">
                                            Count
                                        </th>

                                        {/* PERCENT */}

                                        <th className="text-end">
                                            %
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {data.map(
                                        (item, index) => {

                                            const actual =
                                                Number(
                                                    item.amount
                                                ) || 0;

                                            const pending =
                                                isDebt
                                                    ? Number(
                                                        item.pendingAmount
                                                    ) || 0
                                                    : 0;

                                            const recovered =
                                                isDebt
                                                    ? Math.max(
                                                        0,
                                                        actual -
                                                        pending
                                                    )
                                                    : 0;

                                            const percentage =
                                                getPercentage(
                                                    actual,
                                                    total
                                                );

                                            const label =
                                                item.label ||
                                                item.title ||
                                                "Unknown";

                                            const exists =
                                                String(
                                                    item.exists || "no"
                                                ).toLowerCase();

                                            return (

                                                <tr
                                                    key={`${label}-${index}`}
                                                >

                                                    {/* TITLE */}

                                                    <td>
                                                        <strong>
                                                            {label}
                                                        </strong>
                                                    </td>

                                                    {/* EXISTS */}

                                                    <td>
                                                        <span
                                                            className={
                                                                exists === "yes"
                                                                    ? "badge bg-success"
                                                                    : "badge bg-danger"
                                                            }
                                                        >
                                                            {exists === "yes"
                                                                ? "Yes"
                                                                : "No"}
                                                        </span>
                                                    </td>

                                                    {/* ACTUAL */}

                                                    <td className="text-end">
                                                        {formatCurrency(
                                                            actual
                                                        )}
                                                    </td>

                                                    {/* PENDING */}

                                                    {isDebt && (
                                                        <td className="text-end text-warning">
                                                            {formatCurrency(
                                                                pending
                                                            )}
                                                        </td>
                                                    )}

                                                    {/* RECOVERED */}

                                                    {isDebt && (
                                                        <td className="text-end text-success">
                                                            {formatCurrency(
                                                                recovered
                                                            )}
                                                        </td>
                                                    )}

                                                    {/* COUNT */}

                                                    <td className="text-end">
                                                        {Number(
                                                            item.count
                                                        ) || 0}
                                                    </td>

                                                    {/* PERCENT */}

                                                    <td className="text-end">
                                                        {percentage.toFixed(
                                                            2
                                                        )}
                                                        %
                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                                {/* =================================================
                                    FOOTER
                                ================================================= */}

                                <tfoot className="table-light">

                                    <tr>

                                        <th>
                                            Total
                                        </th>

                                        {/* EXISTS EMPTY */}

                                        <th>
                                            -
                                        </th>

                                        {/* ACTUAL TOTAL */}

                                        <th className="text-end">
                                            {formatCurrency(total)}
                                        </th>

                                        {/* PENDING TOTAL */}

                                        {isDebt && (
                                            <th className="text-end text-warning">
                                                {formatCurrency(
                                                    pendingTotal
                                                )}
                                            </th>
                                        )}

                                        {/* RECOVERED TOTAL */}

                                        {isDebt && (
                                            <th className="text-end text-success">
                                                {formatCurrency(
                                                    recoveredTotal
                                                )}
                                            </th>
                                        )}

                                        {/* COUNT */}

                                        <th className="text-end">
                                            {data.reduce(
                                                (
                                                    sum,
                                                    item
                                                ) =>
                                                    sum +
                                                    (
                                                        Number(
                                                            item.count
                                                        ) || 0
                                                    ),
                                                0
                                            )}
                                        </th>

                                        {/* PERCENT */}

                                        <th className="text-end">
                                            100%
                                        </th>

                                    </tr>

                                </tfoot>

                            </table>

                        </div>

                    ) : (

                        <div className="p-3 text-muted">
                            No title data available
                        </div>

                    )}

                </div>

            </div>
        </div>
    );
};

/*
 * ============================================================
 * MAIN COMPONENT
 * ============================================================
 */

const TitleTypeChart = ({
    data = {},
}) => {

    /*
     * ========================================================
     * API DATA
     * ========================================================
     */

    const apiData = Array.isArray(data?.data)
        ? data.data
        : [];

    const apiTotals =
        data?.totals || {};

    /*
     * ========================================================
     * GET TYPE DATA
     * ========================================================
     */

    const getTypeData = type => {

        return apiData

            .filter(
                item =>
                    String(
                        item?.type || ""
                    ).toLowerCase() ===
                    String(type).toLowerCase()
            )

            .map(item => ({

                label:
                    item?.title ||
                    "Unknown",

                amount:
                    Number(
                        item?.amount
                    ) || 0,

                pendingAmount:
                    Number(
                        item?.pendingAmount
                    ) || 0,

                count:
                    Number(
                        item?.count
                    ) || 0,

                // EXISTS
                exists:
                    String(
                        item?.exists || "no"
                    ).toLowerCase(),

            }));

    };

    /*
     * ========================================================
     * TOTAL ACTUAL
     * ========================================================
     */

    const getTypeTotal = type => {

        return Number(
            apiTotals?.[type]?.amount
        ) || 0;

    };

    /*
     * ========================================================
     * TOTAL PENDING
     * ========================================================
     */

    const getPendingTotal = type => {

        return Number(
            apiTotals?.[type]?.pendingAmount
        ) || 0;

    };

    /*
     * ========================================================
     * RECOVERED
     *
     * Actual - Pending
     * ========================================================
     */

    const getRecoveredTotal = type => {

        const actual =
            getTypeTotal(type);

        const pending =
            getPendingTotal(type);

        return Math.max(
            0,
            actual - pending
        );

    };

    /*
     * ========================================================
     * CHART CONFIG
     * ========================================================
     */

    const charts = [

        {
            title: "Income Title",

            badgeColor:
                "bg-success",

            data:
                getTypeData(
                    "Income"
                ),

            total:
                getTypeTotal(
                    "Income"
                ),

            pendingTotal: 0,

            recoveredTotal: 0,

            isDebt: false,

            offset: 0,
        },

        {
            title: "Expense Title",

            badgeColor:
                "bg-danger",

            data:
                getTypeData(
                    "Expense"
                ),

            total:
                getTypeTotal(
                    "Expense"
                ),

            pendingTotal: 0,

            recoveredTotal: 0,

            isDebt: false,

            offset: 4,
        },

        {
            title: "Saving Title",

            badgeColor:
                "bg-primary",

            data:
                getTypeData(
                    "Saving"
                ),

            total:
                getTypeTotal(
                    "Saving"
                ),

            pendingTotal: 0,

            recoveredTotal: 0,

            isDebt: false,

            offset: 8,
        },

        {
            title: "Debt Title",

            badgeColor:
                "bg-warning text-dark",

            data:
                getTypeData(
                    "Debt"
                ),

            total:
                getTypeTotal(
                    "Debt"
                ),

            pendingTotal:
                getPendingTotal(
                    "Debt"
                ),

            recoveredTotal:
                getRecoveredTotal(
                    "Debt"
                ),

            isDebt: true,

            offset: 12,
        },

    ];

    /*
     * ========================================================
     * RENDER
     * ========================================================
     */

    return (

        <div
            className="container-fluid px-0"
            style={{
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
            }}
        >

            {/* =================================================
                PIE CHARTS
            ================================================= */}

            <div className="row g-3 mx-0">

                {charts.map(
                    chart => (

                        <PieCard
                            key={
                                chart.title
                            }

                            title={
                                chart.title
                            }

                            badgeColor={
                                chart.badgeColor
                            }

                            data={
                                chart.data
                            }

                            total={
                                chart.total
                            }

                            pendingTotal={
                                chart.pendingTotal
                            }

                            recoveredTotal={
                                chart.recoveredTotal
                            }

                            isDebt={
                                chart.isDebt
                            }

                            offset={
                                chart.offset
                            }
                        />

                    )
                )}

            </div>

            {/* =================================================
                TABLES
            ================================================= */}

            <div className="row mt-3">

                {charts.map(
                    chart => (

                        <TitleTable
                            key={
                                `${chart.title}-table`
                            }

                            title={
                                chart.title
                            }

                            data={
                                chart.data
                            }

                            total={
                                chart.total
                            }

                            pendingTotal={
                                chart.pendingTotal
                            }

                            recoveredTotal={
                                chart.recoveredTotal
                            }

                            isDebt={
                                chart.isDebt
                            }
                        />

                    )
                )}

            </div>

        </div>

    );
};

export default TitleTypeChart;