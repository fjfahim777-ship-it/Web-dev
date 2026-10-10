import type { Product } from "@/types/product";
import { toBanglaNumber, getBanglaUnit } from "@/components/shared/utils";
import Link from "next/link";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {

    return (
        <Link
            href={`/product/${product.slug}`}
            className="block rounded-2xl border border-base-content/15 bg-base-100 p-5 transition hover:-translate-y-1 hover:border-amber-400"
        >
            <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-base-300 text-3xl">
                    {product.image}
                </div>

                <div>
                    <h3 className="text-lg font-bold">
                        {product.nameBn}
                    </h3>

                    <p className="text-sm text-base-content">
                        {getBanglaUnit(product.unit)}
                    </p>
                </div>
            </div>

            <div className="mt-5 flex items-end justify-between">
                <div>
                    <p className="text-xs text-base-content">
                        আজকের দাম
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                        ৳{toBanglaNumber(product.today)}{" "}
                        <span className="text-sm font-normal text-base-content">
                            টাকা
                        </span>
                    </p>
                </div>

                <div>
                    {product.change.dir === "up" && (
                        <span className="rounded-full bg-error/10 px-2 py-1 text-sm font-medium text-error">
                            <span className="relative top-px">▲</span> {toBanglaNumber(product.change.pct)}%
                        </span>
                    )}

                    {product.change.dir === "down" && (
                        <span className="rounded-full bg-success/10 px-2 py-1 text-sm font-medium text-success">
                            <span className="relative top-0.5">▼</span> {toBanglaNumber(Math.abs(product.change.pct))}%
                        </span>
                    )}

                    {product.change.dir === "flat" && (
                        <span className="rounded-full bg-base-300 px-2 py-1 text-sm font-medium">
                            {toBanglaNumber(product.change.pct)}%
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;