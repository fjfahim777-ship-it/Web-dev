import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
export const instant = false;

const ProfilePage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/signin");
    }

    return (
        <main className="mx-auto max-w-2xl px-4 py-10">
            <div className="rounded-2xl border border-base-content/15 bg-base-100 p-6 sm:p-8">
                <h1 className="mb-6 text-2xl font-bold">
                    আমার প্রোফাইল
                </h1>

                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-sm text-base-content/60">
                            নাম
                        </p>
                        <p className="mt-1 font-medium">
                            {session.user.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-base-content/60">
                            ইমেইল
                        </p>
                        <p className="mt-1 font-medium">
                            {session.user.email}
                        </p>
                    </div>
                </div>

                <Link
                    href="/profile/update"
                    className="btn bg-[#05893E] mt-6 text-white"
                >
                    প্রোফাইল আপডেট করুন
                </Link>
            </div>
        </main>
    );
};

export default ProfilePage;