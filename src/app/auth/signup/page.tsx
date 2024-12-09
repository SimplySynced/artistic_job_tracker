"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import Logo from "../../../../public/images/logo_drop_shadow.png";
import Image from "next/image";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || "Something went wrong. Please try again.");
                return;
            }

            setSuccess("Account created successfully! You can now log in.");
            setName("");
            setEmail("");
            setPassword("");
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        }
    };

    // Ensure any dynamic content is only set after mounting
    useEffect(() => {
        setName("");
        setEmail("");
        setPassword("");
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-4 shadow-lg bg-white">
                <CardHeader>
                    <CardTitle className="text-center text-xl">
                        <Image
                            src={Logo}
                            alt="Logo"
                            className="mx-auto"
                            width={150} // Adjust for desktop
                            height={150}
                            style={{ maxWidth: "100%", height: "auto" }} // Ensures responsiveness
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4 bg-red-100/40 text-red-800 font-medium border-red-100">
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert className="mb-4 bg-green-100/40 text-green-800 font-medium border-green-100">
                            {success}
                        </Alert>
                    )}
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <a href="/auth/login" className="text-blue-500 hover:underline">
                            Log in
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
