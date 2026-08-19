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

  // Bank name formatting
  const formatBankName = (bank) => {
    if (!bank) return "-";

    return bank.charAt(0).toUpperCase() + bank.slice(1);
  };

  // Bank wise data
  const bankWise = summary.bankWise || [];
  console.log("bankWise",bankWise)
  // Calculate bank totals
  const bankTotalIncome = bankWise.reduce(
    (total, item) => total + Number(item.income || 0),
    0
  );

  const bankTotalExpense = bankWise.reduce(
    (total, item) => total + Number(item.expense || 0),
    0
  );

  const bankTotalSaving = bankWise.reduce(
    (total, item) => total + Number(item.saving || 0),
    0
  );

  const bankTotalBalance = bankWise.reduce(
    (total, item) => total + Number(item.balance || 0),
    0
  );

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


      {/* ================= BANK WISE ================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h4 className="mb-0">
              Bank Wise Summary
            </h4>

            <span className="badge bg-primary">
              {bankWise.length} Banks
            </span>

          </div>

          <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle mb-0">

              <thead className="table-light">

                <tr>
                  <th className="text-center">
                    #
                  </th>

                  <th>
                    Bank
                  </th>

                  <th className="text-end text-success">
                    Income
                  </th>

                  <th className="text-end text-danger">
                    Expense
                  </th>

                  <th className="text-end text-info">
                    Saving
                  </th>

                  <th className="text-end">
                    Balance
                  </th>
                </tr>

              </thead>

              <tbody>

                {bankWise.length > 0 ? (

                  bankWise.map((item, index) => {

                    const balance = Number(item.balance || 0);

                    return (
                      <tr key={`${item.bank}-${index}`}>

                        <td className="text-center">
                          {index + 1}
                        </td>

                        <td>
                          <strong>
                            {formatBankName(item.bank)}
                          </strong>
                        </td>

                        <td className="text-end text-success">
                          ₹ {formatAmount(item.income)}
                        </td>

                        <td className="text-end text-danger">
                          ₹ {formatAmount(item.expense)}
                        </td>

                        <td className="text-end text-info">
                          ₹ {formatAmount(item.saving)}
                        </td>

                        <td
                          className={`text-end fw-bold ${
                            balance >= 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          ₹ {formatAmount(balance)}
                        </td>

                      </tr>
                    );
                  })

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-4 text-muted"
                    >
                      No bank wise data available
                    </td>

                  </tr>

                )}

              </tbody>


              {/* ================= BANK TOTAL ================= */}

              {bankWise.length > 0 && (

                <tfoot className="table-light">

                  <tr>

                    <th
                      colSpan="2"
                      className="text-end"
                    >
                      Total
                    </th>

                    <th className="text-end text-success">
                      ₹ {formatAmount(bankTotalIncome)}
                    </th>

                    <th className="text-end text-danger">
                      ₹ {formatAmount(bankTotalExpense)}
                    </th>

                    <th className="text-end text-info">
                      ₹ {formatAmount(bankTotalSaving)}
                    </th>

                    <th
                      className={`text-end ${
                        bankTotalBalance >= 0
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      ₹ {formatAmount(bankTotalBalance)}
                    </th>

                  </tr>

                </tfoot>

              )}

            </table>

          </div>

        </div>

      </div>


      {/* ================= RECENT TRANSACTIONS ================= */}

      <div className="card shadow-sm border-0">

        <div className="card-body">

          <h4 className="mb-4">
            Recent Transactions
          </h4>

          <RecentTransaction
            transactions={transactions}
          />

        </div>

      </div>

    </div>
  );
};

export default Dashboard;