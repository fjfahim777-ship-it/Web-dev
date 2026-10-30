import EventGrid from "@/components/events/EventGrid";

export default function UpcomingEventsPage() {
    return (
        <main className="min-h-screen bg-[#F8FAF8]">
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                {/* Page Heading */}
                <div className="mb-12 text-center">
                    <span className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                        Make an Impact
                    </span>

                    <h1 className="text-3xl font-bold text-[#172B24] sm:text-4xl lg:text-5xl">
                        Explore Upcoming Events
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Discover opportunities to make a difference in your
                        community. Find an event, join the movement, and
                        create positive change together.
                    </p>
                </div>

                {/* Events Grid */}
                <EventGrid />

            </section>
        </main>
    );
}