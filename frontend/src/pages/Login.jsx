import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, fetchProfile } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loading, error } = useSelector((s) => s.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await dispatch(loginUser({ email, password }));

            if (res.meta.requestStatus === "fulfilled") {
                await dispatch(fetchProfile());
                navigate("/");
                toast.success("Welcome to eStore");

            } else {
                const err = res.payload;
                if (err?.resend) {
                    // Save email for Verify OTP page
                    navigate("/verify-otp", { state: { email } });
                } else {
                    console.log(error);
                    toast.error(err?.message || "Login failed");
                }
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong. Try again.");
        }
    };


    return (
        <div className="container py-10 max-w-md">
            <div className="card p-6">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <form onSubmit={submit} className="space-y-3">
                    <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    {error && <p className="text-red-600 text-sm">{error.message || "Login failed"}</p>}
                    <button disabled={loading} className="btn btn-primary w-full">{loading ? "..." : "Login"}</button>
                </form>
                <p className="text-sm text-zinc-600 mt-3">
                    No account? <Link to="/register" className="underline">Register</Link>
                </p>
            </div>
        </div>
    );
}
