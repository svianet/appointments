import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterProps, RequestToAPI, UserData, ReportsByStatus, SummaryReport, Top10Report } from '../consts';
import DateInput from '../components/DateInput';
import AgentDropdown from '../components/AgentDropdown';
import StatusTable from '../components/StatusTable';
import AgentTable from '../components/AgentTable';
import SummaryTable from '../components/SummaryTable';
import TopAgentsTable from '../components/TopAgentsTable';

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

const fetchReportAppointmentSummary = async (filter: FilterProps) => {
    try {
        const response = await RequestToAPI<SummaryReport[]>(
            "reportAppointmentSummary",
            "POST",
            JSON.stringify(filter)
        );
        if (!response || !response.data) { return; };
        return response.data;
    } catch (e) {
        console.error("reportAppointmentSummary Error: ", e);
    }
}

const fetchReportTopAgents = async (name: string, filter: FilterProps) => {
    try {
        const response = await RequestToAPI<Top10Report[]>(
            name,
            "POST",
            JSON.stringify(filter)
        );
        if (!response || !response.data) { return; };
        return response.data;
    } catch (e) {
        console.error(name + " Error: ", e);
    }
}

const Reports = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>("");
    const [filter, setFilter] = useState<FilterProps>({});

    const [allAgents, setAllAgents] = useState<UserData[]>([]);
    const [reportStatus, setReportStatus] = useState<ReportsByStatus[]>([]);
    const [reportStatusAgent, setReportStatusAgent] = useState<(ReportsByStatus & UserData)[]>([]);
    const [reportAppointmentSummary, setReportAppointmentSummary] = useState<SummaryReport[]>([]);
    const [reportTopAgents, setReportTopAgents] = useState<Top10Report[]>([]);
    const [reportTopSchedulers, setReportTopSchedulers] = useState<Top10Report[]>([]);
    
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
    
    const getReportsAppointmentSummary = async () => {
        const result = await fetchReportAppointmentSummary(filter);
        if (!result) { return; };
        setReportAppointmentSummary(result);
    }

    const getReportsTopAgents = async () => {
        const result = await fetchReportTopAgents("reportTop10Agents", filter);
        if (!result) { return; };
        setReportTopAgents(result);
    }
    const getReportsTopSchedulers = async () => {
        const result = await fetchReportTopAgents("reportTop10Schedulers", filter);
        if (!result) { return; };
        setReportTopSchedulers(result);
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
        getReportsAppointmentSummary();
        getReportsTopAgents();
        getReportsTopSchedulers();
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

                    <div className="flex flex-col gap-4">
                        <h1 className="dark:text-white text-center text-xl font-semibold text-zinc-900">
                            Appointment Summary
                        </h1>
                        <SummaryTable data={reportAppointmentSummary} />
                    </div>

                    {!filter.agent_id &&
                    <div className="flex flex-col gap-4">
                        <h1 className="dark:text-white text-center text-xl font-semibold text-zinc-900">
                            By Status 
                        </h1>
                        <StatusTable data={reportStatus} />
                    </div>}
                    
                    <div className="flex flex-col gap-4">
                        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                            <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                                <div className="flex w-full items-center justify-between space-x-6 p-6">
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="truncate text-sm font-medium text-gray-900">Top Agents</h3>
                                        </div>
                                    </div>
                                </div>
                                <TopAgentsTable data={reportTopAgents} />
                            </li>                            
                            <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                                <div className="flex w-full items-center justify-between space-x-6 p-6">
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="truncate text-sm font-medium text-gray-900">Top Schedulers</h3>
                                        </div>
                                    </div>
                                </div>
                                <TopAgentsTable data={reportTopSchedulers} />
                            </li>
                        </ul>
                    </div>

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