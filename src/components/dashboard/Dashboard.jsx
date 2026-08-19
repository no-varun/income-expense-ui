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

    const bankWise = summary.bankWise || [];

    const formatAmount = (amount) => {
        const value = Number(amount || 0);

        return value.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const getBankName = (bank) => {
        if (!bank) return "Unknown";

        return bank.charAt(0).toUpperCase() + bank.slice(1);
    };

    return (
        <div className="container-fluid">

            <h3 className="mb-4">Dashboard</h3>

            {/* =====================================================
                SUMMARY CARDS
            ====================================================== */}

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

            {/* =====================================================
                BANK WISE SUMMARY
            ====================================================== */}

            <div className="card shadow-sm mt-4">

                <div className="card-header bg-white">
                    <h5 className="mb-0">
                        Bank Wise Summary
                    </h5>
                </div>

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-bordered table-hover mb-0">

                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Bank</th>
                                    <th className="text-end">
                                        Income
                                    </th>
                                    <th className="text-end">
                                        Expense
                                    </th>
                                    <th className="text-end">
                                        Saving
                                    </th>
                                    <th className="text-end">
                                        Balance
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {bankWise.length > 0 ? (

                                    bankWise.map((item, index) => (

                                        <tr key={item.bank || index}>

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                <strong>
                                                    {getBankName(item.bank)}
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
                                                className={`text-end fw-bold ${Number(item.balance || 0) >= 0
                                                        ? "text-success"
                                                        : "text-danger"
                                                    }`}
                                            >
                                                ₹ {formatAmount(item.balance)}
                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4"
                                        >
                                            No bank data found
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                            {/* =====================================================
                                TOTAL
                            ====================================================== */}

                            {bankWise.length > 0 && (

                                <tfoot className="table-light">

                                    <tr>

                                        <th colSpan="2">
                                            Total
                                        </th>

                                        <th className="text-end text-success">
                                            ₹{" "}
                                            {formatAmount(
                                                bankWise.reduce(
                                                    (total, item) =>
                                                        total +
                                                        Number(item.income || 0),
                                                    0
                                                )
                                            )}
                                        </th>

                                        <th className="text-end text-danger">
                                            ₹{" "}
                                            {formatAmount(
                                                bankWise.reduce(
                                                    (total, item) =>
                                                        total +
                                                        Number(item.expense || 0),
                                                    0
                                                )
                                            )}
                                        </th>

                                        <th className="text-end text-info">
                                            ₹{" "}
                                            {formatAmount(
                                                bankWise.reduce(
                                                    (total, item) =>
                                                        total +
                                                        Number(item.saving || 0),
                                                    0
                                                )
                                            )}
                                        </th>

                                        <th className="text-end">
                                            ₹{" "}
                                            {formatAmount(
                                                bankWise.reduce(
                                                    (total, item) =>
                                                        total +
                                                        Number(item.balance || 0),
                                                    0
                                                )
                                            )}
                                        </th>

                                    </tr>

                                </tfoot>
                            )}

                        </table>

                    </div>

                </div>
            </div>

            {/* =====================================================
                RECENT TRANSACTIONS
            ====================================================== */}

            <RecentTransaction
                transactions={transactions}
            />

        </div>
    );
};

export default Dashboard;