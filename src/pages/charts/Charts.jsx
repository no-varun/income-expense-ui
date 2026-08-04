import { useEffect, useState } from "react";

import {
    getMonthlyChart,
    getYearlyChart,
    getWeeklyChart,
    getCategoryChart,
    getPaymentModeChart,
    getDashboardChart
} from "../../api/chartApi";

import MonthlyChart from "../../components/charts/MonthlyChart";
import WeeklyChart from "../../components/charts/WeeklyChart";
import YearlyChart from "../../components/charts/YearlyChart";
import CategoryChart from "../../components/charts/CategoryChart";
import PaymentModeChart from "../../components/charts/PaymentModeChart";
import DashboardChart from "../../components/charts/DashboardChart";

const Charts = () => {

    const currentYear = new Date().getFullYear();

    const [year, setYear] = useState(currentYear);

    const [loading, setLoading] = useState(false);

    const [monthly, setMonthly] = useState([]);

    const [weekly, setWeekly] = useState({
        income: [],
        expense: []
    });

    const [yearly, setYearly] = useState([]);

    const [category, setCategory] = useState({
        income: [],
        expense: []
    });

    const [paymentMode, setPaymentMode] = useState({
        income: [],
        expense: []
    });

    const [dashboard, setDashboard] = useState({
        income: [],
        expense: []
    });

    const loadCharts = async () => {

        try {

            setLoading(true);

            const [

                monthlyRes,

                yearlyRes,

                weeklyRes,

                categoryRes,

                paymentRes,

                dashboardRes

            ] = await Promise.all([

                getMonthlyChart(year),

                getYearlyChart(),

                getWeeklyChart(),

                getCategoryChart(),

                getPaymentModeChart(),

                getDashboardChart()

            ]);

            if (monthlyRes.success) {

                setMonthly(monthlyRes.data);

            }

            if (yearlyRes.success) {

                setYearly(yearlyRes.data);

            }

            if (weeklyRes.success) {

                setWeekly(weeklyRes.data);

            }

            if (categoryRes.success) {

                setCategory(categoryRes.data);

            }

            if (paymentRes.success) {

                setPaymentMode(paymentRes.data);

            }

            if (dashboardRes.success) {

                setDashboard(dashboardRes.data);

            }

        }

        catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to load charts."
            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadCharts();

    }, [year]);

    return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3>

                    Analytics Dashboard

                </h3>

                <div className="d-flex">

                    <select

                        className="form-select"

                        value={year}

                        onChange={(e) => setYear(e.target.value)}

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

                        <>

                            <MonthlyChart
                                data={monthly}
                            />

                            <WeeklyChart
                                data={weekly}
                            />

                            <YearlyChart
                                data={yearly}
                            />

                            <CategoryChart
                                data={category}
                            />

                            <PaymentModeChart
                                data={paymentMode}
                            />

                            <DashboardChart
                                data={dashboard}
                            />

                        </>

                    )

            }

        </div>

    );

};

export default Charts;