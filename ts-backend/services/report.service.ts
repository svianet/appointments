import { PrismaClient, Prisma } from "@prisma/client";
import { Constants } from "../consts";

class ReportService {
    private static instance: ReportService;
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
    public static getInstance(): ReportService {
        if (!ReportService.instance) {
            return new ReportService();
        }
        return ReportService.instance;
    }

    public validateFilter(agent_id: number, dateStart: Date, dateStop: Date): Constants.ReportFilter {
        let filter: Constants.ReportFilter = {}
        if (agent_id) {
            filter.agent_id = Number(agent_id);
        }
        if (dateStart) {
            filter.dateStart = new Date(dateStart);
            if (isNaN(filter.dateStart.getTime())) {
                delete filter.dateStart;
            }
        }
        if (dateStop) {
            filter.dateStop = new Date(dateStop);
            if (isNaN(filter.dateStop.getTime())) {
                delete filter.dateStop;
            }
        }
        // verify is the start date is greater than stop date. In this case, we will consider only start date
        if (filter.dateStart && filter.dateStop && filter.dateStart.getTime() > filter.dateStop.getTime()) {
            delete filter.dateStop;
        }
        return filter;
    }

    /**
     * List of registred agents
     * @returns 
     */
    public async getAgents() {
        let result = await this.prisma.aep_users.findMany({
            select: {
                user_id: true,
                name: true
            },
            where: {
                role: "agent"
            },
            orderBy: {
                name: "asc"
            }
        });
        return result;        
    }
    
    /**
     * Appointments by status
     * @param dateStart Date start
     * @param dateStop Date stop
     * @param user_id Agent ID
     * @returns 
     */
    public async getTotalByStatus(filter: Constants.ReportFilter) {
        let result: { row: string }[] = await this.prisma.$queryRaw`
            SELECT cast(count(aep_appointments.id) as integer) total_appointments
                , eventstatus
            FROM aep_appointments 
            JOIN aep_events on aep_events.event_id = aep_appointments.event_id
            WHERE 1=1
            ${ filter.agent_id ? Prisma.sql` and aep_events.user_id = ${filter.agent_id}` : Prisma.empty }
            ${ filter.dateStart ? Prisma.sql` and aep_appointments.created_time >= ${filter.dateStart}` : Prisma.empty }
            ${ filter.dateStop ? Prisma.sql` and aep_appointments.created_time <= ${filter.dateStop}` : Prisma.empty }
            group by eventstatus`;
        // console.log(result);
        return result;        
    }

    public async getTotalByStatusAgent(filter: Constants.ReportFilter) {
        let result: { row: string }[] = await this.prisma.$queryRaw`
            select cast(count(aep_appointments.id) as integer) total_appointments
                , eventstatus, aep_users.user_id, aep_users.name
            from aep_appointments 
            join aep_events on aep_events.event_id = aep_appointments.event_id
            join aep_users on aep_users.user_id = aep_events.user_id
            WHERE 1=1
            ${ filter.agent_id ? Prisma.sql` and aep_events.user_id = ${filter.agent_id}` : Prisma.empty }
            ${ filter.dateStart ? Prisma.sql` and aep_appointments.created_time >= ${filter.dateStart}` : Prisma.empty }
            ${ filter.dateStop ? Prisma.sql` and aep_appointments.created_time <= ${filter.dateStop}` : Prisma.empty }
            group by eventstatus, aep_users.user_id, aep_users.name
            order by total_appointments desc, aep_users.user_id`;
        // console.log(result);
        return result;        
    }
    
