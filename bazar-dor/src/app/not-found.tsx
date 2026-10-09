import Link from "next/link";

const NotFound = () => {
    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <h1 className="text-7xl font-bold text-primary">404</h1>

            <h2 className="mt-4 text-2xl font-bold">
                পেজটি খুঁজে পাওয়া যায়নি!
            </h2>

            <p className="mt-3 max-w-md text-base-content/70">
                দুঃখিত, আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যায়নি।
                লিংকটি ভুল হতে পারে অথবা পেজটি সরিয়ে ফেলা হয়েছে।
            </p>

            <Link href="/" className="btn btn-primary mt-6">
                হোম পেজে ফিরে যান
            </Link>
        </main>
    );
};

export default NotFound;