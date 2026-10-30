import Link from "next/link";

type EventCardProps = {
    id: string;
    title: string;
    category: string;
    date: string;
    location: string;
    image: string;
};

const EventCard = ({
    id,
    title,
    category,
    date,
    location,
    image,
}: EventCardProps) => {
    return (
        <div className="group overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

            {/* Event Image */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-green-800 shadow">
                    {category}
                </span>
            </div>

            {/* Event Information */}
            <div className="p-6">

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>📅</span>
                    <span>{date}</span>
                </div>

                <h3 className="mt-3 text-xl font-bold text-[#172B24] transition group-hover:text-green-700">
                    {title}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <span>📍</span>
                    <span>{location}</span>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4">
                    <Link
                        href={`/events/${id}`}
                        className="flex items-center justify-between font-semibold text-green-700 transition hover:text-green-900"
                    >
                        View Event
                        <span className="text-xl">→</span>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default EventCard;