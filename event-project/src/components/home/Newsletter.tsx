'use client'
export default function Newsletter() {
    return (
        <section className="bg-[#F0F7F2] px-5 py-20">
            <div className="mx-auto max-w-4xl rounded-3xl bg-[#176B4D] px-6 py-14 text-center text-white md:px-12">
                <p className="mb-3 font-semibold text-emerald-200">
                    STAY CONNECTED
                </p>

                <h2 className="text-3xl font-bold md:text-4xl">
                    Be Part of Something Good
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-emerald-50">
                    Get updates about upcoming events, volunteering opportunities,
                    and the positive changes happening in your community.
                </p>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
                >
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        required
                        className="min-w-0 flex-1 rounded-xl bg-white px-5 py-3 text-gray-800 outline-none placeholder:text-gray-400"
                    />

                    <button
                        type="submit"
                        className="rounded-xl bg-white px-6 py-3 font-semibold text-[#176B4D] transition hover:bg-emerald-50"
                    >
                        Subscribe
                    </button>
                </form>

                <p className="mt-4 text-sm text-emerald-100">
                    Stay inspired. Stay involved. Make a difference.
                </p>
            </div>
        </section>
    );
}

