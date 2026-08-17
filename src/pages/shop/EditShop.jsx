import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ShopForm from "../../components/shop/ShopForm";

import { getShop, updateShop } from "../../api/shopApi";

const EditShop = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [initialValues, setInitialValues] = useState({});

    const loadShop = async () => {

        try {

            const response = await getShop(id);

            if (response.success) {

                setInitialValues(response.data);

            } else {

                alert(response.message);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to load shop."
            );

        }

    };

    useEffect(() => {

        loadShop();

    }, []);

    const handleSubmit = async (formData) => {

        try {

            setLoading(true);

            const response = await updateShop(
                id,
                formData
            );

            if (response.success) {

                alert(response.message);

                navigate("/shops");

            } else {

                alert(response.message);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to update shop."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container-fluid">

            <div className="mb-4">

                <h3>

                    Edit Shop

                </h3>

            </div>

            <ShopForm
                initialValues={initialValues}
                loading={loading}
                onSubmit={handleSubmit}
            />

        </div>

    );

};

export default EditShop;