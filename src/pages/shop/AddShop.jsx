import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ShopForm from "../../components/shop/ShopForm";
import { createShop } from "../../api/shopApi";

const AddShop = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {

        try {

            setLoading(true);

            const response = await createShop(formData);

            if (response.success) {

                alert(response.message);

                navigate("/shops");

            } else {

                alert(response.message);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to create Shop."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container-fluid">

            <div className="mb-4">

                <h3>

                    Add Shop

                </h3>

            </div>

            <ShopForm
                loading={loading}
                onSubmit={handleSubmit}
            />

        </div>

    );

};

export default AddShop;