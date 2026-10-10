import Image from "next/image";
import Link from "next/link";
import heroImage from "@/assets/bazar-hero.png";
import BanglaDate from "@/components/shared/BanglaDate";

const Hero = async () => {
    return (
        <section className="w-full px-4 py-8 md:py-10">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 rounded-3xl border border-base-content/10 bg-base-200 p-6 sm:p-10 lg:flex-row lg:p-6">

                <div className="flex max-w-xl flex-col items-start">
                    <span className="mb-4 rounded-full bg-success/10 px-3 py-1 text-sm text-success">
                        <BanglaDate />
                    </span>

                    <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                        আজকের বাজারের দাম এক নজরে
                    </h1>

                    <p className="mt-4 max-w-lg text-sm leading-7 text-base-content/70 sm:text-base">
                        চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
                        বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
                    </p>

                    <Link
                        href="#সব-পণ্য"
                        className="btn mt-6 self-center rounded-lg border-none bg-[#05893E] text-white hover:bg-[#05893E] lg:self-start"
                    >
                        সব পণ্য দেখুন
                    </Link>
                </div>

                <div className="flex w-full justify-center md:w-auto md:justify-end">
                    <Image
                        src={heroImage}
                        alt="বাজারের পণ্য"
                    />
                </div>

            </div>
        </section>
    );
};

export default Hero;