    public async getTop10Agents(filter: Constants.ReportFilter) {
        let result: { row: string }[] = await this.prisma.$queryRaw`
            select cast(count(aep_appointments.id) as integer) total_appointments
                , aep_users.user_id, aep_users.name
            from aep_appointments 
            left join aep_events on aep_events.event_id = aep_appointments.event_id
            left join aep_users on aep_users.user_id = aep_events.user_id
            where eventstatus = 'AEP Review Complete'
            ${ filter.dateStart ? Prisma.sql` and aep_appointments.created_time >= ${filter.dateStart}` : Prisma.empty }
            ${ filter.dateStop ? Prisma.sql` and aep_appointments.created_time <= ${filter.dateStop}` : Prisma.empty }
            group by aep_users.user_id, aep_users.name
            order by total_appointments desc
            limit 10`;
        // console.log(result);
        return result;        
    }
    public async getTop10Schedulers(filter: Constants.ReportFilter) {
        let result: { row: string }[] = await this.prisma.$queryRaw`
            select cast(count(aep_appointments.id) as integer) total_appointments
                , aep_users.user_id, aep_users.name
            from aep_appointments 
            left join aep_events on aep_events.event_id = aep_appointments.event_id
            left join aep_users on aep_users.user_id = aep_events.user_id
            where eventstatus in ('Planned')
            ${ filter.dateStart ? Prisma.sql` and aep_appointments.created_time >= ${filter.dateStart}` : Prisma.empty }
            ${ filter.dateStop ? Prisma.sql` and aep_appointments.created_time <= ${filter.dateStop}` : Prisma.empty }
            group by aep_users.user_id, aep_users.name
            order by total_appointments desc
            limit 10`;
        // console.log(result);
        return result;        
    }
    public async getAppointmentSummary(filter: Constants.ReportFilter) {
        let result: { row: string }[] = await this.prisma.$queryRaw`
            select sum(case when eventstatus not in ('AEP Review Complete', 'Cancelled', 'Incompleted') then 1 else 0 end)::integer total_planned
                , sum(case when eventstatus = 'Incompleted' then 1 else 0 end)::integer total_incomplete
                , sum(case when eventstatus = 'AEP Review Complete' then 1 else 0 end)::integer total_complete
                , sum(case when eventstatus = 'Cancelled' then 1 else 0 end)::integer total_cancelled
                , count(aep_appointments.id)::integer total
            from aep_appointments 
            join aep_events on aep_events.event_id = aep_appointments.event_id
            where 1=1
            ${ filter.agent_id ? Prisma.sql` and aep_events.user_id = ${filter.agent_id}` : Prisma.empty }
            ${ filter.dateStart ? Prisma.sql` and aep_appointments.created_time >= ${filter.dateStart}` : Prisma.empty }
            ${ filter.dateStop ? Prisma.sql` and aep_appointments.created_time <= ${filter.dateStop}` : Prisma.empty }
            `;
        // console.log(result);
        return result;        
    }
    public async getAppointmentSummaryByMonth(filter: Constants.ReportFilter) {
        let result: { row: string }[] = await this.prisma.$queryRaw`
            select date_trunc('month', aep_appointments.created_time) ref_lead_month
                , sum(case when eventstatus not in ('AEP Review Complete', 'Cancelled', 'Incompleted') then 1 else 0 end)::integer total_planned
                , sum(case when eventstatus = 'Incompleted' then 1 else 0 end)::integer total_incomplete
                , sum(case when eventstatus = 'AEP Review Complete' then 1 else 0 end)::integer total_complete
                , sum(case when eventstatus = 'Cancelled' then 1 else 0 end)::integer total_cancelled
                , count(aep_appointments.id)::integer total
            from aep_appointments 
            join aep_events on aep_events.event_id = aep_appointments.event_id
            where 1=1
            ${ filter.agent_id ? Prisma.sql` and aep_events.user_id = ${filter.agent_id}` : Prisma.empty }
            ${ filter.dateStart ? Prisma.sql` and aep_appointments.created_time >= ${filter.dateStart}` : Prisma.empty }
            ${ filter.dateStop ? Prisma.sql` and aep_appointments.created_time <= ${filter.dateStop}` : Prisma.empty }
            group by date_trunc('month', aep_appointments.created_time)
            order by ref_lead_month`;
        // console.log(result);
        return result;        
    }
}

export default ReportService.getInstance();