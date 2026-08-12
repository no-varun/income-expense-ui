import { useState } from "react";

import { useNavigate } from "react-router-dom";

import SavingForm from "../../components/debt/DebtForm";

import { createDebt  } from "../../api/debtApi";

const AddDebt = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await createDebt(data);

            if (response.success) {

                alert(response.message);

                navigate("/debt");

            }

        } catch (error) {

            alert(error.response?.data?.message);

        } finally {

            setLoading(false);

        }

    };

    return (

        <SavingForm

            loading={loading}

            onSubmit={handleSubmit}

        />

    );

};

export default AddDebt;