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
}

export default ReportService.getInstance();