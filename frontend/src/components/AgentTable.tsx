import { ReportsByStatus, UserData, CLIENT_STATUS } from "../consts";

const StatusTable = ({ data }: { data: (ReportsByStatus & UserData)[] }) => {
    const FilteredData: Record<string, Record<string, number>> = {};

    // pivot the data to keep the same structure of Status Table
    for (const event of data) {
        if (!FilteredData[event.name]) {
            FilteredData[event.name] = {};
        }
        FilteredData[event.name][event.eventstatus] = event.total_appointments;
        FilteredData[event.name]["total_appointments"] = (FilteredData[event.name]["total_appointments"] || 0) + event.total_appointments;
    }

    return (
        <div className="overflow-x-auto overflow-y-auto max-h-[280px]">
            <table>
                <thead>
                    <tr>
                        <th className="first-column text-sm font-semibold">&nbsp;</th>
                        {Object.values(CLIENT_STATUS).map((val, index) => (
                            <th key={index} className="text-sm font-semibold">
                                {val}
                            </th>
                        ))}
                        <th className="text-sm font-semibold">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(FilteredData).map((name, index) => (
                        <tr key={index}>
                            <td className="text-sm text-center mx-2">
                                {name}
                            </td>
                            {Object.values(CLIENT_STATUS).map((val, index) => (
                                <td key={index} className="text-sm">
                                    {FilteredData[name][val] || 0}
                                </td>
                            ))}
                            <td className="text-sm text-center mx-2">
                                {FilteredData[name]["total_appointments"] || 0}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default StatusTable;