import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrderById } from "../store/slices/orderSlice";
import Loader from "../components/Loader";

export default function OrderDetail() {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const { current, loading } = useSelector((s) => s.orders);

    useEffect(() => { dispatch(fetchOrderById(orderId)); }, [dispatch, orderId]);

    if (loading || !current) return <Loader />;


    return (
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-4">Order #{current.orderNumber}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card p-4">
                    <h2 className="font-semibold mb-3">Items</h2>
                    <div className="space-y-3">
                        {current.items.map((it) => (
                            <div key={it._id} className="flex items-center justify-between border-b last:border-none pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg" >
                                        <img src={it.product?.image} alt={it.product?.name || ""} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{it.product?.name}</div>
                                        <div className="text-sm text-zinc-600">Qty: {it.quantity}</div>
                                    </div>
                                </div>
                                <div className="font-medium">₹{it.price * it.quantity}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card p-4 h-fit">
                    <h2 className="font-semibold mb-2">Summary</h2>
                    <div className="flex justify-between"><span>Status</span><span>{current.status}</span></div>
                    <div className="flex justify-between"><span>Total</span><span className="font-semibold">₹{current.totalAmount}</span></div>
                    <div className="mt-3 text-sm text-zinc-600">
                        <div className="font-medium">Shipping</div>
                        <div>{current.shippingAddress?.street}</div>
                        <div>{current.shippingAddress?.city}, {current.shippingAddress?.state} {current.shippingAddress?.zipCode}</div>
                        <div>{current.shippingAddress?.country}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
