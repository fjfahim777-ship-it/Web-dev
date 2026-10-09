"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import profile from "@/assets/profile.jpg";

const UserInfo = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/");
    };

    if (isPending) return null;

    if (!session) {
        return (
            <div className="flex items-center gap-2">
                <Link href="/signin" className="btn btn-sm">
                    সাইন ইন
                </Link>
                <Link href="/signup" className="btn btn-sm bg-[#05893E] text-white">
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
                className="btn btn-ghost flex h-auto gap-2 px-2 hover:border-base-300 hover:bg-base-200/50"
            >
                <div className="size-9 overflow-hidden rounded-full">
                    <Image
                        src={profile}
                        alt="Profile"
                        className="h-full w-full object-cover"
                    />
                </div>

                <span className="max-w-32 truncate text-sm font-medium">
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
                    <Link href="/profile">
                        👤 আমার প্রোফাইল
                    </Link>
                </li>

                <li>
                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="text-error"
                    >
                        ↪ সাইন আউট
                    </button>
                </li>
            </ul>
        </div>
    );

};

export default UserInfo;
