import { useEffect, useMemo, useState } from "react";

import {
    getDailyChart,
    getMonthlyChart,
    getYearlyChart,
    getWeeklyChart,
    getWeekWiseExpenseChart,
    getCategoryChart,
    getPaymentModeChart,
    getDashboardChart
} from "../../api/chartApi";


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

        render: data => (
            <MonthlyChart data={data} />
        ),

        initialData: []

    },


    weekly: {

        title: "Weekly Chart",

        load: getWeeklyChart,

        render: data => (
            <WeeklyChart data={data} />
        ),

        initialData: {

            income: [],
            expense: []

        }

    },


    "week-wise": {

        title: "Week Wise Expense Chart",

        load: getWeekWiseExpenseChart,

        render: data => (
            <WeekWiseExpenseChart data={data} />
        ),

        initialData: []

    },


    yearly: {

        title: "Yearly Chart",

        load: getYearlyChart,

        render: data => (
            <YearlyChart data={data} />
        ),

        initialData: []

    },


    category: {

        title: "Category Chart",

        load: getCategoryChart,

        render: data => (
            <CategoryChart data={data} />
        ),

        initialData: {

            income: [],
            expense: [],
            saving: [],
            debt: [],
            pendingDebt: []

        }

    },


    "payment-mode": {

        title: "Payment Mode Chart",

        load: getPaymentModeChart,

        render: data => (
            <PaymentModeChart data={data} />
        ),

        initialData: {

            income: [],
            expense: []

        }

    },


    dashboard: {

        title: "Dashboard Chart",

        load: getDashboardChart,

        render: (data, filters) => (
            <DashboardChart
                data={data}
                year={filters.year}
            />
        ),

        initialData: {

            income: [],
            expense: [],
            Saving: [],
            Debt: [],
            pendingDebt: []

        }

    }

};


const cloneInitialData = data => (

    Array.isArray(data)
        ? [...data]
        : { ...data }

);


const normalizeChartData = (
    module,
    data,
    initialData
) => {

    if (
        module === "daily" ||
        module === "monthly" ||
        module === "week-wise" ||
        module === "yearly"
    ) {

        return Array.isArray(data)
            ? data
            : data?.data ||
              data?.rows ||
              [];

    }


    return (
        data ||
        cloneInitialData(initialData)
    );

};


