import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { getSliceColors } from "./chartColors";

const centerTextPlugin = {
  id: "centerText",

  beforeDraw(chart, args, options) {
    if (!options?.display) return;

    const meta = chart.getDatasetMeta(0);

    if (!meta.data.length) return;

    const { ctx } = chart;

    const x = meta.data[0].x;
    const y = meta.data[0].y;

    ctx.save();

    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#212529";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      `₹${Number(options.total || 0).toLocaleString()}`,
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
            ₹{Number(total || 0).toLocaleString()}
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
                  (item) => item.label || item._id
                ),

                datasets: [
                  {
                    data: data.map(
                      (item) => Number(item.value) || 0
                    ),

                    backgroundColor: getSliceColors(
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
                      label: (context) => {
                        const value =
                          context.raw || 0;

                        return ` ₹${Number(
                          value
                        ).toLocaleString()}`;
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

const CategoryChart = ({ data = {} }) => {
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
      <div className="row g-3 mx-0">
        {charts.map((chart) => (
          <PieCard
            key={chart.title}
            {...chart}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;