import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import { addToCart, fetchCart } from "../store/slices/cartSlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import API from "../utils/axios";
import { toast } from "react-toastify";

export default function Home() {
    const dispatch = useDispatch();
    const { list, pagination, loading } = useSelector((s) => s.products);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchProducts({ search, category, page, limit: 12 }));
    }, [dispatch, search, category, page]);

    useEffect(() => {
        (async () => {
            try {
                const res = await API.get("/products/categories/all");
                setCategories(res.data);
            } catch {
                console.log("Could not fetch category");
            }
        })();
    }, []);

    const handleAdd = async (productId) => {
        const res = await dispatch(addToCart({ productId, quantity: 1 }));
        if (res.meta.requestStatus === "fulfilled") {
            toast.success("Product added to cart!");
            dispatch(fetchCart());
        } else {
            const err = res.payload;
            if (err?.message === "Unauthorized" || err?.message === "Access denied. No token provided.") {
                toast.error("Please login to add items to cart.");
            } else {
                toast.error(err?.message || "Failed to add to cart.");
            }
        }
    };


    return (
        <div className="container py-8">
            <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <h1 className="text-2xl font-bold">Browse Products</h1>
                <div className="flex gap-2">
                    <input
                        value={search}
                        onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                        className="input"
                        placeholder="Search products..."
                    />
                    <select
                        value={category}
                        onChange={(e) => { setPage(1); setCategory(e.target.value); }}
                        className="input max-w-[200px]"
                    >
                        <option value="">All categories</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <>
                    {list?.length ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {list.map((product) => (
                                    <ProductCard key={product._id} product={product} onAdd={handleAdd} />
                                ))}
                            </div>

                            {/* ---------Pagination---------- */}
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <button
                                    className="btn"
                                    disabled={pagination.currentPage <= 1}
                                    onClick={() => setPage(pagination.currentPage - 1)}
                                >Prev</button>
                                <span className="text-sm">
                                    Page {pagination.currentPage || 1} of {pagination.totalPages || 1}
                                </span>
                                <button
                                    className="btn"
                                    disabled={pagination.currentPage >= pagination.totalPages}
                                    onClick={() => setPage(pagination.currentPage + 1)}
                                >Next</button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-sm text-zinc-600">No products found.</p>
                    )}
                </>
            )}
        </div>
    );
}
