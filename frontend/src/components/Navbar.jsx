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
        <header className="sticky top-0 z-50 bg-white border-b">
            <div className="container h-16 flex items-center justify-between">
                <Link to="/" className="font-extrabold text-xl">eStore</Link>
                <nav className="flex items-center gap-4">
                    <NavLink to="/products" className="hover:underline">Products</NavLink>
                    <NavLink to="/cart" className="hover:underline">Cart ({count})</NavLink>
                    {user ? (
                        <div className="flex items-center gap-3">
                            <NavLink to="/orders" className="hover:underline">My Orders</NavLink>
                            <NavLink to="/profile" className="hover:underline">{user.name?.split(" ")[0]}</NavLink>
                            <button
                                onClick={handleLogout}
                                className="btn"
                            >Logout</button>
                        </div>
                    ) : (
                        <>
                            <NavLink to="/login" className="btn">Login</NavLink>
                            <NavLink to="/register" className="btn btn-primary">Register</NavLink>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
