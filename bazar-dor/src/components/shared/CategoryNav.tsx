"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/types/product";

type CategoryNavProps = {
    categories: Category[];
};

const CategoryNav = ({ categories }: CategoryNavProps) => {
    const pathname = usePathname();

    return (
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3">
            {categories.map((category) => {
                const isActive = pathname === `/category/${category.slug}`;

                return (
                    <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs md:text-sm ${isActive
                            ? "bg-[#05893E] text-primary-content"
                            : "hover:bg-base-200"
                            }`}
                    >
                        <span>{category.icon}</span>
                        <span>{category.nameBn}</span>
                    </Link>
                );
            })}
        </div>
    );
};

export default CategoryNav;