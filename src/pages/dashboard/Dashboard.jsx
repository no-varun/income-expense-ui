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
      console.log(error);
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

      {/* Overall & Today's Summary */}
      <div className="row mb-3">

        <div className="col-lg-7">
          <h5 className="mb-3">Overall</h5>

          <div className="row">
            <SummaryCard
              title="Current Balance"
              value={summary.currentBalance || 0}
              bg="bg-primary"
            />
          </div>
        </div>

        <div className="col-lg-8">
          <h5 className="mb-3">Today's Summary</h5>

          <div className="row">
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

      {/* Monthly Summary */}
      <h5 className="mb-3">Monthly Summary</h5>

      <div className="row mb-5">
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

      {/* Yearly Summary */}
      <h5 className="mb-3">Yearly Summary</h5>

      <div className="row mb-5">
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

      <RecentTransaction transactions={transactions} />
    </div>
  );
};

export default Dashboard;