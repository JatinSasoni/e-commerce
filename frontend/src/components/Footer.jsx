export default function Footer() {
    return (
        <footer className="border-t bg-white mt-10">
            <div className="container py-8 text-sm text-zinc-600 flex flex-col sm:flex-row items-center justify-between">
                <p>© {new Date().getFullYear()} eStore. All rights reserved.</p>
                <p className="mt-2 sm:mt-0">Built with React + Redux Toolkit + TailwindCSS</p>
            </div>
        </footer>
    );
}
