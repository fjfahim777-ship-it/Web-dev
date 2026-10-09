import { notFound } from "next/navigation";
import CategoryProducts from "@/components/category/CategoryProducts";
import type { Category, Product } from "@/types/product";
import { toBanglaNumber } from "@/components/shared/utils";
import { API_BASE_URL } from "@/components/shared/api";
export const instant = false;

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
    "use cache";
    const { slug } = await params;

    const categoryResponse = await fetch(
        `${API_BASE_URL}/categories/${slug}`
    );

    if (!categoryResponse.ok) {
        notFound();
    }

    const category: Category = await categoryResponse.json();

    const productsResponse = await fetch(
        `${API_BASE_URL}/products?category=${slug}`
    );

    const products: Product[] = await productsResponse.json();

    if (products.length === 0) {
        notFound();
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-10">

            <div className="rounded-2xl border border-base-content/15 bg-base-100 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center text-4xl">
                        {category.icon}
                    </div>

                    <div>
                        <h1 className="text-[25px] font-bold">
                            {category.nameBn}
                        </h1>

                        <p className="text-md text-base-content mt-1">
                            {toBanglaNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
                        </p>
                    </div>
                </div>
            </div>

            <CategoryProducts
                products={products}
                category={category}
            />
        </main>
    );
};

export default CategoryPage;