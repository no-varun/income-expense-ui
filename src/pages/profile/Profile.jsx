import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {

    const { user } = useAuth();

    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        mobile: "",
        role: "",
        address: ""
    });

    useEffect(() => {

        if (user) {

            setProfile({
                name: user.name || "",
                email: user.email || "",
                mobile: user.mobile || "",
                role: user.role || "",
                address: user.address || ""
            });

        }

    }, [user]);

    const handleChange = (e) => {

        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            // await updateProfile(profile);

            alert("Profile Updated Successfully");

            setIsEditing(false);

        }

        catch (error) {

            alert("Unable to update profile.");

        }

    };

    return (

        <div className="container-fluid">

            <div className="row justify-content-center">

                <div className="col-lg-8">

                    {

                        !isEditing ?

                            (

                                <div className="card shadow">

                                    <div className="card-header d-flex justify-content-between align-items-center">

                                        <h4 className="mb-0">

                                            My Profile

                                        </h4>

                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setIsEditing(true)}
                                        >

                                            Edit Profile

                                        </button>

                                    </div>

                                    <div className="card-body">

                                        <table className="table table-bordered">

                                            <tbody>

                                                <tr>

                                                    <th width="25%">

                                                        Name

                                                    </th>

                                                    <td>

                                                        {profile.name}

                                                    </td>

                                                </tr>

                                                <tr>

                                                    <th>

                                                        Email

                                                    </th>

                                                    <td>

                                                        {profile.email}

                                                    </td>

                                                </tr>

                                                <tr>

                                                    <th>

                                                        Mobile

                                                    </th>

                                                    <td>

                                                        {profile.mobile}

                                                    </td>

                                                </tr>

                                                <tr>

                                                    <th>

                                                        Role

                                                    </th>

                                                    <td>

                                                        {profile.role}

                                                    </td>

                                                </tr>

                                                <tr>

                                                    <th>

                                                        Address

                                                    </th>

                                                    <td>

                                                        {profile.address || "-"}

                                                    </td>

                                                </tr>

                                            </tbody>

                                        </table>

                                    </div>

                                </div>

                            )

                            :

                            (

                                <div className="card shadow">

                                    <div className="card-header">

                                        <h4 className="mb-0">

                                            Edit Profile

                                        </h4>

                                    </div>

                                    <div className="card-body">

                                        <form onSubmit={handleSubmit}>

                                            <div className="row">

                                                <div className="col-md-6 mb-3">

                                                    <label className="form-label">

                                                        Name

                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="name"
                                                        value={profile.name}
                                                        onChange={handleChange}
                                                    />

                                                </div>

                                                <div className="col-md-6 mb-3">

                                                    <label className="form-label">

                                                        Email

                                                    </label>

                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        value={profile.email}
                                                        readOnly
                                                    />

                                                </div>

                                            </div>

                                            <div className="row">

                                                <div className="col-md-6 mb-3">

                                                    <label className="form-label">

                                                        Mobile

                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="mobile"
                                                        value={profile.mobile}
                                                        onChange={handleChange}
                                                    />

                                                </div>

                                                <div className="col-md-6 mb-3">

                                                    <label className="form-label">

                                                        Role

                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={profile.role}
                                                        readOnly
                                                    />

                                                </div>

                                            </div>

                                            <div className="mb-3">

                                                <label className="form-label">

                                                    Address

                                                </label>

                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    name="address"
                                                    value={profile.address}
                                                    onChange={handleChange}
                                                />

                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-success me-2"
                                            >

                                                Update

                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => setIsEditing(false)}
                                            >

                                                Cancel

                                            </button>

                                        </form>

                                    </div>

                                </div>

                            )

                    }

                </div>

            </div>

        </div>

    );

};

export default Profile;