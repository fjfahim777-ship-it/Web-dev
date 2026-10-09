"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import profile from "@/assets/profile.jpg";

const UpdateProfilePage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;

            const { error } = await authClient.updateUser({ name });

            if (error) {
                toast.error(error.message || "প্রোফাইল আপডেট করা যায়নি!");
                return;
            }

            toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
            router.push("/profile");
            router.refresh();
        } catch {
            toast.error("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন!");
        } finally {
            setIsLoading(false);
        }
    };

    if (isPending) {
        return <p className="p-6 text-center">লোড হচ্ছে...</p>;
    }

    if (!session) {
        router.push("/signin");
        return null;
    }

    return (
        <main className="mx-auto max-w-2xl px-4 py-10">
            <div className="mb-8 mt-4">
                <h1 className="text-3xl font-bold">আমার প্রোফাইল</h1>
                <p className="mt-2 text-base-content/60">
                    আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
                </p>
            </div>

            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-base-content/15 bg-base-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-16 overflow-hidden rounded-xl">
                        <Image
                            src={profile}
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold">
                            {session.user.name}
                        </h2>
                        <p className="text-sm text-base-content/60">
                            {session.user.email}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={async () => {
                        await authClient.signOut();
                        router.push("/");
                        router.refresh();
                    }}
                    className="btn btn-outline btn-error"
                >
                    ↩ সাইন আউট
                </button>
            </div>

            <div className="rounded-2xl border border-base-content/15 bg-base-100 p-6 sm:p-8">

                <h2 className="mb-4 mt-0 text-xl font-bold">তথ্য</h2>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <fieldset className="fieldset">
                        <label className="label text-[15px] text-gray-600 font-bold">নাম</label>

                        <input
                            name="name"
                            type="text"
                            defaultValue={session.user.name}
                            className="input w-full"
                            placeholder="আপনার নাম"
                            required
                            disabled={isLoading}
                        />

                        <button
                            type="submit"
                            className="btn bg-[#05893E] text-white mt-4 w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    আপডেট হচ্ছে...
                                </>
                            ) : (
                                "আপডেট"
                            )}
                        </button>
                    </fieldset>
                </form>
            </div>
        </main>
    );
};

export default UpdateProfilePage;