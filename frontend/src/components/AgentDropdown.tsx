import { ReactFn, FilterProps, UserData } from "../consts";
import { ChevronDownIcon } from '@heroicons/react/24/solid'

const AgentDropdown = ({ users, onChange }: { users: UserData[], onChange: ReactFn<FilterProps> }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(current => ({ ...current, agent_id: Number(e.target.value) }));
    };
    return (
        <div>
            <label htmlFor="agent-dropdown" className="block text-sm/6 font-medium text-gray-900">
                Agent
            </label>
            <div className="mt-2 grid grid-cols-1">
                <select
                    id="agent-dropdown"
                    title="Agent"
                    onChange={handleChange}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                    <option value="">All</option>
                    {users.map((user) => (
                        <option key={user.user_id} value={user.user_id}>
                            {user.name}
                        </option>
                    ))}
                </select>
                <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
            </div>
        </div>
    );
};
export default AgentDropdown;