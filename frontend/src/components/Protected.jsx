import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" />;

    try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            return <Navigate to="/login" />;
        }
        return <Outlet />;
    } catch {
        return <Navigate to="/login" />;
    }
}
export default Protected;
