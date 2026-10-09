import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import PriceTicker from "@/components/shared/PriceTicker";
import Footer from "@/components/shared/Footer"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
});

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "প্রয়োজনীয় পণ্যের আজকের বাজার দর",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      data-theme="light"
      className={`${notoSerifBengali.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">

        <Navbar />
        <PriceTicker />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ToastContainer />

      </body>
    </html>
  );
}