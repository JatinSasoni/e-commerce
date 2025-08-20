import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../store/slices/orderSlice";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

export default function Orders() {
    const dispatch = useDispatch();
    const { list, loading } = useSelector((s) => s.orders);

    useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

    if (loading) return <Loader />;

    return (
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-4">My Orders</h1>
            {!list?.length ? (
                <p className="text-zinc-600">No orders yet.</p>
            ) : (
                <div className="space-y-3">
                    {list.map((o) => (
                        <Link to={`/orders/${o._id}`} key={o._id} className="card p-4 block hover:bg-zinc-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Order #{o.orderNumber}</div>
                                    <div className="text-sm text-zinc-600">{new Date(o.createdAt).toLocaleString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">₹{o.totalAmount}</div>
                                    <div className="text-sm">{o.status}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
