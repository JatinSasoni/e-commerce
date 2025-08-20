import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../store/slices/productSlice";
import { addToCart, fetchCart } from "../store/slices/cartSlice";
import Loader from "../components/Loader";

export default function ProductDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { current, loading } = useSelector((s) => s.products);

    useEffect(() => { dispatch(fetchProductById(id)) }, [dispatch, id]);

    const handleAdd = async () => {
        dispatch(addToCart({ productId: id, quantity: 1 }));
        dispatch(fetchCart());
    };

    if (loading || !current) return <Loader />;

    return (
        <div className="container py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-2xl bg-white border p-4">
                    <div className="aspect-square rounded-xl bg-zinc-100" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{current.name}</h1>
                    <p className="text-zinc-600 mt-2">{current.description}</p>
                    <div className="mt-4 flex items-center gap-3">
                        <span className="text-2xl font-semibold">₹{current.price}</span>
                        <span className="badge border-zinc-300">Stock: {current.stock}</span>
                        {current.category && <span className="badge border-zinc-300">{current.category}</span>}
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button className="btn btn-primary" onClick={handleAdd}>Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
