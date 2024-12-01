import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Constants } from "../consts";
import dotenv from "dotenv"
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
    // reports
    public getReportByStatus = async (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({success:true, data: []});
    }

}