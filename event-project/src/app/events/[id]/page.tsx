import Link from "next/link";

const event = {
    id: "1",
    title: "Community Tree Plantation",
    category: "Plantation",
    date: "November 15, 2026",
    location: "Comilla, Bangladesh",
    image:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200",
    description:
        "Join us for a community tree plantation initiative where volunteers come together to make our environment greener and healthier. Every tree we plant contributes to a cleaner environment and a better future for the next generation. Bring your friends and family and become part of this positive change.",
};

export default async function EventDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <main className="min-h-screen bg-[#F8FAF8]">
            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

                {/* Back Button */}
                <Link
                    href="/upcoming-events"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#176B4D] hover:text-emerald-800"
                >
                    ← Back to Upcoming Events
                </Link>

                {/* Event Content */}
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

                    {/* Event Image */}
                    <div className="h-64 w-full sm:h-96">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Event Information */}
                    <div className="p-6 sm:p-10">

                        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                                {event.category}
                            </span>

                            <span className="text-sm text-gray-500">
                                Event ID: {id}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-[#172B24] sm:text-4xl">
                            {event.title}
                        </h1>

                        {/* Date and Location */}
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">

                            <div className="rounded-xl bg-[#F8FAF8] p-5">
                                <p className="text-sm text-gray-500">
                                    Event Date
                                </p>

                                <p className="mt-2 font-semibold text-[#172B24]">
                                    {event.date}
                                </p>
                            </div>

                            <div className="rounded-xl bg-[#F8FAF8] p-5">
                                <p className="text-sm text-gray-500">
                                    Location
                                </p>

                                <p className="mt-2 font-semibold text-[#172B24]">
                                    {event.location}
                                </p>
                            </div>

                        </div>

                        {/* Description */}
                        <div className="mt-10">
                            <h2 className="text-xl font-bold text-[#172B24]">
                                About This Event
                            </h2>

                            <p className="mt-4 leading-8 text-gray-600">
                                {event.description}
                            </p>
                        </div>

                        {/* Join Event */}
                        <div className="mt-10 border-t border-gray-100 pt-8">
                            <h2 className="text-xl font-bold text-[#172B24]">
                                Be Part of the Change
                            </h2>

                            <p className="mt-2 text-gray-600">
                                Join this event and contribute to making
                                your community a better place.
                            </p>

                            <button className="mt-6 rounded-xl bg-[#176B4D] px-8 py-3 font-semibold text-white transition hover:bg-emerald-800">
                                Join Event
                            </button>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}