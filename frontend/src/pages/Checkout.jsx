import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, resetLastCreated } from "../store/slices/orderSlice";
import { fetchCart } from "../store/slices/cartSlice";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import { toast } from "react-toastify"

export default function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { totalAmount, items } = useSelector((s) => s.cart);
    const { loading, lastCreated, error } = useSelector((s) => s.orders);
    const { user } = useSelector((s) => s.auth);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [newAddress, setNewAddress] = useState({
        street: "", city: "", state: "", zipCode: "", country: "",
    });
    const [mode, setMode] = useState("saved"); // "saved" | "new"

    // fetch cart + addresses
    useEffect(() => {
        dispatch(fetchCart());

        const fetchAddresses = async () => {
            if (user?.id) {
                const res = await API.get(`/addresses`);
                setAddresses(res.data);
            }
        };
        fetchAddresses();
    }, [dispatch, user]);

    // after order placed
    useEffect(() => {
        if (lastCreated) {
            const id = lastCreated.id || lastCreated._id;
            dispatch(resetLastCreated());
            navigate(`/orders/${id}`);
        }
    }, [lastCreated, dispatch, navigate]);


    const placeOrder = async (e) => {
        e.preventDefault();
        let addressToUse = mode === "saved" ? selectedAddress : newAddress;

        if (mode === "new") {
            // Save new address first
            const res = await API.post("/addresses", newAddress);
            addressToUse = res.data; // backend returns the new address
            setAddresses((prev) => [...prev, res.data]);
        }
        await dispatch(createOrder(addressToUse));
        dispatch(fetchCart())
        toast.success("Order placed successfully!");
    };

    if (loading) return <Loader label="Placing order..." />;

    return (
        <div className="container py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={placeOrder} className="lg:col-span-2 card p-6">
                <h1 className="text-2xl font-bold mb-4">Shipping Address</h1>

                {/* Switch between saved & new */}
                <div className="mb-4 flex gap-4">
                    <label>
                        <input
                            type="radio"
                            checked={mode === "saved"}
                            onChange={() => setMode("saved")}
                        />{" "}
                        Choose Saved Address
                    </label>
                    <label>
                        <input
                            type="radio"
                            checked={mode === "new"}
                            onChange={() => setMode("new")}
                        />{" "}
                        Enter New Address
                    </label>
                </div>

                {/* Saved Addresses */}
                {mode === "saved" && (
                    <div className="space-y-2">
                        {addresses.length === 0 && (
                            <p className="text-sm text-gray-500">
                                No saved addresses. Please add a new one.
                            </p>
                        )}
                        {addresses.map((addr, i) => (
                            <label
                                key={i}
                                className="block border rounded p-2 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="savedAddress"
                                    className="mr-2"
                                    checked={selectedAddress?._id === addr._id}
                                    onChange={() => setSelectedAddress(addr)}
                                />
                                {addr.street}, {addr.city}, {addr.state}, {addr.zipCode},{" "}
                                {addr.country}
                            </label>
                        ))}
                    </div>
                )}

                {/* New Address Form */}
                {mode === "new" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="input" placeholder="Street"
                            value={newAddress.street}
                            onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                            required
                        />
                        <input className="input" placeholder="City"
                            value={newAddress.city}
                            onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                            required
                        />
                        <input className="input" placeholder="State"
                            value={newAddress.state}
                            onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                            required
                        />
                        <input className="input" placeholder="Zip Code"
                            value={newAddress.zipCode}
                            onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                            required
                        />
                        <input className="input md:col-span-2" placeholder="Country"
                            value={newAddress.country}
                            onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                            required
                        />
                    </div>
                )}

                {error && (
                    <p className="text-red-600 text-sm mt-3">
                        {error.message || "Order failed"}
                    </p>
                )}
                <button className="btn btn-primary mt-6 w-full md:w-auto">Place Order</button>
            </form>

            {/* Order Summary */}
            <div className="card p-6 h-fit">
                <h2 className="font-semibold mb-3">Summary</h2>
                <div className="space-y-2 text-sm">
                    {items?.map((it) => (
                        <div key={it.product._id} className="flex justify-between">
                            <span className="truncate">
                                {it.product.name} × {it.quantity}
                            </span>
                            <span>₹{it.product.price * it.quantity}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between font-semibold text-lg mt-4">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                </div>
            </div>
        </div>
    );
}
