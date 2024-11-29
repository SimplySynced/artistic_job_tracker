"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignoutPage() {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({
            callbackUrl: "/auth/login", // Redirect to the login page after signing out
        });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Are you sure you want to sign out?</h1>
            <p>Your session will end, and you’ll be redirected to the login page.</p>
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={handleSignOut}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#0070f3",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Sign Out
                </button>
                <button
                    onClick={() => router.push("/")}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "gray",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        marginLeft: "10px",
                        cursor: "pointer",
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
