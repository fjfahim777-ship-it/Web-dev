"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import google from "@/assets/google.png"
import github from "@/assets/github.png"
import Image from "next/image";
import { Button } from "@heroui/react";
import { Eye, EyeSlash } from "@gravity-ui/icons";

const SignUpPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
    const [isGithubLoading, setIsGithubLoading] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);


    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });

            if (error) {
                toast.error(error.message || "Google দিয়ে সাইন ইন করা যায়নি!");
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
                toast.error(error.message || "GitHub দিয়ে সাইন ইন করা যায়নি!");
                setIsGithubLoading(false);
            }
        } catch {
            toast.error("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন!");
            setIsGithubLoading(false);
        }

    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            toast.error("সবগুলো ঘর পূরণ করুন!");
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.trim())) {
            toast.error("ইমেইলটি সঠিক নয়!");
            return;
        }

        setIsLoading(true);


        try {
            if (password !== confirmPassword) {
                toast.error("পাসওয়ার্ড দুটি মিলছে না!");
                return;
            }


            const { data, error } = await authClient.signUp.email({
                name,
                email: email.trim(),
                password,
            });


            if (error) {
                if (error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
                    toast.error("এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে!");
                } else {
                    toast.error("সাইন আপ করা যায়নি! আবার চেষ্টা করুন।");
                }
                return;
            }




            if (data) {
                toast.success("সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে!");
                router.push("/signin");
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
                অ্যাকাউন্ট তৈরি করুন
            </h1>

            <p className="mt-2 mb-6 text-center text-sm text-base-content/70">
                বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
            </p>
            <div className="rounded-2xl border border-base-content/15 bg-base-100 p-6 sm:p-8">


                <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
                    <fieldset className="fieldset">
                        <label className="label text-black font-bold">নাম</label>
                        <input
                            name="name"
                            type="text"
                            className="input w-full outline-none"
                            placeholder="যেমনঃ রহিম উদ্দিন"
                            required
                            disabled={isLoading}
                        />

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
                                minLength={8}
                                required
                                disabled={isLoading}
                                onChange={(e) => setPassword(e.target.value)}
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

                        <label className="label text-black font-bold">পাসওয়ার্ড নিশ্চিত করুন</label>
                        <div className="relative">

                            <input
                                name="confirmPassword"
                                type={isConfirmPasswordVisible ? "text" : "password"}
                                className="input w-full outline-none"
                                placeholder="আবার লিখুন"
                                minLength={8}
                                required
                                disabled={isLoading}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button
                                isIconOnly
                                aria-label={isConfirmPasswordVisible ? "Hide password" : "Show password"}
                                size="sm"
                                variant="ghost"
                                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                {isConfirmPasswordVisible ? (
                                    <Eye width={18} height={18} className="sm:h-4 sm:w-4" />
                                ) : (
                                    <EyeSlash width={18} height={18} className="sm:h-4 sm:w-4" />
                                )}
                            </Button>
                        </div>

                        {confirmPassword && (
                            <p className={`text-sm ${password === confirmPassword ? "text-green-600" : "text-red-600"}`}>
                                {password === confirmPassword
                                    ? ""
                                    : "পাসওয়ার্ড দুটি মিলছে না!"}
                            </p>
                        )}


                        <button
                            type="submit"
                            className="btn bg-[#05893E] mt-4 w-full  text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    সাইন আপ হচ্ছে...
                                </>
                            ) : (
                                "অ্যাকাউন্ট তৈরি করুন"
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
                    অ্যাকাউন্ট আছে?{" "}
                    <a
                        href="/signin"
                        className="font-semibold text-[#05893E] hover:underline"
                    >
                        সাইন ইন করুন
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
        </main>
    );
};

export default SignUpPage;