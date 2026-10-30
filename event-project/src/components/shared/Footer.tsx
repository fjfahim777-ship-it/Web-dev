const Footer = () => {
    return (
        <footer className="border-t border-base-300 bg-base-100">
            <div className="mx-auto max-w-7xl px-4 py-5">

                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

                    {/* Logo and Description */}
                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-bold text-green-800">
                            Eventify
                        </h2>

                        <p className="mt-2 text-sm text-base-content/70">
                            Together, we can make a difference in our community.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex gap-6 text-sm">
                        <a href="/" className="hover:text-green-700">
                            Home
                        </a>

                        <a href="/upcoming-events" className="hover:text-green-700">
                            Upcoming Events
                        </a>

                        <a href="/sign-up" className="hover:text-green-700">
                            Join Us
                        </a>
                    </div>

                </div>

            </div>
        </footer>
    );
};

export default Footer;