import Link from "next/link";
import EventCard from "@/components/events/EventCard";

const UpcomingEvents = () => {
    const events = [
        {
            id: "1",
            title: "Community Tree Plantation",
            category: "Plantation",
            date: "November 15, 2026",
            location: "Comilla, Bangladesh",
            image: "https://images.unsplash.com/photo-1448375240586-882707db888b",
        },
        {
            id: "2",
            title: "Clean Our Neighborhood",
            category: "Cleanup",
            date: "November 18, 2026",
            location: "Dhaka, Bangladesh",
            image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
        },
        {
            id: "3",
            title: "Winter Clothes Donation",
            category: "Donation",
            date: "November 22, 2026",
            location: "Chittagong, Bangladesh",
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
        },
        {
            id: "4",
            title: "Community Blood Donation",
            category: "Donation",
            date: "November 25, 2026",
            location: "Comilla, Bangladesh",
            image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4",
        },
        {
            id: "5",
            title: "Save Our Local Rivers",
            category: "Cleanup",
            date: "November 28, 2026",
            location: "Sylhet, Bangladesh",
            image: "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2",
        },
        {
            id: "6",
            title: "Food Distribution Program",
            category: "Donation",
            date: "December 2, 2026",
            location: "Dhaka, Bangladesh",
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
        },
    ];

    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6">

                {/* Section Heading */}
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                    <div className="max-w-2xl">
                        <span className="font-semibold uppercase tracking-wider text-green-700">
                            Make a Difference
                        </span>

                        <h2 className="mt-3 text-3xl font-bold text-[#172B24] md:text-4xl">
                            Upcoming{" "}
                            <span className="text-green-700">
                                Events
                            </span>
                        </h2>

                        <p className="mt-4 leading-7 text-gray-600">
                            Discover meaningful community activities and
                            find your next opportunity to create a positive
                            impact.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">

                        <Link
                            href="/upcoming-events"
                            className="btn border border-green-700 bg-white text-green-800 hover:bg-green-50"
                        >
                            View All Events
                        </Link>

                        <Link
                            href="/create-event"
                            className="btn border-none bg-green-700 text-white hover:bg-green-800"
                        >
                            + Create Event
                        </Link>

                    </div>

                </div>

                {/* Event Cards */}
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            {...event}
                        />
                    ))}

                </div>

            </div>
        </section>
    );
};

export default UpcomingEvents;