import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../../api/itemApi";
import ItemForm from "../../components/item/ItemForm";

const AddItem = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {

        try {

            setLoading(true);

            const response = await createItem(formData);

            if (response.success) {
                alert(response.message);
                navigate("/items");
            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to create item."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container-fluid">

            <div className="mb-4">
                <h3>Add Item</h3>
            </div>

            <ItemForm
                loading={loading}
                onSubmit={handleSubmit}
            />

        </div>

    );

};

export default AddItem;
