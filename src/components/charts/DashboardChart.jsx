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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DashboardChart = ({ data = { income: [], expense: [] } }) => {

    const income = data.income || [];

    const expense = data.expense || [];

    const labels = [

        ...new Set([

            ...income.map(item => item._id),

            ...expense.map(item => item._id)

        ])

    ].sort((a, b) => a - b);

    const chartData = {

        labels: labels.map(month => {

            return new Date(
                2000,
                month - 1
            ).toLocaleString(
                "default",
                {
                    month: "short"
                }
            );

        }),

        datasets: [

            {

                label: "Income",

                data: labels.map(month => {

                    const row = income.find(
                        item => item._id === month
                    );

                    return row ? row.total : 0;

                })

            },

            {

                label: "Expense",

                data: labels.map(month => {

                    const row = expense.find(
                        item => item._id === month
                    );

                    return row ? row.total : 0;

                })

            }

        ]

    };

    const options = {

        responsive: true,

        plugins: {

            legend: {

                position: "top"

            },

            title: {

                display: true,

                text: "Dashboard Income vs Expense"

            }

        },

        scales: {

            y: {

                beginAtZero: true

            }

        }

    };

    return (

        <div className="card shadow mb-4">

            <div className="card-header">

                <h5 className="mb-0">

                    Dashboard Chart

                </h5>

            </div>

            <div className="card-body">

                <Bar

                    data={chartData}

                    options={options}

                />

            </div>

        </div>

    );

};

export default DashboardChart;