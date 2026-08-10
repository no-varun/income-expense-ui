import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import SavingForm from "../../components/debt/DebtForm";

import { getDebt, updateDebt } from "../../api/debtApi";

const EditDebt= () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [debts, setDebts] = useState([]);

    const loadDebt = async () => {

        try {

            const response = await getDebt(id);

            if (response.success) {

                setDebts(response.data);

            }

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadDebt();

    }, []);

    const handleSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await updateDebt(id, data);

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

            initialValues={debts}

            loading={loading}

            onSubmit={handleSubmit}

        />

    );

};

export default EditDebt;