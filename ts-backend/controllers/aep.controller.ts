import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
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
            const result = await this.prisma.aep_contact.findUnique({
                where: {
                    contact_id: 123
                }
            });

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
}