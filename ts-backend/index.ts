import express from 'express';
import routes from "./routes";
import cors from 'cors';
import "./consts/session";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',
    'https://medigap.svianet.com',
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS not allowed for origin: ${origin}`));
            }
        },
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET || "SESSION_SECRET",
        resave: false,
        saveUninitialized: false,
        name: "medigap_session",
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: Number(process.env.SESSION_LIFETIME),
            sameSite: "none"
        },
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', routes);
app.listen(port, () => {
    console.log("Medigap Life API listening on " + port);
});
export default app;
