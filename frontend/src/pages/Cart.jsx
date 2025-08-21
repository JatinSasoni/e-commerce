import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, removeFromCart, clearCart } from "../store/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalAmount, loading } = useSelector((s) => s.cart);

    useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

    if (loading) return <Loader />;

    const handleQty = (id, qty) => {
        if (qty < 1) return;
        dispatch(updateCartItem({ productId: id, quantity: qty }));
    };

    return (
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

            {items?.length === 0 ? (
                <div className="card p-6 text-center">
                    <img src="/empty-cart.png" alt="Empty Cart" className="size-60 mx-auto" />
                    <p className="text-zinc-600">Cart is empty.</p>
                    <Link to="/" className="btn btn-primary mt-4">Browse products</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 card p-4">
                        {items.map((item) => (
                            <div key={item.product._id} className="flex items-center gap-4 py-3 border-b last:border-none">
                                <div className="h-16 w-16 rounded-lg" >
                                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <Link to={`/products/${item.product._id}`} className="font-medium hover:underline">{item.product.name}</Link>
                                    <div className="text-sm text-zinc-600">₹{item.product.price}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="btn" onClick={() => handleQty(item.product._id, item.quantity - 1)}>-</button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button className="btn" onClick={() => handleQty(item.product._id, item.quantity + 1)}>+</button>
                                </div>
                                <button className="btn" onClick={() => dispatch(removeFromCart(item.product._id))}>Remove</button>
                            </div>
                        ))}
                    </div>

                    <div className="card p-4 h-fit">
                        <h2 className="font-semibold mb-2">Order Summary</h2>
                        <div className="flex justify-between text-sm mb-1"><span>Subtotal</span><span>₹{totalAmount}</span></div>
                        <div className="flex justify-between text-sm mb-4"><span>Shipping</span><span>₹0</span></div>
                        <div className="flex justify-between font-semibold text-lg mb-4"><span>Total</span><span>₹{totalAmount}</span></div>
                        <button className="btn btn-primary w-full mb-2" onClick={() => navigate("/checkout")}>Checkout</button>
                        <button className="btn w-full" onClick={() => dispatch(clearCart())}>Clear Cart</button>
                    </div>
                </div>
            )}
        </div>
    );
}
