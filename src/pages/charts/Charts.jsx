import { useEffect, useState } from "react";

import { getMonthlyChart, getYearlyChart, getWeeklyChart, getCategoryChart, getPaymentModeChart, getDashboardChart } from "../../api/chartApi";

import MonthlyChart from "../../components/charts/MonthlyChart";
import WeeklyChart from "../../components/charts/WeeklyChart";
import YearlyChart from "../../components/charts/YearlyChart";
import CategoryChart from "../../components/charts/CategoryChart";
import PaymentModeChart from "../../components/charts/PaymentModeChart";
import DashboardChart from "../../components/charts/DashboardChart";

const chartModules = {
    monthly: {
        title: "Monthly Chart",
        load: getMonthlyChart,
        render: data => <MonthlyChart data={data} />,
        initialData: []
    },
    weekly: {
        title: "Weekly Chart",
        load: getWeeklyChart,
        render: data => <WeeklyChart data={data} />,
        initialData: {
            income: [],
            expense: []
        }
    },
    yearly: {
        title: "Yearly Chart",
        load: getYearlyChart,
        render: data => <YearlyChart data={data} />,
        initialData: []
    },
    category: {
        title: "Category Chart",
        load: getCategoryChart,
        render: data => <CategoryChart data={data} />,
        initialData: {
            income: [],
            expense: []
        }
    },
    "payment-mode": {
        title: "Payment Mode Chart",
        load: getPaymentModeChart,
        render: data => <PaymentModeChart data={data} />,
        initialData: {
            income: [],
            expense: []
        }
    },
    dashboard: {
        title: "Dashboard Chart",
        load: getDashboardChart,
        render: data => <DashboardChart data={data} />,
        initialData: {
            income: [],
            expense: []
        }
    }
};

const Charts = ({ module = "monthly" }) => {

    const currentYear = new Date().getFullYear();

    const chartModule = chartModules[module] || chartModules.monthly;

    const [year, setYear] = useState(currentYear);

    const [loading, setLoading] = useState(false);

    const [chartData, setChartData] = useState(chartModule.initialData);

    const loadChart = async () => {

        try {

            setLoading(true);

            const response = module === "monthly"
                ? await chartModule.load(year)
                : await chartModule.load();

            if (response.success) {

                setChartData(response.data);

            }

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to load chart."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        setChartData(chartModule.initialData);
        loadChart();

    }, [module, year]);

    return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3>

                    {chartModule.title}

                </h3>

                {

                    module === "monthly" &&

                    <div className="d-flex">

                        <select

                            className="form-select"

                            value={year}

                            onChange={(e) => setYear(Number(e.target.value))}

                        >

                            {

                                Array.from(
                                    { length: 10 },
                                    (_, index) => currentYear - index
                                ).map(item => (

                                    <option
                                        key={item}
                                        value={item}
                                    >

                                        {item}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                }

            </div>

            {

                loading ?

                    (

                        <div className="text-center mt-5">

                            <div className="spinner-border" />

                        </div>

                    )

                    :

                    chartModule.render(chartData)

            }

        </div>

    );

};

export default Charts;
