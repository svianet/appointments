import express from 'express';
import routes from "./routes";
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(
    session({
        secret: process.env.SESSION_SECRET || "SESSION_SECRET",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: Number(process.env.SESSION_LIFETIME),
        },
    })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', routes);
app.listen(port, () => {
    console.log("Medigap Life listening on " + port);
});
export default app;
