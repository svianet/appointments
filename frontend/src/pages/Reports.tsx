import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterProps, RequestToAPI, UserData, ReportsByStatus } from '../consts';
import DateInput from '../components/DateInput';
import AgentDropdown from '../components/AgentDropdown';
import StatusTable from '../components/StatusTable';
import AgentTable from '../components/AgentTable';

const performLogout = async () => {
    try {
        const response = await RequestToAPI<void>(
            'logout',
            'POST'
        );
        if (!response || !response.success) { return; };
        return true;
    } catch (e) {
        console.error("performLogout Error: ", e);
    }
}

const LogoutButton = ({ onClick, loading }: { onClick: React.MouseEventHandler<HTMLButtonElement>, loading: boolean }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className="place-self-end rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
        Logout
        </button>
    )
}

const fetchAllAgents = async () => {
    try {
        const response = await RequestToAPI<UserData[]>(
            'getAgents',
            'GET'
        );
        if (!response || !response.data) { return; };
        return response.data;
    } catch (e) {
        console.error("fetchAllAgents Error: ", e);
    }
};

const fetchReportByStatus = async (filter: FilterProps) => {
    try {
        const response = await RequestToAPI<ReportsByStatus[]>(
            "reportByStatus",
            "POST",
            JSON.stringify(filter)
        );
        if (!response || !response.data) { return; };
        return response.data;
    } catch (e) {
        console.error("fetchReportByStatus Error: ", e);
    }
}

const fetchReportByStatusAgent = async (filter: FilterProps) => {
    try {
        const response = await RequestToAPI<(ReportsByStatus & UserData)[]>(
            "reportByStatusAgent",
            "POST",
            JSON.stringify(filter)
        );
        // console.log(response);
        if (!response || !response.data) { return; };
        return response.data;
    } catch (e) {
        console.error("fetchReportByStatusAgent Error: ", e);
    }
}

const Reports = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>("");
    const [filter, setFilter] = useState<FilterProps>({});

    const [allAgents, setAllAgents] = useState<UserData[]>([]);
    const [reportStatus, setReportStatus] = useState<ReportsByStatus[]>([]);
    const [reportStatusAgent, setReportStatusAgent] = useState<(ReportsByStatus & UserData)[]>([]);
    
    const navigate = useNavigate();

    const getAllAgents = async () => {
        const result = await fetchAllAgents();
        if (!result) { return; };
        setAllAgents(result);
    }

    const getReportsByStatus = async () => {
        const result = await fetchReportByStatus(filter);
        if (!result) { return; };
        setReportStatus(result);
    }
    
    const getReportsByStatusAgent = async () => {
        const result = await fetchReportByStatusAgent(filter);
        if (!result) { return; };
        setReportStatusAgent(result);
    }

    const logout = async () => {
        setLoading(true);
        try {
            const result = await performLogout();
            console.log(result)
            if (result) {
                navigate("/");
            } else {
                setError("Logout Error :(");
            }
        } catch (error) {
            console.error(error);
            setError("Logout Error!");
        } finally {
            setLoading(false);
        }
    }

    const setNewDateStop = (value: string) => {
        setFilter({ ...filter, dateStop: value });
    }
    const setNewDateStart = (value: string) => {
        setFilter({ ...filter, dateStart: value });
    }

    useEffect(() => {
        getAllAgents();
        getReportsByStatus();
        getReportsByStatusAgent();
    }, [filter]);

    return (
        <div className="min-h-screen dark:bg-[#121212] bg-white">
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center flex-wrap">
                        <AgentDropdown users={allAgents} onChange={setFilter} />
                        <DateInput id="dateStart" text="Date Start" onChange={setNewDateStart} />
                        <DateInput id="dateStop" text="Date Stop" onChange={setNewDateStop} />
                        <LogoutButton onClick={logout} loading={loading} />
                        {error && (
                            <span className="text-red-400 font-semibold">{error}</span>
                        )}
                    </div>
                    {!filter.agent_id &&
                    <div className="flex flex-col gap-4">
                        <h1 className="dark:text-white text-center text-xl font-semibold text-zinc-900">
                            By Status 
                        </h1>
                        <StatusTable data={reportStatus} />
                    </div>}
                    <div className="flex flex-col gap-4">
                        <h1 className="dark:text-white text-center text-xl font-semibold text-zinc-900">
                            By Agent 
                        </h1>
                        <AgentTable data={reportStatusAgent} />
                    </div>
                </div>
            </main>
        </div>
    );
};
export default Reports;