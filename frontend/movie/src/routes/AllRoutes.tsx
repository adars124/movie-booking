import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import * as Pages from '../pages';
import PrivateRoute from "./PrivateRoute";

export default function AllRoutes() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/" element={<Pages.home.Home />} />
                        <Route path="details/:id" element={<Pages.home.Details />} />
                        <Route path="booking/:id/create" element={<PrivateRoute element={<Pages.booking.Booking />} />} />
                        <Route path="/:id/success" element={<Pages.home.Success />} />
                        <Route path="failure" element={<Pages.home.Failure />} />
                        <Route path="login" element={<Pages.auth.Login />} />
                        <Route path="register" element={<Pages.auth.Signup />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};