import { useState } from "react";
import API from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [server, setServer] = useState({ loading: false, error: null, userId: null });
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setServer({ ...server, loading: true, error: null });
        try {
            const res = await API.post("/auth/register", form);
            setServer({ loading: false, error: null, userId: res.data.userId });
            navigate("/verify-otp", { state: { email: form.email } });
        } catch (err) {
            setServer({ loading: false, error: err.response?.data || err.message, userId: null });
        }
    };

    return (
        <div className="container py-10 max-w-md">
            <div className="card p-6">
                <h1 className="text-2xl font-bold mb-4">Create account</h1>
                <form onSubmit={submit} className="space-y-3">
                    <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required minLength={2} />
                    <input className="input" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    <input className="input" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                    {server.error && <p className="text-red-600 text-sm">{server.error.message || "Registration failed"}</p>}
                    <button className="btn btn-primary w-full" disabled={server.loading}>{server.loading ? "..." : "Register"}</button>
                </form>
                <p className="text-sm text-zinc-600 mt-3">
                    Already have an account? <Link to="/login" className="underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
