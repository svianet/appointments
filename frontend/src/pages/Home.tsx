const Home = () => {
    return (
        <div className="h-screen w-full">
            <div className="flex flex-col justify-center items-center gap-4 pt-32">
                <h1 className="dark:text-white text-center text-4xl font-semibold text-zinc-900">
                    Welcome!
                </h1>
                <p className="dark:text-white text-center text-lg font-semibold text-zinc-900">
                    Here I will show some reports to measure the efficacy of scheduled appointments during the AEP.
                </p>
                <a
                    href="/login"
                    className="text-center text-lg font-semibold p-3 rounded bg-emerald-600 w-24 text-white">
                    Start
                </a>
            </div>
        </div>
    )
}

export default Home;