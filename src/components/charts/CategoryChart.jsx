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
  beforeDraw(chart, args, pluginOptions) {
    if (pluginOptions?.display !== true) {
      return;
    }

    const { ctx } = chart;

    const meta = chart.getDatasetMeta(0);
    if (!meta.data.length) return;

    const x = meta.data[0].x;
    const y = meta.data[0].y;

    ctx.save();

    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#212529";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      `₹${Number(pluginOptions.total || 0).toLocaleString()}`,
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

const CategoryChart = ({
  data = {
    income: [],
    expense: [],
    saving: [],
    totals: {},
  },
}) => {
  const income = data.income || [];
  const expense = data.expense || [];
  const saving = data.saving || [];
  const incomeTotal = data.totalIncome || 0;
  const expenseTotal = data.totalExpense || 0;
  const savingTotal = data.totalSaving || 0;

  return (
    <div className="row">
      {/* Income */}
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="card shadow h-100">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Income Category</h5>

            <span className="badge bg-success fs-6">
              ₹ {incomeTotal.toLocaleString()}
            </span>
          </div>

          <div
            className="card-body chart-body chart-body-pie"
            style={{ height: "350px" }}
          >
            <Pie
              data={{
                labels: income.map((item) => item._id),
                datasets: [
                  {
                    label: "Income",
                    data: income.map((item) => item.value),
                    backgroundColor: getSliceColors(income.length),
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
                  },
                  centerText: {
                    display: true,
                    total: incomeTotal,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Expense */}
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="card shadow h-100">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Expense Category</h5>

            <span className="badge bg-danger fs-6">
              ₹ {expenseTotal.toLocaleString()}
            </span>
          </div>

          <div
            className="card-body chart-body chart-body-pie"
            style={{ height: "350px" }}
          >
            <Pie
              data={{
                labels: expense.map((item) => item._id),
                datasets: [
                  {
                    label: "Expense",
                    data: expense.map((item) => item.value),
                    backgroundColor: getSliceColors(expense.length, 4),
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
                  },
                  centerText: {
                    display: true,
                    total: expenseTotal,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Saving */}
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="card shadow h-100">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Saving Category</h5>

            <span className="badge bg-primary fs-6">
              ₹ {savingTotal.toLocaleString()}
            </span>
          </div>

          <div
            className="card-body chart-body chart-body-pie"
            style={{ height: "350px" }}
          >
            <Pie
              data={{
                labels: saving.map((item) => item._id),
                datasets: [
                  {
                    label: "Saving",
                    data: saving.map((item) => item.value),
                    backgroundColor: getSliceColors(saving.length, 8),
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
                  },
                  centerText: {
                    display: true,
                    total: savingTotal,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
