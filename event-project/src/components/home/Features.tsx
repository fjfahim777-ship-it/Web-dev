import Link from "next/link";

const Features = () => {
    const features = [
        {
            icon: "🔍",
            title: "Discover Events",
            description:
                "Explore upcoming community events and find meaningful opportunities to make a positive difference.",
            link: "/upcoming-events",
            button: "Explore Events",
        },
        {
            icon: "📅",
            title: "Create Events",
            description:
                "Have an idea to help your community? Create an event and bring people together for a good cause.",
            link: "/create-event",
            button: "Create Event",
        },
        {
            icon: "🤝",
            title: "Join the Community",
            description:
                "Connect with passionate volunteers, participate in activities, and make lasting contributions.",
            link: "/sign-up",
            button: "Join Us",
        },
    ];

    return (
        <section className="bg-[#F8FAF8] py-20">
            <div className="mx-auto max-w-7xl px-6">

                {/* Section Heading */}
                <div className="mx-auto max-w-2xl text-center">

                    <span className="font-semibold uppercase tracking-wider text-green-700">
                        What We Offer
                    </span>

                    <h2 className="mt-3 text-3xl font-bold text-[#172B24] md:text-4xl">
                        Everything You Need to
                        <span className="text-green-700"> Make an Impact</span>
                    </h2>

                    <p className="mt-4 leading-7 text-gray-600">
                        Eventify makes it easier to discover opportunities,
                        organize initiatives, and work together to build
                        stronger communities.
                    </p>

                </div>

                {/* Feature Cards */}
                <div className="mt-14 grid gap-8 md:grid-cols-3">

                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group rounded-2xl border border-green-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >

                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl transition duration-300 group-hover:bg-green-700">
                                {feature.icon}
                            </div>

                            <h3 className="mt-6 text-xl font-bold text-[#172B24]">
                                {feature.title}
                            </h3>

                            <p className="mt-4 min-h-20 leading-7 text-gray-600">
                                {feature.description}
                            </p>

                            <Link
                                href={feature.link}
                                className="mt-6 inline-flex items-center gap-2 font-semibold text-green-700 transition hover:gap-3"
                            >
                                {feature.button}
                                <span>→</span>
                            </Link>

                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
};

export default Features;