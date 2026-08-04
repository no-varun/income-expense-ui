import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const WeeklyChart = ({ data = { income: [], expense: [] } }) => {

    const income = data.income || [];
    const expense = data.expense || [];

    const labels = [
        ...new Set([
            ...income.map(item => item._id),
            ...expense.map(item => item._id)
        ])
    ].sort();

    const chartData = {

        labels,

        datasets: [

            {
                label: "Income",

                data: labels.map(label => {

                    const row = income.find(
                        item => item._id === label
                    );

                    return row ? row.total : 0;

                }),

                tension: 0.4

            },

            {
                label: "Expense",

                data: labels.map(label => {

                    const row = expense.find(
                        item => item._id === label
                    );

                    return row ? row.total : 0;

                }),

                tension: 0.4

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

                text: "Weekly Income vs Expense"

            }

        }

    };

    return (

        <div className="card shadow mb-4">

            <div className="card-header">

                <h5 className="mb-0">

                    Weekly Income vs Expense

                </h5>

            </div>

            <div className="card-body chart-body">

                <Line

                    data={chartData}

                    options={options}

                />

            </div>

        </div>

    );

};

export default WeeklyChart;
