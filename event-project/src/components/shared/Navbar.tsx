"use client";

import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const handleThemeChange = () => {
        const newTheme = !isDark;

        setIsDark(newTheme);
        document.documentElement.setAttribute(
            "data-theme",
            newTheme ? "dark" : "light"
        );
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-base-300 bg-base-100">
            <div className="navbar mx-auto max-w-7xl px-4">

                {/* Logo */}
                <div className="navbar-start">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-xl font-bold text-white">
                            E
                        </div>

                        <span className="text-xl font-bold text-green-800">
                            Eventify
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-end hidden gap-6 md:flex">

                    <Link
                        href="/upcoming-events"
                        className="font-medium transition hover:text-green-700"
                    >
                        Upcoming Events
                    </Link>

                    {/* Theme Toggle */}
                    <button
                        onClick={handleThemeChange}
                        className="btn btn-ghost btn-circle"
                        aria-label="Toggle theme"
                    >
                        {isDark ? "☀️" : "🌙"}
                    </button>

                    {/* Authentication */}
                    <Link
                        href="/sign-in"
                        className="font-medium hover:text-green-700"
                    >
                        Login
                    </Link>

                    <Link
                        href="/sign-up"
                        className="btn border-none bg-green-700 text-white hover:bg-green-800"
                    >
                        Register
                    </Link>

                </div>

                {/* Mobile Menu */}
                <div className="navbar-end md:hidden">

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="btn btn-ghost btn-circle text-xl"
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>

                </div>
            </div>

            {/* Mobile Navigation Links */}
            {isMenuOpen && (
                <div className="border-t border-base-300 bg-base-100 p-4 md:hidden">
                    <div className="flex flex-col gap-4">

                        <Link
                            href="/upcoming-events"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Upcoming Events
                        </Link>

                        <button
                            onClick={handleThemeChange}
                            className="text-left"
                        >
                            {isDark ? "Light Mode ☀️" : "Dark Mode 🌙"}
                        </button>

                        <Link
                            href="/sign-in"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Login
                        </Link>

                        <Link
                            href="/sign-up"
                            onClick={() => setIsMenuOpen(false)}
                            className="font-semibold text-green-700"
                        >
                            Register
                        </Link>

                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;