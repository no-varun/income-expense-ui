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
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <h5>Loading...</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">

      <h2 className="mb-4 fw-bold">Dashboard</h2>

      {/* ================= OVERALL ================= */}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">

          <h4 className="mb-4">Overall Summary</h4>

          <div className="row g-3">

            <SummaryCard
              title="Current Balance"
              value={summary.currentBalance || 0}
              bg="bg-success"
            />

            <SummaryCard
              title="Total Debt"
              value={summary.totalDebt || 0}
              bg="bg-danger"
            />

            <SummaryCard
              title="Pending Debt"
              value={summary.totalPendingDebt || 0}
              bg="bg-info"
            />

          </div>

        </div>
      </div>

      {/* ================= TODAY ================= */}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">

          <h4 className="mb-4">Today's Summary</h4>

          <div className="row g-3">

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

          </div>

        </div>
      </div>

      {/* ================= MONTH ================= */}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">

          <h4 className="mb-4">Monthly Summary</h4>

          <div className="row g-3">

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

            <SummaryCard
              title="Monthly Profit"
              value={summary.monthProfit || 0}
              bg="bg-warning"
            />

          </div>

        </div>
      </div>

      {/* ================= YEAR ================= */}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">

          <h4 className="mb-4">Yearly Summary</h4>

          <div className="row g-3">

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

            <SummaryCard
              title="Total Saving"
              value={summary.totalSaving || 0}
              bg="bg-warning"
            />

          </div>

        </div>
      </div>

      {/* ================= RECENT TRANSACTIONS ================= */}

      <div className="card shadow-sm border-0">
        <div className="card-body">

          <h4 className="mb-4">Recent Transactions</h4>

          <RecentTransaction transactions={transactions} />

        </div>
      </div>

    </div>
  );
};

export default Dashboard;