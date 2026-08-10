import { useEffect, useState } from "react";

import SummaryCard from "../../components/dashboard/SummaryCard";
import RecentTransaction from "../../components/dashboard/RecentTransaction";

import {
    getSummary,
    getRecentTransactions,
} from "../../api/dashboardApi";

const Dashboard = () => {
    const [summary, setSummary] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDashboard = async () => {
        try {
            const [summaryRes, transactionRes] = await Promise.all([
                getSummary(),
                getRecentTransactions(),
            ]);

            setSummary(summaryRes.data || {});
            setTransactions(transactionRes.data || []);
        } catch (error) {
            console.error(error);
        } finally {
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
            <h3 className="mb-4">Dashboard</h3>

            <div className="row g-3">

                {/* Today */}
                <SummaryCard
                    title="Today's Income"
                    value={summary.todayIncome || 0}
                    bg="bg-success"
                />

                <SummaryCard
                    title="Today's Expense"
                    value={summary.todayExpense || 0}
                    bg="bg-danger"
                />

                {/* Month */}
                <SummaryCard
                    title="Monthly Income"
                    value={summary.monthIncome || 0}
                    bg="bg-success"
                />

                <SummaryCard
                    title="Monthly Expense"
                    value={summary.monthExpense || 0}
                    bg="bg-danger"
                />

                <SummaryCard
                    title="Monthly Saving"
                    value={summary.monthSaving || 0}
                    bg="bg-info"
                />

                {/* Year */}
                <SummaryCard
                    title="Yearly Income"
                    value={summary.yearIncome || 0}
                    bg="bg-success"
                />

                <SummaryCard
                    title="Yearly Expense"
                    value={summary.yearExpense || 0}
                    bg="bg-danger"
                />

                <SummaryCard
                    title="Yearly Saving"
                    value={summary.yearSaving || 0}
                    bg="bg-info"
                />

                {/* Other */}
                <SummaryCard
                    title="Current Balance"
                    value={summary.currentBalance || 0}
                    bg="bg-primary"
                />

                <SummaryCard
                    title="Monthly Profit"
                    value={summary.monthProfit || 0}
                    bg="bg-warning"
                />

                <SummaryCard
                    title="Total Debt"
                    value={summary.totalDebt || 0}
                    bg="bg-warning"
                />

                <SummaryCard
                    title="Pending Debt"
                    value={summary.totalPendingDebt || 0}
                    bg="bg-warning"
                />
            </div>

            <RecentTransaction transactions={transactions} />
        </div>
    );
};

export default Dashboard;