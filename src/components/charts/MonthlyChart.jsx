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

    const chartData = {

        labels: rows.map(item => item.month),

        datasets: [

            {
                label: "Income",
                data: rows.map(item => item.income),
                backgroundColor: incomeColor,
                borderColor: incomeBorderColor,
                borderWidth: 1
            },

            {
                label: "Expense",
                data: rows.map(item => item.expense),
                backgroundColor: expenseColor,
                borderColor: expenseBorderColor,
                borderWidth: 1
            }

        ]

    };

    const options = {

        responsive: true,
        maintainAspectRatio: false,

        plugins: {

            legend: {

                position: "top"

            },

            title: {

                display: true,

                text: "Monthly Income vs Expense"

            }

        }

    };

    return (

        <div className="card shadow mb-4">

            <div className="card-header">

                <h5 className="mb-0">

                    Monthly Income vs Expense (₹)

                </h5>

            </div>

            <div className="card-body chart-body">

                <Bar
                    data={chartData}
                    options={options}
                />

            </div>

        </div>

    );

};

export default MonthlyChart;
