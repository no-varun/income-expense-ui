import { useEffect, useState } from "react";

import SummaryCard from "../../components/dashboard/SummaryCard";
import RecentTransaction from "../../components/dashboard/RecentTransaction";

import {

    getSummary,
    getRecentTransactions

} from "../../api/dashboardApi";

const Dashboard = () => {

    const [summary, setSummary] = useState({});

    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadDashboard = async () => {

        try {

            const [

                summaryRes,

                transactionRes

            ] = await Promise.all([

                getSummary(),

                getRecentTransactions()

            ]);

            setSummary(summaryRes.data);

            setTransactions(transactionRes.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadDashboard();

    }, []);

    if (loading) {

        return (

            <div className="text-center mt-5">

                Loading...

            </div>

        );

    }

    return (

        <div className="container-fluid">

            <h3 className="mb-4">

                Dashboard

            </h3>

            <div className="row">

                <SummaryCard

                    title="Today's Income"

                    value={summary.todayIncome}

                    bg="bg-success"

                />

                <SummaryCard

                    title="Today's Expense"

                    value={summary.todayExpense}

                    bg="bg-danger"

                />

                <SummaryCard

                    title="Current Balance"

                    value={summary.currentBalance}

                    bg="bg-primary"

                />

                <SummaryCard

                    title="Monthly Profit"

                    value={summary.monthProfit}

                    bg="bg-warning"

                />

            </div>

            <RecentTransaction

                transactions={transactions}

            />

        </div>

    );

};

export default Dashboard;