import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Constants } from "../consts";
import ReportService from "../services/report.service";
import dotenv from "dotenv"
import { ExecException } from "child_process";
dotenv.config();

type HttpResponse = {
    success: boolean,
    data?: any,
    msg?: string,
    error?: any
}

export class AEPController {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient({});
    }
    public getContact = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            // input validation
            if (!id) {
                let response: HttpResponse = {
                    success: false,
                    msg: "Contact ID missing!"
                };
                res.status(400).json(response);
                return;
            }

            const result = await this.prisma.aep_contacts.findUnique({
                where: {
                    contact_id: Number(id)
                }
            });

            // data validation
            if (!result) {
                let response: HttpResponse = {
                    success: false,
                    msg: "Contact not found!"
                };
                res.status(400).json(response);
                return;
            }

            let response: HttpResponse = {
                success: true,
                data: result
            };
            res.status(200).json(response);
        } catch (e) {
            let result = {
                success: false,
                error: e
            }
            res.status(500).json(result);
        }
    };
    public getStatuses = (req: Request, res: Response, next: NextFunction) => {
        let response: HttpResponse = {
            success: true,
            data: Constants.CLIENT_STATUS
        };
        res.status(200).json(response);
    };
    public login = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.body;
        try {
            const result = await this.prisma.aep_users.findUnique({
                where: {
                    user_id: Number(user_id)
                }
            });

            // data validation
            if (!result) {
                let response: HttpResponse = {
                    success: false,
                    msg: "User not found!"
                };
                res.status(400).json(response);
                return;
            }
            req.session.user = result;

            let response: HttpResponse = {
                success: true,
                data: result
            };
            res.status(200).json(response);
        } catch (e) {
            let result = {
                success: false,
                error: e
            }
            res.status(500).json(result);
        }
    }
    public logout = async (req: Request, res: Response, next: NextFunction) => {
        delete req.session.user;
        res.status(200).json({success:true});
    }
    public currentSession = async (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({success:true, data: req.session});
    }
    public isLogged = async (req: Request, res: Response, next: NextFunction) => {
        console.log("isLogged", req.cookies, req.session);
        res.status(200).json({success: (req.session.user || req.cookies ? true : false )});
    }
    // reports
    public getAgents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let result = await ReportService.getAgents();        
            res.status(200).json({ success: true, data: result});
        } catch (e) {
            res.status(500).json({ success: false, msg: "Ops! I don't know what is happening!", error: e });
        }
    }
    public getReportByStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let { agent_id, dateStart, dateStop } = req.body;
            let filter = ReportService.validateFilter(agent_id, dateStart, dateStop);
            let result = await ReportService.getTotalByStatus(filter);        
            res.status(200).json({ success: true, data: result});
        } catch (e) {
            res.status(500).json({ success: false, msg: "Ops! I don't know what is happening!", error: e });
        }
    }
    public getTotalByStatusAgent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let { agent_id, dateStart, dateStop } = req.body;
            let filter = ReportService.validateFilter(agent_id, dateStart, dateStop);
            let result = await ReportService.getTotalByStatusAgent(filter);        
            res.status(200).json({ success: true, data: result});
        } catch (e) {
            res.status(500).json({ success: false, msg: "Ops! I don't know what is happening!", error: e });
        }
    }

}