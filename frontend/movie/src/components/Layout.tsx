import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
    return (
        <main className="mx-auto bg-blue-200">
            <NavBar />
            <Outlet />
            <Footer />
        </main>
    )
};