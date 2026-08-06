import {
    getCategoryBadgeStyle,
    getTransactionTypeBadgeClass
} from "../../utils/badgeStyles";

const RecentTransaction = ({ transactions }) => {

    return (

        <div className="card mt-4">

            <div className="card-header">

                Recent Transactions

            </div>

            <div className="card-body p-0 table-responsive">

                <table className="table table-bordered mb-0">

                    <thead>

                        <tr>

                            <th>Date</th>

                            <th>Title</th>

                            <th>Category</th>

                            <th>Type</th>

                            <th>Amount</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            transactions.map(item => (

                                <tr key={item._id}>

                                    <td>

                                        {

                                            new Date(item.date)
                                                .toLocaleDateString()

                                        }

                                    </td>

                                    <td>

                                        {item.title}

                                    </td>

                                    <td>

                                        <span
                                            className="badge"
                                            style={getCategoryBadgeStyle(item.category)}
                                        >

                                            {item.category?.name || "-"}

                                        </span>

                                    </td>

                                    <td>

                                        <span className={getTransactionTypeBadgeClass(item.type)}>

                                            {item.type}

                                        </span>

                                    </td>

                                    <td>

                                        ₹ {item.amount}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

};

export default RecentTransaction;
