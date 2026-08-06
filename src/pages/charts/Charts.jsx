import { useEffect, useMemo, useState } from "react";

import { getDailyChart, getMonthlyChart, getYearlyChart, getWeeklyChart, getWeekWiseExpenseChart, getCategoryChart, getPaymentModeChart, getDashboardChart } from "../../api/chartApi";

import DailyChart from "../../components/charts/DailyChart";
import MonthlyChart from "../../components/charts/MonthlyChart";
import WeeklyChart from "../../components/charts/WeeklyChart";
import WeekWiseExpenseChart from "../../components/charts/WeekWiseExpenseChart";
import YearlyChart from "../../components/charts/YearlyChart";
import CategoryChart from "../../components/charts/CategoryChart";
import PaymentModeChart from "../../components/charts/PaymentModeChart";
import DashboardChart from "../../components/charts/DashboardChart";

const chartModules = {
    daily: {
        title: "Daily Chart",
        load: getDailyChart,
        render: (data, filters) => (
            <DailyChart
                data={data}
                month={filters.month}
                year={filters.year}
            />
        ),
        initialData: []
    },
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
    "week-wise": {
        title: "Week Wise Expense Chart",
        load: getWeekWiseExpenseChart,
        render: data => <WeekWiseExpenseChart data={data} />,
        initialData: []
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

const cloneInitialData = (data) => (
    Array.isArray(data)
        ? [...data]
        : { ...data }
);

const normalizeChartData = (module, data, initialData) => {

    if (module === "daily" || module === "monthly" || module === "week-wise" || module === "yearly") {
        return Array.isArray(data)
            ? data
            : data?.data || data?.rows || [];
    }

    return data || cloneInitialData(initialData);

};

const Charts = ({ module = "monthly" }) => {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" }
    ];

    const chartModule = useMemo(
        () => chartModules[module] || chartModules.monthly,
        [module]
    );

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    const [loading, setLoading] = useState(false);

    const [chartData, setChartData] = useState(
        cloneInitialData(chartModule.initialData)
    );

    useEffect(() => {

        let ignore = false;

        const loadChart = async () => {

            try {

                setLoading(true);
                setChartData(cloneInitialData(chartModule.initialData));

                const response = module === "daily" || module === "week-wise"
                    ? await chartModule.load(month, year)
                    : module === "monthly"
                        ? await chartModule.load(year)
                        : await chartModule.load();

                if (!ignore && response.success) {

                    setChartData(
                        normalizeChartData(
                            module,
                            response.data,
                            chartModule.initialData
                        )
                    );

                }

            } catch (error) {

                if (!ignore) {

                    console.log(error);

                    alert(
                        error.response?.data?.message ||
                        "Unable to load chart."
                    );

                }

            } finally {

                if (!ignore) {
                    setLoading(false);
                }

            }

        };

        loadChart();

        return () => {
            ignore = true;
        };

    }, [chartModule, module, month, year]);

    return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3>

                    {chartModule.title}

                </h3>

                {

                    (module === "daily" || module === "monthly" || module === "week-wise") &&

                    <div className="d-flex gap-2 flex-wrap">

                        {

                            (module === "daily" || module === "week-wise") &&

                            <select

                                className="form-select"

                                value={month}

                                onChange={(e) => setMonth(Number(e.target.value))}

                            >

                                {

                                    months.map(item => (

                                        <option
                                            key={item.value}
                                            value={item.value}
                                        >

                                            {item.label}

                                        </option>

                                    ))

                                }

                            </select>

                        }

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

                    (
                        <div key={`${module}-${month}-${year}`}>

                            {
                                chartModule.render(chartData, {
                                    month,
                                    year
                                })
                            }

                        </div>
                    )

            }

        </div>

    );

};

export default Charts;
