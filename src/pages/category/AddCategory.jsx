import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CategoryForm from "../../components/category/CategoryForm";
import { createCategory } from "../../api/categoryApi";

const AddCategory = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {

        try {

            setLoading(true);

            const response = await createCategory(formData);

            if (response.success) {

                alert(response.message);

                navigate("/categories");

            } else {

                alert(response.message);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to create category."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container-fluid">

            <div className="mb-4">

                <h3>

                    Add Category

                </h3>

            </div>

            <CategoryForm
                loading={loading}
                onSubmit={handleSubmit}
            />

        </div>

    );

};

export default AddCategory;