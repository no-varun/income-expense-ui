import { createContext, useContext, useEffect, useState } from "react";
import storage from "../utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const storedUser = storage.getUser();

        if (storedUser) {
            setUser(storedUser);
        }

        setLoading(false);

    }, []);

    const login = (token, user) => {

        storage.setToken(token);

        storage.setUser(user);

        setUser(user);

    };
const logout = () => {

    storage.clear();

    setUser(null);

    window.location.href = "/login";

};
    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: Boolean(user || storage.getToken()),
            }}
        >
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
