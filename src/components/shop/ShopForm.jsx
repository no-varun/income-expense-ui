import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ShopForm = ({ initialValues = {}, onSubmit, loading = false }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        type: "OFFLINE",
        description: ""
    });
    /*
     * =========================
     * EDIT MODE
     * =========================
     */
    useEffect(() => {

        if (Object.keys(initialValues).length > 0) {
            setForm({
                name: initialValues.name || "",
                type: initialValues.type || "OFFLINE",
                description: initialValues.description || ""
            });
        }

    }, [initialValues]);


    /*
     * =========================
     * HANDLE CHANGE
     * =========================
     */

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };


    /*
     * =========================
     * SUBMIT
     * =========================
     */

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            alert("Shop name is required.");
            return;
        }

        if (!form.type) {
            alert("Shop type is required.");
            return;
        }


        onSubmit({

            ...form,

            name:
                form.name.trim(),

            type:
                form.type.toUpperCase()

        });

    };


    /*
     * =========================
     * RENDER
     * =========================
     */

    return (

        <div className="card shadow">

            {/* ================= HEADER ================= */}

            <div className="card-header d-flex justify-content-between align-items-center">

                <h5 className="mb-0">
                    Shop Details
                </h5>


                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                        navigate("/shops")
                    }
                >

                    ← Back

                </button>

            </div>


            {/* ================= BODY ================= */}

            <div className="card-body">

                <form onSubmit={handleSubmit}>


                    {/* ================= NAME ================= */}

                    <div className="mb-3">

                        <label className="form-label">

                            Shop Name

                        </label>


                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter shop name"
                            required
                        />

                    </div>


                    {/* ================= TYPE ================= */}

                    <div className="mb-3">

                        <label className="form-label">

                            Shop Type

                        </label>


                        <select
                            className="form-select"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            required
                        >

                            <option value="ONLINE">On line</option>

                            <option value="OFFLINE">Off Line</option>

                        </select>

                    </div>


                    {/* ================= DESCRIPTION ================= */}

                    <div className="mb-3">

                        <label className="form-label">

                            Description

                        </label>


                        <textarea
                            className="form-control"
                            rows="4"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                        />

                    </div>

                    {/* ================= SUBMIT ================= */}
                    <button type="submit" className="btn btn-primary" disabled={loading}> {loading ? "Please wait..." : "Save Shop"}</button>

                </form>

            </div>

        </div>

    );

};

export default ShopForm;