import { useEffect, useState } from "react";
import { ReportsByStatus, CLIENT_STATUS } from "../consts";

const StatusTable = ({ data }: { data: ReportsByStatus[] }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="overflow-x-auto">
            {isMobile ? <table>
                <thead>
                    <tr>
                        <th className="first-column text-sm font-semibold">&nbsp;</th>
                        <th className="text-sm font-semibold">Count</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(CLIENT_STATUS).map((val, index) => (
                        <tr key={index}>
                            <td className="text-sm text-center mx-2">
                                {val}
                            </td>
                            <td className="text-sm text-center mx-2">
                                {data.find(event => event.eventstatus === val)?.total_appointments || 0}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> :
                <table>
                    <thead>
                        <tr>
                            <th className="first-column text-sm font-semibold">&nbsp;</th>
                            {Object.values(CLIENT_STATUS).map((val, index) => (
                                <th key={index} className="text-sm font-semibold">
                                    {val}
                                </th>
                            ))}
                            <th className="text-sm font-semibold">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span className="text-sm text-center font-semibold mx-2">Count</span></td>
                            {Object.values(CLIENT_STATUS).map((val, index) => (
                                <td key={index}>
                                    {data.find(event => event.eventstatus === val)?.total_appointments || 0}
                                </td>
                            ))}
                            <td className="text-sm">
                                {data.reduce((acc, event) => acc + event.total_appointments, 0)}
                            </td>
                        </tr>
                    </tbody>
                </table>}
        </div>
    )
}

export default StatusTable;