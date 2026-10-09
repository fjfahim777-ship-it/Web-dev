import MarqueeText from "react-marquee-text";
import { API_BASE_URL } from "@/components/shared/api";
import type { Product } from "@/types/product";

const PriceTicker = async () => {
    "use cache";
    const response = await fetch(`${API_BASE_URL}/products`);

    const products: Product[] = await response.json();

    const changedProducts = products.filter(
        (product) => product.change.pct !== 0
    );

    const toBanglaNumber = (number: number) => {
        return number
            .toString()
            .replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
    };

    const getBanglaUnit = (unit: string) => {
        if (unit === "kg") return "কেজি";
        if (unit === "litre") return "লিটার";
        if (unit === "dozen") return "ডজন";
        if (unit === "piece") return "পিস";

        return unit;
    };

    return (
        <div className="border-y border-base-content/15 mt-2">
            <MarqueeText direction="right" duration={10}>
                {[...changedProducts, ...changedProducts].map((product, index) => (
                    <div
                        key={`${product.id}-${index}`}
                        className="flex items-center border-r border-base-content/15 px-3 text-xs sm:text-sm"
                    >
                        <div className="my-1 mx-2 flex items-center gap-0.5">

                            <span className="text-xs sm:text-sm">{product.image}</span>

                            <span className="font-medium">{product.nameBn}</span>

                            <span className="ml-2">
                                ৳{toBanglaNumber(product.today)}/
                                {getBanglaUnit(product.unit)}
                            </span>

                            {product.change.dir === "up" && (
                                <span className="text-error ml-2">
                                    <span className="relative top-px">▲</span>{" "} {toBanglaNumber(product.change.pct)}%
                                </span>
                            )}

                            {product.change.dir === "down" && (
                                <span className="text-success ml-2">
                                    <span className="relative top-0.5">▼</span>{" "}{toBanglaNumber(Math.abs(product.change.pct))}%
                                </span>
                            )}


                        </div>
                    </div>
                ))}
            </MarqueeText>
        </div>
    );
};

export default PriceTicker;