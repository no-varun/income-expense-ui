import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import SavingForm from "../../components/saving/SavingForm";

import { getSaving, updateSaving } from "../../api/savingApi";

const EditSaving = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [savings, setSavings] = useState([]);

    const loadSavings = async () => {

        try {

            const response = await getSaving(id);

            if (response.success) {

                setSavings(response.data);

            }

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadSavings();

    }, []);

    const handleSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await updateSaving(id, data);

            if (response.success) {

                alert(response.message);

                navigate("/saving");

            }

        } catch (error) {

            alert(error.response?.data?.message);

        } finally {

            setLoading(false);

        }

    };

    return (

        <SavingForm

            initialValues={savings}

            loading={loading}

            onSubmit={handleSubmit}

        />

    );

};

export default EditSaving;