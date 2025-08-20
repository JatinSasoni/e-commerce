export default function Loader({ label = "Loading..." }) {
    return (
        <div className="w-full py-10 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-zinc-900 border-t-transparent rounded-full mr-3"></div>
            <span className="text-sm">{label}</span>
        </div>
    );
}
