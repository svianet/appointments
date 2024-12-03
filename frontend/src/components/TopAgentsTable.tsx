import { Top10Report } from "../consts";

const TopAgentsTable = ({ data }: { data: Top10Report[] }) => {
    return (
        <div className="overflow-x-auto overflow-y-auto max-h-[280px]">
            <table>
                <thead>
                    <tr>
                        <th className="first-column text-sm font-semibold">Agent</th>
                        <th className="text-sm font-semibold">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="text-sm text-center mx-2">
                                {item.name}
                            </td>
                            <td className="text-sm text-center mx-2">
                                {item.total_appointments}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default TopAgentsTable;