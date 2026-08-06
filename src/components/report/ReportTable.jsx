import {
    getCategoryBadgeStyle,
    getPaymentModeBadgeClass
} from "../../utils/badgeStyles";

const ReportTable = ({ reportType, reportData }) => {

    if (!reportData) {

        return (

            <div className="alert alert-info">

                Click <strong>Search</strong> to generate report.

            </div>

        );

    }

    const income = reportData.income || [];
    const expense = reportData.expense || [];

    return (

        <>

            {
                reportData.totalIncome !== undefined && (

                    <div className="row mb-4">

                        <div className="col-md-4">

                            <div className="card bg-success text-white">

                                <div className="card-body">

                                    <h6>Total Income</h6>

                                    <h3>₹ {reportData.totalIncome}</h3>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="card bg-danger text-white">

                                <div className="card-body">

                                    <h6>Total Expense</h6>

                                    <h3>₹ {reportData.totalExpense}</h3>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="card bg-primary text-white">

                                <div className="card-body">

                                    <h6>Profit</h6>

                                    <h3>₹ {reportData.profit}</h3>

                                </div>

                            </div>

                        </div>

                    </div>

                )

            }

            {
                reportType === "category" ? (

                    <div className="card">

                        <div className="card-header">

                            Category Report

                        </div>

                        <div className="table-responsive">

                            <table className="table table-bordered mb-0">

                                <thead>

                                    <tr>

                                        <th>Category</th>
                                        <th>Transactions</th>
                                        <th>Total</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        [...income, ...expense].map((item, index) => (

                                            <tr key={index}>

                                                <td>

                                                    <span
                                                        className="badge"
                                                        style={getCategoryBadgeStyle({ name: item._id })}
                                                    >

                                                        {item._id || "-"}

                                                    </span>

                                                </td>

                                                <td>{item.totalTransactions}</td>

                                                <td>₹ {item.totalAmount}</td>

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                ) : reportType === "payment-mode" ? (

                    <div className="card">

                        <div className="card-header">

                            Payment Mode Report

                        </div>

                        <div className="table-responsive">

                            <table className="table table-bordered mb-0">

                                <thead>

                                    <tr>

                                        <th>Payment Mode</th>

                                        <th>Transactions</th>

                                        <th>Total</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        [...income, ...expense].map((item, index) => (

                                            <tr key={index}>

                                                <td>

                                                    <span className={getPaymentModeBadgeClass(item._id)}>

                                                        {item._id || "-"}

                                                    </span>

                                                </td>

                                                <td>{item.totalTransactions}</td>

                                                <td>₹ {item.totalAmount}</td>

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                ) : (

                    <>

                        <div className="card mb-4">

                            <div className="card-header">

                                Income

                            </div>

                            <div className="table-responsive">

                                <table className="table table-bordered mb-0">

                                    <thead>

                                        <tr>

                                            <th>Title</th>

                                            <th>Category</th>

                                            <th>Amount</th>

                                            <th>Payment</th>

                                            <th>Date</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {

                                            income.map(item => (

                                                <tr key={item._id}>

                                                    <td>{item.title}</td>

                                                    <td>

                                                        <span
                                                            className="badge"
                                                            style={getCategoryBadgeStyle(item.category)}
                                                        >

                                                            {item.category?.name || "-"}

                                                        </span>

                                                    </td>

                                                    <td>₹ {item.amount}</td>

                                                    <td>

                                                        <span className={getPaymentModeBadgeClass(item.paymentMode)}>

                                                            {item.paymentMode || "-"}

                                                        </span>

                                                    </td>

                                                    <td>

                                                        {

                                                            new Date(item.date)
                                                                .toLocaleDateString()

                                                        }

                                                    </td>

                                                </tr>

                                            ))

                                        }

                                    </tbody>

                                </table>

                            </div>

                        </div>

                        <div className="card">

                            <div className="card-header">

                                Expense

                            </div>

                            <div className="table-responsive">

                                <table className="table table-bordered mb-0">

                                    <thead>

                                        <tr>

                                            <th>Title</th>

                                            <th>Category</th>

                                            <th>Amount</th>

                                            <th>Payment</th>

                                            <th>Date</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {

                                            expense.map(item => (

                                                <tr key={item._id}>

                                                    <td>{item.title}</td>

                                                    <td>

                                                        <span
                                                            className="badge"
                                                            style={getCategoryBadgeStyle(item.category)}
                                                        >

                                                            {item.category?.name || "-"}

                                                        </span>

                                                    </td>

                                                    <td>₹ {item.amount}</td>

                                                    <td>

                                                        <span className={getPaymentModeBadgeClass(item.paymentMode)}>

                                                            {item.paymentMode || "-"}

                                                        </span>

                                                    </td>

                                                    <td>

                                                        {

                                                            new Date(item.date)
                                                                .toLocaleDateString()

                                                        }

                                                    </td>

                                                </tr>

                                            ))

                                        }

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </>

                )

            }

        </>

    );

};

export default ReportTable;
