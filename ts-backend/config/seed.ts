import { PrismaClient } from "@prisma/client"
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { faker } from '@faker-js/faker';

const importCSV = (filePath: string): Promise<any[]> => {
    const rows: any[] = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
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
    event_id: string,
    eventstatus: string,
    agent_id: string
}
type AEP_User = {
    user_id: number,
    name: string,
    role: string
}

/** `npx ts-node config/seed.ts` add the CSV to our database */
(async () => {
    const prisma = new PrismaClient()

    // import the data from the CSV   
    const aep_events: AEP_Event[] = await importCSV(path.resolve(__dirname, 'aep_events.csv'));
    // get unique agents
    const agents = [...new Set(aep_events.map(item => item.agent_id))];
    
    // get information to seed our user table
    let users: AEP_User[] = [];
    agents.forEach(agent_id => {
        let user: AEP_User = {
            user_id: Number(agent_id),
            name: faker.person.fullName(),
            role: "agent"
        }
        users.push(user);
    });
    console.log(users);    
    console.log(aep_events.length);

    try {
        await prisma.aep_users.createMany({
            data: users
        })
        console.log('Data spreaded');
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
})()