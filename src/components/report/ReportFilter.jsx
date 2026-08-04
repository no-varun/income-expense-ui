import { useState } from "react";

const ReportFilter = ({ onSearch }) => {

    const today = new Date().toISOString().split("T")[0];

    const [filter, setFilter] = useState({

        reportType: "daily",

        date: today,

        month: new Date().getMonth() + 1,

        year: new Date().getFullYear(),

        from: "",

        to: ""

    });

    const handleChange = (e) => {

        setFilter({

            ...filter,

            [e.target.name]: e.target.value

        });

    };

    const handleSearch = () => {

        onSearch(filter);

    };

    const handleReset = () => {

        const data = {

            reportType: "daily",

            date: today,

            month: new Date().getMonth() + 1,

            year: new Date().getFullYear(),

            from: "",

            to: ""

        };

        setFilter(data);

        onSearch(data);

    };

    return (

        <div className="card shadow mb-4">

            <div className="card-header">

                <h5 className="mb-0">

                    Report Filters

                </h5>

            </div>

            <div className="card-body">

                <div className="row">

                    <div className="col-md-3 mb-3">

                        <label className="form-label">

                            Report Type

                        </label>

                        <select
                            className="form-select"
                            name="reportType"
                            value={filter.reportType}
                            onChange={handleChange}
                        >

                            <option value="daily">

                                Daily Report

                            </option>

                            <option value="monthly">

                                Monthly Report

                            </option>

                            <option value="yearly">

                                Yearly Report

                            </option>

                            <option value="date-range">

                                Date Range Report

                            </option>

                            <option value="category">

                                Category Report

                            </option>

                            <option value="payment-mode">

                                Payment Mode Report

                            </option>

                        </select>

                    </div>

                    {

                        filter.reportType === "daily" && (

                            <div className="col-md-3 mb-3">

                                <label className="form-label">

                                    Date

                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="date"
                                    value={filter.date}
                                    onChange={handleChange}
                                />

                            </div>

                        )

                    }

                    {

                        filter.reportType === "monthly" && (

                            <>

                                <div className="col-md-3 mb-3">

                                    <label className="form-label">

                                        Month

                                    </label>

                                    <select
                                        className="form-select"
                                        name="month"
                                        value={filter.month}
                                        onChange={handleChange}
                                    >

                                        {

                                            Array.from({ length: 12 }, (_, i) => (

                                                <option
                                                    key={i + 1}
                                                    value={i + 1}
                                                >

                                                    {

                                                        new Date(
                                                            0,
                                                            i
                                                        ).toLocaleString(
                                                            "default",
                                                            {
                                                                month: "long"
                                                            }
                                                        )

                                                    }

                                                </option>

                                            ))

                                        }

                                    </select>

                                </div>

                                <div className="col-md-3 mb-3">

                                    <label className="form-label">

                                        Year

                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        name="year"
                                        value={filter.year}
                                        onChange={handleChange}
                                    />

                                </div>

                            </>

                        )

                    }

                    {

                        filter.reportType === "yearly" && (

                            <div className="col-md-3 mb-3">

                                <label className="form-label">

                                    Year

                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="year"
                                    value={filter.year}
                                    onChange={handleChange}
                                />

                            </div>

                        )

                    }

                    {

                        filter.reportType === "date-range" && (

                            <>

                                <div className="col-md-3 mb-3">

                                    <label className="form-label">

                                        From Date

                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        name="from"
                                        value={filter.from}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="col-md-3 mb-3">

                                    <label className="form-label">

                                        To Date

                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        name="to"
                                        value={filter.to}
                                        onChange={handleChange}
                                    />

                                </div>

                            </>

                        )

                    }

                </div>

                <div className="mt-2">

                    <button
                        className="btn btn-primary me-2"
                        onClick={handleSearch}
                    >

                        Search

                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={handleReset}
                    >

                        Reset

                    </button>

                </div>

            </div>

        </div>

    );

};

export default ReportFilter;