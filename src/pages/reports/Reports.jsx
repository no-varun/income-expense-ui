import { useState } from "react";

import ReportFilter from "../../components/report/ReportFilter";
import ReportTable from "../../components/report/ReportTable";

import {
    getDailyReport,
    getMonthlyReport,
    getYearlyReport,
    getDateRangeReport,
    getCategoryReport,
    getPaymentModeReport
} from "../../api/reportApi";

const Reports = () => {

    const [loading, setLoading] = useState(false);

    const [reportType, setReportType] = useState("daily");

    const [reportData, setReportData] = useState(null);

    const handleSearch = async (filter) => {

        try {

            setLoading(true);

            setReportType(filter.reportType);

            let response;

            switch (filter.reportType) {

                case "daily":

                    response = await getDailyReport(
                        filter.date
                    );

                    break;

                case "monthly":

                    response = await getMonthlyReport(
                        filter.month,
                        filter.year
                    );

                    break;

                case "yearly":

                    response = await getYearlyReport(
                        filter.year
                    );

                    break;

                case "date-range":

                    response = await getDateRangeReport(
                        filter.from,
                        filter.to
                    );

                    break;

                case "category":

                    response = await getCategoryReport();

                    break;

                case "payment-mode":

                    response = await getPaymentModeReport();

                    break;

                default:

                    response = null;

            }

            if (response?.success) {

                setReportData(response.data);

            }

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to generate report."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3>

                    Reports

                </h3>

                <div>

                    <button
                        className="btn btn-success me-2"
                    >

                        Export Excel

                    </button>

                    <button
                        className="btn btn-danger"
                    >

                        Export PDF

                    </button>

                </div>

            </div>

            <ReportFilter
                onSearch={handleSearch}
            />

            {

                loading ?

                    (

                        <div className="text-center my-5">

                            <div
                                className="spinner-border"
                            />

                        </div>

                    )

                    :

                    (

                        <ReportTable

                            reportType={reportType}

                            reportData={reportData}

                        />

                    )

            }

        </div>

    );

};

export default Reports;