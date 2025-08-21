import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { verifyOtp, fetchProfile } from "../store/slices/authSlice";
import { toast } from "react-toastify"
import API from "../utils/axios";

export default function VerifyOtp() {
    const location = useLocation();
    const presetEmail = location.state?.email || "";
    const [email, setEmail] = useState(presetEmail);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);
        const res = await dispatch(verifyOtp({ email, otp }));
        setLoading(false);
        if (res.meta.requestStatus === "fulfilled") {
            await dispatch(fetchProfile());
            navigate("/");
        } else {
            setMsg(res.payload?.message || "Verification failed");
        }
    };

    const resend = async () => {
        setLoading(true); setMsg(null);
        try {
            await API.post("/auth/resend-otp", { email });
            setMsg("OTP resent. Check your email.");
            toast.success("OTP resent")
        } catch (err) {
            setMsg(err.response?.data?.message || "Failed to resend OTP");
            toast.error("Failed to send OTP")

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-10 max-w-md">
            <div className="card p-6">
                <h1 className="text-2xl font-bold mb-4">Verify your email</h1>
                <form onSubmit={submit} className="space-y-3">
                    <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input className="input" placeholder="6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} required minLength={6} maxLength={6} />
                    {msg && <p className="text-sm text-red-600">{msg}</p>}
                    <button className="btn btn-primary w-full" disabled={loading}>{loading ? "..." : "Verify"}</button>
                </form>
                <button onClick={resend} className="btn w-full mt-2" disabled={loading}>Resend OTP</button>
            </div>
        </div>
    );
}
