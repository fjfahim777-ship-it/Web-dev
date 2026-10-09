import ProductCard from "@/components/home/productcard";
import { toBanglaNumber } from "@/components/shared/utils";
import type { Product } from "@/types/product";
import { API_BASE_URL } from "@/components/shared/api";

const ProductSection = async () => {
    "use cache";
    const response = await fetch(`${API_BASE_URL}/products`);

    const products: Product[] = await response.json();

    const risers = products
        .filter((product) => product.change.dir === "up")
        .sort((a, b) => b.change.pct - a.change.pct)
        .slice(0, 6);

    const fallers = products
        .filter((product) => product.change.dir === "down")
        .sort((a, b) => a.change.pct - b.change.pct)
        .slice(0, 6);

    return (
        <section className="mx-auto max-w-7xl px-4 py-6">

            <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">
                    <span className="text-[15px] text-red-600 mr-1">▲</span>
                    আজ দাম বেড়েছে
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {risers.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">
                    <span className="text-[15px] text-green-600 mr-1">▼</span>
                    আজ দাম কমেছে
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {fallers.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>

            <div id="সব-পণ্য" className="mt-12">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                        সব পণ্য
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        মোট {toBanglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;