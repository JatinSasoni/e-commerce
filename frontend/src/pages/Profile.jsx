import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../store/slices/authSlice";
import Loader from "../components/Loader";
import { ShieldCheck, Mail, UserRound } from 'lucide-react';


export default function Profile() {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((s) => s.auth);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    if (loading && !user) return <Loader />;

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    My Profile
                </h1>

                {user ? (
                    <div className="space-y-5">
                        {/* Basic Info */}
                        <div className="space-y-2">
                            <p className="text-gray-700 flex gap-1 ">
                                <span className="font-semibold flex gap-1"> <UserRound />:</span> {user.name}
                            </p>
                            <p className="text-gray-700 flex gap-1">
                                <span className="font-semibold flex gap-1"><Mail />:</span> {user.email}
                            </p>
                            <p className="text-gray-700 flex gap-1">
                                <span className="font-semibold flex gap-1">
                                    <ShieldCheck />
                                    Verified:</span>{" "}
                                <span
                                    className={`${user.isVerified ? "text-green-600" : "text-red-500"
                                        } font-medium`}
                                >
                                    {user.isVerified ? "Yes" : "No"}
                                </span>
                            </p>
                        </div>

                        {/* Addresses */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                                Saved Addresses
                            </h2>

                            <h4>Address</h4>
                            {user.address.length > 0 ? (
                                <div className="space-y-3">
                                    {user.address.map((address, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 rounded-xl bg-gray-50  border border-gray-200 dark:border-zinc-700"
                                        >
                                            <p className="text-gray-700">
                                                {address.street}, {address.city}
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                {address.state}, {address.country}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">
                                    No saved addresses.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No user data.</p>
                )}
            </div>
        </div>
    );
}
