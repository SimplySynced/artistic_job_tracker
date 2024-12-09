"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react"; // Use to update the session
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

export default function AccountPage() {
    const { data: session, update } = useSession(); // Get session and update function
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Populate form with user data from session
        if (session) {
            setName(session.user?.name || "");
            setEmail(session.user?.email || "");
        }
    }, [session]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch("/api/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });

            const data = await response.json();
            if (!response.ok) {
                setMessage(data.error || "An error occurred while updating.");
                return;
            }

            // Refresh the session with updated user data
            await update({
                name: data.user.name,
                email: data.user.email,
                emailVerified: data.user.emailVerified,
            });

            setMessage("Your account has been updated successfully.");
        } catch (error) {
            setMessage("An unexpected error occurred.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md p-4 shadow-lg bg-white">
                <CardHeader>
                    <CardTitle className="text-center text-xl">My Account</CardTitle>
                </CardHeader>
                <CardContent>
                    {message && (
                        <Alert variant="default" className="mb-4">
                            {message}
                        </Alert>
                    )}
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white">
                            Update Information
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Make sure your details are accurate!</p>
                </CardFooter>
            </Card>
        </div>
    );
}
