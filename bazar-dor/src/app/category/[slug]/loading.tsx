const Loading = () => {
    return (
        <main className="mx-auto max-w-7xl px-4 py-10">
            <div className="flex min-h-64 items-center justify-center">
                <button className="btn bg-base-200">
                    <span className="loading loading-spinner"></span>
                    পণ্য লোড হচ্ছে...
                </button>
            </div>
        </main>
    );
};

export default Loading;