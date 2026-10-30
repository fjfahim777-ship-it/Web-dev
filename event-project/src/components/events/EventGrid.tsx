"use client";

import { useState } from "react";
import EventCard from "./EventCard";

const events = [
    {
        id: "1",
        title: "Community Tree Plantation",
        category: "Plantation",
        date: "2026-11-15",
        location: "Comilla, Bangladesh",
        image:
            "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
    },
    {
        id: "2",
        title: "Winter Clothes Distribution",
        category: "Donation",
        date: "2026-11-18",
        location: "Dhaka, Bangladesh",
        image:
            "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=800",
    },
    {
        id: "3",
        title: "Neighborhood Cleanup Drive",
        category: "Cleanup",
        date: "2026-11-20",
        location: "Chittagong, Bangladesh",
        image:
            "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
    },
    {
        id: "4",
        title: "Food Distribution Program",
        category: "Donation",
        date: "2026-11-23",
        location: "Sylhet, Bangladesh",
        image:
            "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800",
    },
    {
        id: "5",
        title: "Save Our Rivers Campaign",
        category: "Awareness",
        date: "2026-11-25",
        location: "Comilla, Bangladesh",
        image:
            "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?w=800",
    },
    {
        id: "6",
        title: "Community Health Awareness",
        category: "Awareness",
        date: "2026-11-28",
        location: "Dhaka, Bangladesh",
        image:
            "https://images.unsplash.com/photo-1504150558244-0ef6d4c8f0d6?w=800",
    },
];

export default function EventGrid() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = [
        "All",
        "Cleanup",
        "Plantation",
        "Donation",
        "Awareness",
    ];

    const filteredEvents =
        selectedCategory === "All"
            ? events
            : events.filter((event) => event.category === selectedCategory);

    return (
        <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <p className="text-gray-600">
                    Showing <span className="font-semibold">{filteredEvents.length}</span>{" "}
                    events
                </p>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category === "All" ? "All Categories" : category}
                        </option>
                    ))}
                </select>
            </div>

            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} {...event} />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
                    <h3 className="text-xl font-semibold text-[#172B24]">
                        No events found
                    </h3>
                    <p className="mt-2 text-gray-500">
                        Try selecting a different category.
                    </p>
                </div>
            )}
        </div>
    );
}