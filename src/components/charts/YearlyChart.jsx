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

const YearlyChart = ({ data = [] }) => {
    const chartData = {

        labels: data?.map(item => item.year),

        datasets: [

            {
                label: "Income",

                data: data.map(item => item.income)

            },

            {
                label: "Expense",

                data: data.map(item => item.expense)

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

                text: "Yearly Income vs Expense"

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

                    Yearly Income vs Expense

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

export default YearlyChart;
