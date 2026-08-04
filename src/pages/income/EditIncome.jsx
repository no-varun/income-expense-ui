import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import IncomeForm from "../../components/income/IncomeForm";

import {
    getIncome,
    updateIncome
} from "../../api/incomeApi";

const EditIncome = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [income, setIncome] = useState({});

    const loadIncome = async () => {

        try {

            const response = await getIncome(id);

            if (response.success) {

                setIncome(response.data);

            }

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadIncome();

    }, []);

    const handleSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await updateIncome(id, data);

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

            initialValues={income}

            loading={loading}

            onSubmit={handleSubmit}

        />

    );

};

export default EditIncome;