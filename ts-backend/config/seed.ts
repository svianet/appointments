import { PrismaClient } from "@prisma/client"
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { faker } from '@faker-js/faker';

const importCSV = (filePath: string, options: csv.ParserOptionsArgs): Promise<any[]> => {
    const rows: any[] = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv.parse(options))
            .on('data', row => rows.push(row))
            .on('end', () => {
                resolve(rows);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

type AEP_Event = {
    event_id: number,
    eventstatus: string,
    user_id: number
}
type AEP_User = {
    user_id: number,
    name: string,
    role: string
}
type AEP_Appointment = {
    id: number,
    event: string,
    created_time: Date,
    contact_id: number,
    event_uuid: string,
    appointment_time: Date,
    event_id: number,
}
type AEP_Contact = {
    contact_id: number,
    name: string,
    dob?: Date,
}
type AEP_Policy = {
    contact_id: number,
    current_status: string,
    policy_type: string,
}

/** `npx ts-node config/seed.ts` add the CSV to our database */
(async () => {
    const prisma = new PrismaClient()

    // import the data from the CSV   
    // to standarize was used "user_id" instead of "agent_id"
    let aep_events: AEP_Event[] = await importCSV(path.resolve(__dirname, 'aep_events.csv'), 
        { headers: ['event_id','eventstatus','user_id'], renameHeaders: true});
    let aep_appointments: AEP_Appointment[] = await importCSV(path.resolve(__dirname, 'aep_appointments.csv'), 
        { headers: true });
    let aep_policies: AEP_Policy[] = await importCSV(path.resolve(__dirname, 'aep_policies.csv'), 
        { headers: ['contact_id','current_status','policy_type'], renameHeaders: true});
    // get unique agents and contacts
    const agentIds = [...new Set(aep_events.map(item => item.user_id))];
    const contacts_appointments = [...new Set(aep_appointments.map(item => item.contact_id))];
    const contacts_policies = [...new Set(aep_policies.map(item => item.contact_id))];
    const contactIds = [...new Set([...contacts_appointments, ...contacts_policies])];
    
    // get information to seed our user table
    let users: AEP_User[] = [];
    agentIds.forEach(agent_id => {
        let user: AEP_User = {
            user_id: Number(agent_id),
            name: faker.person.fullName(),
            role: "agent"
        }
        users.push(user);
    });
    // console.log(users);    

    let contacts: AEP_Contact[] = [];
    contactIds.forEach(contact_id => {
        if (contact_id) {
            let contact: AEP_Contact = {
                contact_id: Number(contact_id),
                name: faker.person.fullName()
            }
            contacts.push(contact);
        }
    });
    // data transformation (we could use the fast-csv... but here we have only a data seed)
    aep_events.forEach(row => {
        row.event_id = Number(row.event_id);
        row.user_id = Number(row.user_id);        
    })
    // remove invalid row
    aep_policies = aep_policies.filter(item => item.current_status)
    aep_policies.forEach(row => {
        row.contact_id = Number(row.contact_id);
    })
    aep_appointments.forEach(row => {
        row.id = Number(row.id);
        row.event_id = Number(row.event_id);
        row.contact_id = Number(row.contact_id);
        row.created_time = new Date(row.created_time);
        row.appointment_time = new Date(row.appointment_time);
    })

    try {
        await prisma.aep_users.createMany({
            data: users
        })
        await prisma.aep_contacts.createMany({
            data: contacts
        })
        await prisma.aep_events.createMany({
            data: aep_events
        })
        await prisma.aep_policies.createMany({
            data: aep_policies
        })
        await prisma.aep_appointments.createMany({
            data: aep_appointments
        })
        console.log('Data spreaded');
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
})()