import Image from "next/image";
import logoIcon from "@/assets/logo-icon.png";
import { getBanglaDate } from "@/components/shared/utils";
import type { Category } from "@/types/product";
import { API_BASE_URL } from "@/components/shared/api";
import UserInfo from "@/components/shared/UserInfo";
import Link from "next/link";
import CategoryNav from "@/components/shared/CategoryNav";

const Navbar = async () => {
    "use cache";
    const response = await fetch(`${API_BASE_URL}/categories`);

    const categories: Category[] = await response.json();

    return (
        <nav>

            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

                <Link href='/'>
                    <div className="flex items-center gap-3">

                        <Image
                            src={logoIcon}
                            alt="বাজার দর"
                            width={40}
                            height={40}
                        />


                        <div>
                            <h1 className="text-lg font-bold sm:text-xl">
                                বাজার দর
                            </h1>

                            <p className="text-xs text-base-content/60 sm:text-sm">
                                {getBanglaDate()}
                            </p>
                        </div>
                    </div>
                </Link>

                <UserInfo />
            </div>

            <CategoryNav categories={categories} />
        </nav>
    );
};

export default Navbar;