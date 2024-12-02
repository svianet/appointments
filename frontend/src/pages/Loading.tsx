const Loading = () => {
    return (
        <div className="flex justify-center flex-col gap-4 items-center h-screen">
            <span>Loading...</span>
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-slate-500"></div>
        </div>
    )
}
export default Loading