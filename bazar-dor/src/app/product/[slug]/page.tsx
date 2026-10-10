import Link from "next/link";
import { notFound } from "next/navigation";
import type { Product, Market } from "@/types/product";
import { toBanglaNumber, getBanglaUnit } from "@/components/shared/utils";
import { API_BASE_URL } from "@/components/shared/api";
export const instant = false;
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

interface ProductDetailsProps {
    params: Promise<{
        slug: string;
    }>;
}

const ProductDetails = async ({ params }: ProductDetailsProps) => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/signin?message=login-required");
    }

    const { slug } = await params;

    const productsResponse = await fetch(
        `${API_BASE_URL}/products`
    );

    const products: Product[] = await productsResponse.json();

    const product = products.find((product) => product.slug === slug);

    if (!product) {
        notFound();
    }

    const productResponse = await fetch(
        `${API_BASE_URL}/products/${product.id}`
    );

    const details = await productResponse.json();

    const minPrice = Math.min(
        ...details.markets.map((market: Market) => market.min)
    );

    const maxPrice = Math.max(
        ...details.markets.map((market: Market) => market.max)
    );

    const averagePrice =
        details.markets.reduce(
            (total: number, market: Market) =>
                total + (market.min + market.max) / 2,
            0
        ) / details.markets.length;

    return (
        <main className="mx-auto max-w-7xl px-4 py-6">

            <div className="mb-6 flex items-center gap-2 text-sm">
                <Link
                    href="/"
                    className="text-base-content/60 hover:text-primary"
                >
                    হোম
                </Link>

                <span>›</span>

                <Link
                    href={`/category/${details.category}`}
                    className="text-base-content/60 hover:text-primary"
                >
                    {details.categoryNameBn}
                </Link>

                <span>›</span>

                <span className="font-medium">
                    {details.nameBn}
                </span>
            </div>

            <section className="rounded-2xl border border-base-content/15 bg-base-100 p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-base-200 text-5xl">
                            {details.image}
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {details.nameBn}
                            </h1>

                            <p className="mt-2 text-base-content/70">
                                {getBanglaUnit(details.unit)} ·{" "}
                                {details.categoryNameBn}
                            </p>

                            <p className="mt-3 text-sm">
                                {details.change.dir === "up" && (
                                    <>
                                        গতকালের তুলনায় আজ দাম বেড়েছে ·{" "}
                                        {toBanglaNumber(
                                            details.today -
                                            details.yesterday
                                        )}{" "}
                                        টাকা
                                    </>
                                )}

                                {details.change.dir === "down" && (
                                    <>
                                        গতকালের তুলনায় আজ দাম কমেছে ·{" "}
                                        {toBanglaNumber(
                                            details.yesterday -
                                            details.today
                                        )}{" "}
                                        টাকা
                                    </>
                                )}

                                {details.change.dir === "flat" && (
                                    <>
                                        গতকালের তুলনায় আজ দাম অপরিবর্তিত
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-base-200 p-5">
                        <p className="text-sm">
                            আজকের দাম
                        </p>

                        <div className="mt-2 flex items-center gap-3">
                            <p className="text-2xl font-bold sm:text-3xl">
                                ৳{toBanglaNumber(details.today)} টাকা /{" "}
                                {getBanglaUnit(details.unit)}
                            </p>

                            {details.change.dir === "up" && (
                                <span className="rounded-full bg-error/10 px-2 py-1 text-sm font-medium text-error">
                                    ▲
                                    {toBanglaNumber(details.change.pct)}%
                                </span>
                            )}

                            {details.change.dir === "down" && (
                                <span className="rounded-full bg-success/10 px-2 py-1 text-sm font-medium text-success">
                                    ▼{" "}
                                    {toBanglaNumber(
                                        Math.abs(details.change.pct)
                                    )}
                                    %
                                </span>
                            )}

                            {details.change.dir === "flat" && (
                                <span className="rounded-full bg-base-300 px-2 py-1 text-sm font-medium">
                                    {toBanglaNumber(details.change.pct)}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-8">
                <h2 className="mb-4 text-2xl font-bold">
                    দামের সারসংক্ষেপ
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-base-content/15 bg-base-100 p-5">
                        <p className="text-sm text-base-content/70">
                            সর্বনিম্ন দাম
                        </p>

                        <p className="mt-2 text-2xl font-bold text-green-700">
                            ৳{toBanglaNumber(minPrice)} টাকা
                        </p>

                        <p className="mt-1 text-sm text-base-content/70">
                            সবচেয়ে কম দামের বাজার
                        </p>
                    </div>

                    <div className="rounded-2xl border border-base-content/15 bg-base-100 p-5">
                        <p className="text-sm text-base-content/70">
                            সর্বাধিক দাম
                        </p>

                        <p className="mt-2 text-2xl font-bold text-red-700">
                            ৳{toBanglaNumber(maxPrice)} টাকা
                        </p>

                        <p className="mt-1 text-sm text-base-content/70">
                            সবচেয়ে বেশি দামের বাজার
                        </p>
                    </div>

                    <div className="rounded-2xl border border-base-content/15 bg-base-100 p-5">
                        <p className="text-sm text-base-content/70">
                            গড় দাম
                        </p>

                        <p className="mt-2 text-2xl font-bold text-green-700">
                            ৳{toBanglaNumber(Math.round(averagePrice))} টাকা
                        </p>

                        <p className="mt-1 text-sm text-base-content/70">
                            {getBanglaUnit(details.unit)} হিসেবে
                        </p>
                    </div>
                </div>
            </section>

            <section className="mt-10">
                <h2 className="mb-4 text-2xl font-bold">
                    বাজারভিত্তিক আজকের দাম
                </h2>

                <div className="overflow-x-auto rounded-2xl border border-base-content/15">
                    <table className="table table-sm sm:table-md w-full">
                        <thead>
                            <tr>
                                <th>বাজার</th>
                                <th>বিভাগ</th>
                                <th>সর্বনিম্ন</th>
                                <th>সর্বাধিক</th>
                                <th>গড়</th>
                            </tr>
                        </thead>


                        <tbody>
                            {details.markets.map((market: Market, index: number) => {
                                const average = Math.round((market.min + market.max) / 2);
                                const rowBgClass = index % 2 === 0 ? "bg-white" : "bg-[#F1F3EE]";

                                return (
                                    <tr key={market.market} className={rowBgClass}>
                                        <td className="border-b border-black px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                                            {market.market}
                                        </td>
                                        <td className="border-b border-black px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                                            {market.division}
                                        </td>
                                        <td className="border-b border-black px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                                            ৳{toBanglaNumber(market.min)}
                                        </td>
                                        <td className="border-b border-black px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                                            ৳{toBanglaNumber(market.max)}
                                        </td>
                                        <td className="border-b border-black px-2 py-2 text-xs font-bold sm:px-4 sm:py-3 sm:text-sm">
                                            ৳{toBanglaNumber(average)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            </section>
        </main>
    );
};

export default ProductDetails;