const Charts = ({
    module = "monthly"
}) => {

    const currentYear =
        new Date().getFullYear();

    const currentMonth =
        new Date().getMonth() + 1;


    const months = [

        {
            value: 1,
            label: "January"
        },

        {
            value: 2,
            label: "February"
        },

        {
            value: 3,
            label: "March"
        },

        {
            value: 4,
            label: "April"
        },

        {
            value: 5,
            label: "May"
        },

        {
            value: 6,
            label: "June"
        },

        {
            value: 7,
            label: "July"
        },

        {
            value: 8,
            label: "August"
        },

        {
            value: 9,
            label: "September"
        },

        {
            value: 10,
            label: "October"
        },

        {
            value: 11,
            label: "November"
        },

        {
            value: 12,
            label: "December"
        }

    ];


    const chartModule = useMemo(
        () =>
            chartModules[module] ||
            chartModules.monthly,
        [module]
    );


    /*
     * Dashboard:
     *     year = all by default
     *
     * Category:
     *     year = all
     *     month = all
     *
     * Payment Mode:
     *     year = all
     *     month = all
     *
     * Other charts:
     *     current year
     */
    const [year, setYear] = useState(
        module === "dashboard" ||
        module === "category" ||
        module === "payment-mode"
            ? "all"
            : currentYear
    );


    const [month, setMonth] = useState(
        module === "category" ||
        module === "payment-mode"
            ? "all"
            : currentMonth
    );


    const [loading, setLoading] =
        useState(false);


    const [chartData, setChartData] =
        useState(
            cloneInitialData(
                chartModule.initialData
            )
        );


    /*
     * Reset filters when module changes
     */
    useEffect(() => {

        if (
            module === "dashboard" ||
            module === "category" ||
            module === "payment-mode"
        ) {

            setYear("all");

        } else {

            setYear(currentYear);

        }


        if (
            module === "category" ||
            module === "payment-mode"
        ) {

            setMonth("all");

        } else {

            setMonth(currentMonth);

        }

    }, [
        module,
        currentYear,
        currentMonth
    ]);


    /*
     * Load chart
     */
    useEffect(() => {

        let ignore = false;


        const loadChart = async () => {

            try {

                setLoading(true);


                setChartData(
                    cloneInitialData(
                        chartModule.initialData
                    )
                );


                let response;


                /*
                 * DAILY
                 *
                 * /daily?month=8&year=2026
                 */
                if (
                    module === "daily"
                ) {

                    response =
                        await chartModule.load(
                            month,
                            year
                        );

                }


                /*
                 * WEEK-WISE
                 *
                 * /week-wise?month=8&year=2026
                 */
                else if (
                    module === "week-wise"
                ) {

                    response =
                        await chartModule.load(
                            month,
                            year
                        );

                }


                /*
                 * MONTHLY
                 *
                 * /monthly?year=2026
                 */
                else if (
                    module === "monthly"
                ) {

                    response =
                        await chartModule.load(
                            year
                        );

                }


                /*
                 * DASHBOARD
                 *
                 * /dashboard?year=all
                 * /dashboard?year=2026
                 */
                else if (
                    module === "dashboard"
                ) {

                    response =
                        await chartModule.load(
                            year
                        );

                }


                /*
                 * CATEGORY
                 *
                 * /category?year=all&month=all
                 * /category?year=2026&month=all
                 * /category?year=2026&month=8
                 */
                else if (
                    module === "category"
                ) {

                    response =
                        await chartModule.load(
                            year,
                            month
                        );

                }


                /*
                 * PAYMENT MODE
                 *
                 * /payment-mode?year=all&month=all
                 * /payment-mode?year=2026&month=all
                 * /payment-mode?year=2026&month=8
                 */
                else if (
                    module === "payment-mode"
                ) {

                    response =
                        await chartModule.load(
                            year,
                            month
                        );

                }


                /*
                 * WEEKLY / YEARLY
                 */
                else {

                    response =
                        await chartModule.load();

                }


                /*
                 * Set API response
                 */
                if (
                    !ignore &&
                    response?.success
                ) {

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


    }, [
        chartModule,
        module,
        month,
        year
    ]);


    /*
     * Last 10 years
     */
    const yearOptions = Array.from(
        {
            length: 10
        },
        (_, index) =>
            currentYear - index
    );


    /*
     * Which filters should be visible?
     */
    const showMonthFilter =
        module === "daily" ||
        module === "week-wise" ||
        module === "category" ||
        module === "payment-mode";


    const showYearFilter =
        module === "dashboard" ||
        module === "daily" ||
        module === "monthly" ||
        module === "week-wise" ||
        module === "category" ||
        module === "payment-mode";


    /*
     * All option
     */
    const showAllYear =
        module === "dashboard" ||
        module === "category" ||
        module === "payment-mode";


    const showAllMonth =
        module === "category" ||
        module === "payment-mode";


    return (

        <div className="container-fluid">


            {/* =========================
                HEADER
            ========================= */}

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">


                <h3 className="mb-0">
                    {chartModule.title}
                </h3>


                {/* =========================
                    FILTERS
                ========================= */}

                <div className="d-flex gap-2 flex-wrap">


                    {/* =========================
                        MONTH FILTER
                    ========================= */}

                    {
                        showMonthFilter && (

                            <select
                                className="form-select"
                                value={month}
                                onChange={e => {

                                    const value =
                                        e.target.value;

                                    if (
                                        value === "all"
                                    ) {

                                        setMonth("all");

                                    } else {

                                        const parsed =
                                            Number(value);

                                        if (
                                            Number.isFinite(
                                                parsed
                                            )
                                        ) {

                                            setMonth(
                                                parsed
                                            );

                                        }

                                    }

                                }}
                            >

                                {
                                    showAllMonth && (

                                        <option value="all">
                                            All Months
                                        </option>

                                    )
                                }


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

                        )
                    }


                    {/* =========================
                        YEAR FILTER
                    ========================= */}

                    {
                        showYearFilter && (

                            <select
                                className="form-select"
                                value={year}
                                onChange={e => {

                                    const value =
                                        e.target.value;


                                    if (
                                        value === "all"
                                    ) {

                                        setYear("all");

                                    } else {

                                        const parsed =
                                            Number(value);

                                        if (
                                            Number.isFinite(
                                                parsed
                                            )
                                        ) {

                                            setYear(
                                                parsed
                                            );

                                        }

                                    }

                                }}
                            >

                                {
                                    showAllYear && (

                                        <option value="all">
                                            All Years
                                        </option>

                                    )
                                }


                                {
                                    yearOptions.map(
                                        item => (

                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>

                                        )
                                    )
                                }

                            </select>

                        )
                    }

                </div>

            </div>


            {/* =========================
                CHART
            ========================= */}

            {
                loading ? (

                    <div className="text-center mt-5">

                        <div
                            className="spinner-border"
                            role="status"
                        />

                    </div>

                ) : (

                    <div
                        key={
                            `${module}-${month}-${year}`
                        }
                    >

                        {
                            chartModule.render(
                                chartData,
                                {
                                    month,
                                    year
                                }
                            )
                        }

                    </div>

                )
            }

        </div>

    );

};


export default Charts;