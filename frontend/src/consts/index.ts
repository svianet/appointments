/* eslint-disable @typescript-eslint/no-explicit-any */

// API Constants
export const ENDPOINT = "https://medigapapi.svianet.com";

type APIResponse<T = any> = {
    success: boolean
    code?: number | string
    msg?: string
    data?: T
}

type AcceptedMethods = "GET" | "OPTIONS" | "POST";

export const RequestToAPI = async <T = any>(
    path: string,
    method: AcceptedMethods,
    body?: any,
): Promise<APIResponse<T> | void> => {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
        const url = `${ENDPOINT}/api/aep/${path}`;
        const request = await fetch(url, {
            method,
            credentials: "include",
            headers,
            body
        })
        if (!request.ok) {
            console.error(`RequestToAPI Error: ${url.replace(ENDPOINT, "")}\nResponse = ${request.statusText}`);
            if (!request.headers.get("Content-Type")?.includes("application/json")) {
                return {
                    success: false,
                    msg: request.statusText
                }
            }
        }
        return await request.json() as APIResponse<T>;
    } catch (e) {
        console.error(e);
    }
}

export type ReactFn<T> = React.Dispatch<React.SetStateAction<T>>

export type FilterProps = {
    dateStop?: string,
    dateStart?: string,
    agent_id?: number
}

// Constants
export const CLIENT_STATUS = {
    PLANNED: "Planned",
    ATTEMPT_1: "Attempt 1",
    ATTEMPT_2: "Attempt 2",
    INPROGRESS: "Inprogress",
    INCOMPLETED: "Incompleted",
    HELD: "Held",
    NOT_HELD: "Not Held",
    AEP_REVIEW_COMPLETE: "AEP Review Complete",
    CANCELLED: "Cancelled",
} as const;

// data models
export type UserData = {
    user_id: number,
    name: string,
}

export type ReportsByStatus = {
    total_appointments: number,
    eventstatus: string
}