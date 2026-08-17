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

  // Format amount to 2 decimal places
  const formatAmount = (value) => {
    return Number(value || 0).toFixed(2);
  };

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
              value={formatAmount(summary.currentBalance)}
              bg="bg-success"
            />

            <SummaryCard
              title="Total Debt"
              value={formatAmount(summary.totalDebt)}
              bg="bg-danger"
            />

            <SummaryCard
              title="Pending Debt"
              value={formatAmount(summary.totalPendingDebt)}
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
              value={formatAmount(summary.todayIncome)}
              bg="bg-success"
            />

            <SummaryCard
              title="Today's Expense"
              value={formatAmount(summary.todayExpense)}
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
              value={formatAmount(summary.monthIncome)}
              bg="bg-success"
            />

            <SummaryCard
              title="Monthly Expense"
              value={formatAmount(summary.monthExpense)}
              bg="bg-danger"
            />

            <SummaryCard
              title="Monthly Saving"
              value={formatAmount(summary.monthSaving)}
              bg="bg-info"
            />

            <SummaryCard
              title="Monthly Profit"
              value={formatAmount(summary.monthProfit)}
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
              value={formatAmount(summary.yearIncome)}
              bg="bg-success"
            />

            <SummaryCard
              title="Yearly Expense"
              value={formatAmount(summary.yearExpense)}
              bg="bg-danger"
            />

            <SummaryCard
              title="Yearly Saving"
              value={formatAmount(summary.yearSaving)}
              bg="bg-info"
            />

            <SummaryCard
              title="Total Saving"
              value={formatAmount(summary.totalSaving)}
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