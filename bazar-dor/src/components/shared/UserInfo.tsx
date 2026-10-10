"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import profile from "@/assets/profile.jpg";
import { toast } from "react-toastify";

const UserInfo = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const handleSignOut = async () => {
        try {
            const { error } = await authClient.signOut();

            if (error) {
                toast.error("সাইন আউট করা যায়নি!");
                return;
            }

            toast.success("সফলভাবে সাইন আউট হয়েছে!");
            router.push("/");
            router.refresh();
        } catch {
            toast.error("সাইন আউট করার সময় সমস্যা হয়েছে!");
        }
    };

    if (isPending) {
        return (
            <div className="flex items-center gap-2">
                <div className="size-9 animate-pulse rounded-full bg-base-300" />
                <div className="hidden h-4 w-16 animate-pulse rounded bg-base-300 md:block" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex items-center gap-2">
                <Link href="/signin" className="btn btn-sm bg-[#05893E] sm:bg-transparent text-white sm:text-black">
                    সাইন ইন
                </Link>
                <Link href="/signup" className="btn btn-sm hidden bg-[#05893E] text-white sm:inline-flex">
                    সাইন আপ
                </Link>
            </div>
        );
    }

    return (
        <div className="dropdown dropdown-end">
            <button
                type="button"
                tabIndex={0}
                className="flex h-auto items-center gap-2 rounded-xl border border-transparent px-2 py-1 cursor-pointer"
            >
                <div className="size-9 overflow-hidden rounded-full">
                    <Image
                        src={profile}
                        alt="Profile"
                        className="h-full w-full object-cover"
                    />
                </div>

                <span className="hidden md:inline max-w-32 truncate text-sm font-medium">
                    {session.user.name?.split(" ")[0] || session.user.email}
                </span>

                <span className="text-[5px]">▼</span>
            </button>

            <ul
                tabIndex={0}
                className="dropdown-content menu z-50 mt-2 w-64 rounded-box border border-base-content/10 bg-base-100 p-3 shadow-lg"
            >
                <li className="pointer-events-none mb-2 border-b border-base-300 pb-3">
                    <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold text-base-content">
                            {session.user.name}
                        </span>
                        <span className="text-xs text-base-content/60">
                            {session.user.email}
                        </span>
                    </div>
                </li>

                <li>
                    <Link href="/profile" onClick={() => document.activeElement instanceof HTMLElement && document.activeElement.blur()} >
                        👤 আমার প্রোফাইল
                    </Link>
                </li>

                <li>
                    <button
                        type="button"
                        onClick={() => {
                            document.activeElement instanceof HTMLElement &&
                                document.activeElement.blur();
                            handleSignOut();
                        }}
                        className="text-error">

                        ↪ সাইন আউট
                    </button>
                </li>
            </ul>
        </div >
    );

};

export default UserInfo;
