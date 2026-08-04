import { useState } from "react";

import { useNavigate } from "react-router-dom";

import ExpenseForm from "../../components/expense/ExpenseForm";

import { createExpense } from "../../api/expenseApi";

const AddExpense = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await createExpense(data);

            if (response.success) {

                alert(response.message);

                navigate("/expense");

            }

        } catch (error) {

            alert(error.response?.data?.message);

        } finally {

            setLoading(false);

        }

    };

    return (

        <ExpenseForm

            loading={loading}

            onSubmit={handleSubmit}

        />

    );

};

export default AddExpense;