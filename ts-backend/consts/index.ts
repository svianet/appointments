export namespace Constants {
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
    } as const
    
    export interface UserSession {
        user?: {
            user_id: number;
            name: string;
            role: string;
        }
    }
}