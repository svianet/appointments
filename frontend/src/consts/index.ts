/* eslint-disable @typescript-eslint/no-explicit-any */

// API Constants
export const ENDPOINT = "http://localhost:3000";

type APIResponse<T = any> = {
    success: boolean
    code?: number | string
    msg?: string
    data?: T
}

type AcceptedMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export const ResquestToAPI = async <T = any>(
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