import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

import { getSliceColors } from "./chartColors";


/*
 * Center text plugin
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
            `₹${Number(
                options.total || 0
            ).toLocaleString("en-IN", {
                maximumFractionDigits: 2
            })}`,
            x,
            y
        );

        ctx.restore();
    },
};


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    centerTextPlugin
);


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
 * Get percentage
 */
const getPercentage = (
    value,
    total
) => {

    if (!total) {
        return 0;
    }

    return (
        (Number(value) / Number(total)) * 100
    );

};


/*
 * Pie Card
 */
const PieCard = ({
    title,
    badgeColor,
    data = [],
    total = 0,
    offset = 0,
}) => {

    return (

        <div className="col-12 col-md-6 col-xl-4">

            <div
                className="card shadow-sm h-100 w-100"
                style={{
                    overflow: "hidden",
                    minWidth: 0,
                }}
            >

                {/* Header */}

                <div className="card-header d-flex justify-content-between align-items-center gap-2">

                    <h6
                        className="mb-0 text-truncate"
                        title={title}
                    >
                        {title}
                    </h6>

                    <span
                        className={`badge ${badgeColor} fs-6`}
                        style={{
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                        }}
                    >
                        {formatCurrency(total)}
                    </span>

                </div>


                {/* Chart */}

                <div
                    className="card-body"
                    style={{
                        height: 350,
                        minWidth: 0,
                        position: "relative",
                    }}
                >

                    {data.length > 0 ? (

                        <Pie
                            data={{
                                labels: data.map(
                                    item =>
                                        item.label ||
                                        item._id ||
                                        "Unknown"
                                ),

                                datasets: [
                                    {
                                        data: data.map(
                                            item =>
                                                Number(
                                                    item.value
                                                ) || 0
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

                                layout: {
                                    padding: {
                                        top: 10,
                                        bottom: 10,
                                        left: 10,
                                        right: 10,
                                    },
                                },

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
                                                        (
                                                            sum,
                                                            item
                                                        ) =>
                                                            sum +
                                                            (
                                                                Number(
                                                                    item
                                                                ) || 0
                                                            ),
                                                        0
                                                    );

                                                const percentage =
                                                    getPercentage(
                                                        value,
                                                        totalValue
                                                    );

                                                return (
                                                    `${context.label}: ` +
                                                    `${formatCurrency(
                                                        value
                                                    )} ` +
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
 * Category Table
 */
const CategoryTable = ({
    title,
    data = [],
    total = 0,
}) => {

    return (

        <div className="col-12 col-lg-6 mb-4">

            <div className="card shadow-sm">

                <div className="card-header d-flex justify-content-between align-items-center">

                    <h6 className="mb-0">
                        {title}
                    </h6>

                    <strong>
                        {formatCurrency(total)}
                    </strong>

                </div>


                <div className="card-body p-0">

                    {data.length > 0 ? (

                        <div className="table-responsive">

                            <table className="table table-bordered table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>
                                            Category
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

                                    {data.map(
                                        (item, index) => {

                                            const value =
                                                Number(
                                                    item.value
                                                ) || 0;

                                            const percentage =
                                                getPercentage(
                                                    value,
                                                    total
                                                );

                                            return (

                                                <tr
                                                    key={
                                                        `${item.label || item._id}-${index}`
                                                    }
                                                >

                                                    <td>

                                                        <strong>
                                                            {
                                                                item.label ||
                                                                item._id ||
                                                                "Unknown"
                                                            }
                                                        </strong>

                                                    </td>


                                                    <td className="text-end">

                                                        {formatCurrency(
                                                            value
                                                        )}

                                                    </td>


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


                                <tfoot className="table-light">

                                    <tr>

                                        <th>
                                            Total
                                        </th>

                                        <th className="text-end">
                                            {formatCurrency(total)}
                                        </th>

                                        <th className="text-end">
                                            {data.length > 0
                                                ? "100%"
                                                : "0%"}
                                        </th>

                                    </tr>

                                </tfoot>

                            </table>

                        </div>

                    ) : (

                        <div className="p-3 text-muted">
                            No category data available
                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};


/*
 * Main Category Chart
 */
const CategoryChart = ({
    data = {}
}) => {

    const charts = [

        {
            title: "Income Category",
            badgeColor: "bg-success",
            data: data.income || [],
            total: data.totalIncome || 0,
            offset: 0,
        },

        {
            title: "Expense Category",
            badgeColor: "bg-danger",
            data: data.expense || [],
            total: data.totalExpense || 0,
            offset: 4,
        },

        {
            title: "Saving Category",
            badgeColor: "bg-primary",
            data: data.saving || [],
            total: data.totalSaving || 0,
            offset: 8,
        },

        {
            title: "Debt Category",
            badgeColor: "bg-warning text-dark",
            data: data.debt || [],
            total: data.totalDebt || 0,
            offset: 12,
        },

        {
            title: "Pending Debt Category",
            badgeColor: "bg-info text-dark",
            data: data.pendingDebt || [],
            total: data.totalPendingDebt || 0,
            offset: 16,
        },

    ];


    return (

        <div
            className="container-fluid px-0"
            style={{
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
            }}
        >

            {/* =========================
                PIE CHARTS
            ========================= */}

            <div className="row g-3 mx-0">

                {charts.map(chart => (

                    <PieCard
                        key={chart.title}
                        {...chart}
                    />

                ))}

            </div>


            {/* =========================
                CATEGORY LIST
            ========================= */}

            <div className="row mt-3">

                <CategoryTable
                    title="Income Categories"
                    data={data.income || []}
                    total={data.totalIncome || 0}
                />

                <CategoryTable
                    title="Expense Categories"
                    data={data.expense || []}
                    total={data.totalExpense || 0}
                />

                <CategoryTable
                    title="Saving Categories"
                    data={data.saving || []}
                    total={data.totalSaving || 0}
                />

                <CategoryTable
                    title="Debt Categories"
                    data={data.debt || []}
                    total={data.totalDebt || 0}
                />

                <CategoryTable
                    title="Pending Debt Categories"
                    data={data.pendingDebt || []}
                    total={data.totalPendingDebt || 0}
                />

            </div>

        </div>

    );

};


export default CategoryChart;