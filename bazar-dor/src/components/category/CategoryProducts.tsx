"use client";
import { useState } from "react";
import ProductCard from "@/components/home/productcard";
import { toBanglaNumber } from "@/components/shared/utils";
import type { Category, Product } from "@/types/product";

interface CategoryProductsProps {
    products: Product[];
    category: Category;
}

const CategoryProducts = ({
    products,
    category,
}: CategoryProductsProps) => {
    const [sortBy, setSortBy] = useState("default");

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === "low-high") {
            return a.today - b.today;
        }

        if (sortBy === "high-low") {
            return b.today - a.today;
        }

        return 0;
    });

    return (
        <div>

            <div className="rounded-2xl border border-base-content/15 bg-base-100 p-5 mt-5 mb-5">


                <div className="flex items-center justify-end gap-3">
                    <span className="text-sm">সাজান</span>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="select select-sm w-39 border-none outline-1"
                    >
                        <option value="default">ডিফল্ট</option>
                        <option value="low-high">
                            দাম: কম থেকে বেশি
                        </option>
                        <option value="high-low">
                            দাম: বেশি থেকে কম
                        </option>
                    </select>
                </div>
            </div>

            <p className="text-sm text-base-content/70">
                মোট {toBanglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sortedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryProducts;