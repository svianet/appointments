const Reports = () => {
    return (
        <div className="min-h-screen dark:bg-[#121212] bg-white">
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center flex-wrap">
                        Filter
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="dark:text-white text-center text-xl font-semibold text-zinc-900">
                            By Status 
                        </h1>
                        <table>
                            <tr><td>My data</td></tr>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default Reports;