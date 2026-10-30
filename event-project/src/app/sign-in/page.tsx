"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        setErrorMessage("");
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const { error } = await authClient.signIn.email({
                email: email.trim(),
                password,
            });

            if (error) {
                setErrorMessage(error.message || "Invalid email or password.");
                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }


    };

    return (<section className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-4 py-12"> <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"> <div className="mb-8 text-center"> <h1 className="text-3xl font-bold text-gray-900">
        Welcome Back! </h1>

        <p className="mt-2 text-sm text-gray-500">
            Sign in to continue to your account.
        </p>
    </div>

        <form onSubmit={onSubmit} className="space-y-5">
            <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Email Address
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>

                    <button
                        type="button"
                        onClick={() =>
                            setErrorMessage(
                                "Password reset is not configured yet."
                            )
                        }
                        className="text-sm text-green-600 hover:underline"
                    >
                        Forgot password?
                    </button>
                </div>

                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
            </div>

            {errorMessage && (
                <p
                    role="alert"
                    className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                    {errorMessage}
                </p>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isLoading ? "Signing in..." : "Sign In"}
            </button>
        </form>

        <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-sm text-gray-400">
                OR CONTINUE WITH
            </span>

            <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
            <button
                type="button"
                onClick={() =>
                    setErrorMessage(
                        "Google sign-in is not connected yet."
                    )
                }
                className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium transition hover:bg-gray-50"
            >
                Google
            </button>

            <button
                type="button"
                onClick={() =>
                    setErrorMessage(
                        "GitHub sign-in is not connected yet."
                    )
                }
                className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium transition hover:bg-gray-50"
            >
                GitHub
            </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
                href="/sign-up"
                className=" text-green-700 hover:underline"
            >
                Sign Up
            </Link>
        </p>
    </div>
    </section>

    );
}
