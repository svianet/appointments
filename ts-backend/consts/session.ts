// define our session
import "express-session";
import { Constants } from ".";

declare module "express-session" {
    interface SessionData extends Constants.UserSession { }
}