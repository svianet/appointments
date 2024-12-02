const DateInput = ({ id, text, onChange }: { id: string, text: string; onChange: (date: string) => void }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value;
        onChange(selectedDate);
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
                {text}
            </label>
            <div className="mt-2">
                <input
                    id={id}
                    name={id}
                    type="date"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};
export default DateInput;