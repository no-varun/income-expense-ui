import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 992);

    return (

        <div
            className="d-flex"
            style={{
                minHeight: "100vh",
                overflowX: "hidden"
            }}
        >

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div
              className="main-content flex-grow-1 d-flex flex-column"
                style={{
                    minHeight: "100vh",
                    background: "#f5f6fa",
                    minWidth: 0
                }}
            >

                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <main
                    className="flex-grow-1 p-3 p-md-4"
                >

                    <Outlet />

                </main>

                <Footer />

            </div>

        </div>

    );

};

export default Layout;