import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { persistor } from "../store/store";
import { useEffect } from "react";
import { fetchCart } from "../store/slices/cartSlice";


export default function Navbar() {
    const { user } = useSelector((s) => s.auth);
    const { items } = useSelector((s) => s.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) {
            dispatch(fetchCart());
        }
    }, [token, dispatch]);

    const count = items?.reduce((a, c) => a + c.quantity, 0) || 0;

    const handleLogout = () => {
        dispatch(logout());
        persistor.purge(); // clear persisted Redux storage
        navigate("/login")
    };



    return (
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="container mx-auto h-18 flex items-center sm:justify-between px-4 max-sm:flex-col ">
                {/* Logo */}
                <Link to="/" className="font-bold text-xl text-gray-900 s">
                    eStore
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-4 text-gray-700">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `${isActive ? "text-blue-600 font-medium" : "hover:text-blue-500"} transition-colors max-sm:hidden`
                        }
                    >
                        Products
                    </NavLink>

                    <NavLink
                        to="/cart"
                        className={({ isActive }) => isActive ? "text-blue-600 font-medium" : "hover:text-blue-500 transition-colors"}
                    >
                        Cart ({count})
                    </NavLink>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <NavLink
                                to="/orders"
                                className={({ isActive }) => isActive ? "text-blue-600 font-medium" : "hover:text-blue-500 transition-colors"}
                            >
                                My Orders
                            </NavLink>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) => isActive ? "text-blue-600 font-medium" : "hover:text-blue-500 transition-colors"}
                            >
                                <div className="size-8 rounded-full overflow-hidden bg-blue-400 ">
                                    <img src="/default-pfp.png" alt="profile-picture" className="w-full h-full" />
                                </div>
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className="px-3 py-1 border border-gray-500 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="px-3 py-1 border border-blue-600 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>
        </header >


    );
}
