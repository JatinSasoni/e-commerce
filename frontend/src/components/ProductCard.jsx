import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
    return (
        <div className="card p-4 flex flex-col">
            <div className="aspect-square rounded-xl bg-zinc-100 mb-3 overflow-hidden">
                {/* Replace with actual image if your model has images */}
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <Link to={`/products/${product._id}`} className="font-medium line-clamp-2 hover:underline">{product.name}</Link>
            <p className="text-sm text-zinc-600 line-clamp-2 mt-1">{product.description}</p>
            <div className="mt-auto flex items-center justify-between pt-3">
                <span className="font-semibold">₹{product.price}</span>
                <button className="btn btn-primary" onClick={() => onAdd(product._id)}>Add</button>
            </div>
            <div className="mt-2">
                <span className="badge border-zinc-300 text-zinc-600">Stock: {product.stock}</span>
                {product.category && <span className="badge border-zinc-300 text-zinc-600 ml-2">{product.category}</span>}
            </div>
        </div>
    );
}
