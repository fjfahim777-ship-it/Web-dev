import Link from "next/link";

const NotFound = () => {
    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-8 text-center sm:px-6">
            <h1 className="text-5xl font-bold text-[#05893E] sm:text-7xl">
                404
            </h1>

            <h2 className="mt-3 text-xl font-bold sm:mt-4 sm:text-2xl">
                পেজটি খুঁজে পাওয়া যায়নি!
            </h2>

            <p className="mt-3 max-w-md text-sm text-base-content/70 sm:text-base">
                দুঃখিত, আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যায়নি।
                লিংকটি ভুল হতে পারে অথবা পেজটি সরিয়ে ফেলা হয়েছে।
            </p>

            <Link
                href="/"
                className="btn mt-5 bg-[#05893E] text-sm text-white sm:mt-6 sm:text-base"
            >
                হোম পেজে ফিরে যান
            </Link>
        </main>

    );
};

export default NotFound;