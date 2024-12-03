import { SummaryReport } from "../consts";

const SummaryTable = ({ data }: { data: SummaryReport[] }) => {
    return (
        <>
        {data && data.length == 1 &&
        <div className="overflow-x-auto">
            <table>
                <thead>
                    <tr>
                        <th className="first-column text-sm font-semibold">&nbsp;</th>
                        <th className="text-sm font-semibold">Planned</th>
                        <th className="text-sm font-semibold">Incomplete</th>
                        <th className="text-sm font-semibold">Complete</th>
                        <th className="text-sm font-semibold">Cancelled</th>
                        <th className="text-sm font-semibold">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-sm text-center mx-2">
                            Count
                        </td>
                        <td className="text-sm text-center mx-2">
                            { data[0].total_planned || 0}
                        </td>
                        <td className="text-sm text-center mx-2">
                            { data[0].total_incomplete || 0}
                        </td>
                        <td className="text-sm text-center mx-2">
                            { data[0].total_complete || 0}
                        </td>
                        <td className="text-sm text-center mx-2">
                            { data[0].total_cancelled || 0}
                        </td>
                        <td className="text-sm text-center mx-2">
                            { data[0].total || 0}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-sm text-center mx-2">
                            Percentage
                        </td>
                        <td className="text-sm text-center mx-2">
                            { Math.round(data[0].total_planned / data[0].total * 100) || 0} %
                        </td>
                        <td className="text-sm text-center mx-2">
                            { Math.round(data[0].total_incomplete / data[0].total * 100) || 0} %
                        </td>
                        <td className="text-sm text-center mx-2">
                            { Math.round(data[0].total_complete / data[0].total * 100) || 0} %
                        </td>
                        <td className="text-sm text-center mx-2">
                            { Math.round(data[0].total_cancelled / data[0].total * 100) || 0} %
                        </td>
                        <td className="text-sm text-center mx-2">
                            &nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>}
        </>
    )
}

export default SummaryTable;