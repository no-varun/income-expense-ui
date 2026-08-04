import { useState } from "react";

import { useNavigate } from "react-router-dom";

import IncomeForm from "../../components/income/IncomeForm";

import { createIncome } from "../../api/incomeApi";

const AddIncome = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await createIncome(data);

            if (response.success) {

                alert(response.message);

                navigate("/income");

            }

        } catch (error) {

            alert(error.response?.data?.message);

        } finally {

            setLoading(false);

        }

    };

    return (

        <IncomeForm

            loading={loading}

            onSubmit={handleSubmit}

        />

    );

};

export default AddIncome;