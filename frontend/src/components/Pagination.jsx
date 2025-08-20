export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center gap-2 justify-center mt-6">
            <button
                className="btn"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
            >Prev</button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <button
                className="btn"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >Next</button>
        </div>
    );
}
