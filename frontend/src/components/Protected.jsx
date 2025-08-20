import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";

export default function Protected() {
    const token = localStorage.getItem("token") || null;
    // const { user } = useSelector((s) => s.auth);
    const location = useLocation();

    if (!token) return <Navigate to="/login" state={{ from: location }} />;
    return <Outlet />;
}
