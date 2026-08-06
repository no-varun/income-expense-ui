import { useState } from "react";

import { useNavigate } from "react-router-dom";

import SavingForm from "../../components/saving/SavingForm";

import { createSaving  } from "../../api/savingApi";

const AddSaving = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await createSaving(data);

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

            loading={loading}

            onSubmit={handleSubmit}

        />

    );

};

export default AddSaving;