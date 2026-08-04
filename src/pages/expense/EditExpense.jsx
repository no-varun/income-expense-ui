import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import ExpenseForm from "../../components/expense/ExpenseForm";

import {
    getExpense,
    updateExpense
} from "../../api/expenseApi";

const EditExpense = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [Expense, setExpense] = useState({});

    const loadExpense = async () => {

        try {

            const response = await getExpense(id);

            if (response.success) {

                setExpense(response.data);

            }

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadExpense();

    }, []);

    const handleSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await updateExpense(id, data);

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

            initialValues={Expense}

            loading={loading}

            onSubmit={handleSubmit}

        />

    );

};

export default EditExpense;