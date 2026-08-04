import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {

    return (

        <div className="d-flex" style={{ minHeight: "100vh" }}>

            <Sidebar />

            <div
                className="flex-grow-1 d-flex flex-column"
                style={{
                    minHeight: "100vh",
                    background: "#f5f6fa"
                }}
            >

                <Header />

                {/* Main Content */}
                <main
                    className="flex-grow-1 container-fluid p-4"
                >
                    <Outlet />
                </main>

                {/* Footer */}
                <Footer />

            </div>

        </div>

    );

};

export default Layout;