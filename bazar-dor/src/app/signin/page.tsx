"use client";

import { authClient } from "@/lib/auth-client";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import google from "@/assets/google.png"
import github from "@/assets/github.png"
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import { Eye, EyeSlash } from "@gravity-ui/icons";

const SignInPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    useEffect(() => {
        if (searchParams.get("message") === "login-required") {
            toast.info("এই পেজটি দেখতে আগে সাইন ইন করুন!", {
                toastId: "login-required",
            });
        }
    }, [searchParams]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
    const [isGithubLoading, setIsGithubLoading] = React.useState(false);

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });

            if (error) {
                toast.error("Google দিয়ে সাইন ইন করা যায়নি!");
                setIsGoogleLoading(false);
            }
        } catch {
            toast.error("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন!");
            setIsGoogleLoading(false);
        }

    };

    const handleGithubSignIn = async () => {
        setIsGithubLoading(true);
        try {
            const { error } = await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
            });

            if (error) {
                toast.error("GitHub দিয়ে সাইন ইন করা যায়নি!");
                setIsGithubLoading(false);
            }
        } catch {
            toast.error("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন!");
            setIsGithubLoading(false);
        }

    };




    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                toast.error("ইমেইল বা পাসওয়ার্ড ভুল!");
                return;
            }

            if (data) {
                toast.success("সফলভাবে সাইন ইন হয়েছে!");
                router.push("/");
            }
        } catch {
            toast.error("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="mx-auto max-w-md px-3 md:px-2 py-10">
            <h1 className="text-center text-2xl font-bold">
                সাইন ইন
            </h1>

            <p className="mt-2 mb-6 text-center text-sm text-base-content/70">
                বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
            </p>
            <div className="rounded-2xl border border-base-content/15 bg-base-100 p-6 sm:p-8">


                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <fieldset className="fieldset">
                        <label className="label text-black font-bold">ইমেইল</label>
                        <input
                            name="email"
                            type="email"
                            className="input w-full outline-none"
                            placeholder="you@example.com"
                            required
                            disabled={isLoading}
                        />

                        <label className="label text-black font-bold">পাসওয়ার্ড</label>
                        <div className="relative">

                            <input
                                name="password"
                                type={isPasswordVisible ? "text" : "password"}
                                className="input w-full outline-none"
                                placeholder="কমপক্ষে ৮ অক্ষর"
                                required
                                disabled={isLoading}
                            />
                            <Button
                                isIconOnly
                                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                                size="sm"
                                variant="ghost"
                                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                {isPasswordVisible ? (
                                    <Eye width={18} height={18} className="sm:h-4 sm:w-4" />
                                ) : (
                                    <EyeSlash width={18} height={18} className="sm:h-4 sm:w-4" />
                                )}
                            </Button>
                        </div>

                        <button
                            type="submit"
                            className="btn bg-[#05893E] mt-4 w-full text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    সাইন ইন হচ্ছে...
                                </>
                            ) : (
                                "সাইন ইন"
                            )}
                        </button>
                    </fieldset>
                </form>

                <div className="divider">অথবা</div>

                <div className="flex w-full min-w-0 gap-2 flex-col sm:flex-row">

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="btn border border-base-content/20 min-w-0 flex-1 gap-2 px-2 py-3 md:py-5"
                        disabled={isGoogleLoading || isGithubLoading || isLoading}
                    >
                        {isGoogleLoading ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Google দিয়ে সাইন ইন হচ্ছে...
                            </>
                        ) : (
                            <>
                                <Image src={google} alt="Google" width={18} height={18} />
                                <span className="text-[13px]">
                                    Google দিয়ে চালিয়ে যান
                                </span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleGithubSignIn}
                        className="btn border border-base-content/20 min-w-0 flex-1 gap-2 px-2 py-3 md:py-5"
                        disabled={isGithubLoading || isGoogleLoading || isLoading}

                    >
                        {isGithubLoading ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                GitHub দিয়ে সাইন ইন হচ্ছে...
                            </>
                        ) : (
                            <>
                                <Image src={github} alt="GitHub" width={18} height={18} />
                                <span className="text-[13px]">

                                    GitHub দিয়ে চালিয়ে যান
                                </span>
                            </>
                        )}

                    </button>
                </div>

                <p className="mt-5 text-center text-sm">
                    অ্যাকাউন্ট নেই?{" "}
                    <a
                        href="/signup"
                        className="font-semibold text-[#05893E] hover:underline"
                    >
                        সাইন আপ করুন
                    </a>
                </p>
            </div>
            <div className="mt-6 text-center">
                <a
                    href="/"
                    className="text-sm text-base-content/70 hover:text-primary"
                >
                    ← হোম পেজে ফিরে যান
                </a>
            </div>

        </main >
    );
};

export default SignInPage;
