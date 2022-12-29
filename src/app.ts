import express, {
    Express,
    Application,
    NextFunction,
    Response,
    Request,
} from "express";
import taskStaticRoutes from "./routes/taskStatic.routes";
import taskDynamicoutes from "./routes/taskDynamic.routes";
//import morgan from "morgan";
import cors from "cors";
import http from "http";

const app: Express = express();

/** Logging */
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());

/** RULES OF OUR API */
app.use((req, res, next) => {
    // set the CORS policy
    res.header("Access-Control-Allow-Origin", "*");
    // set the CORS headers
    res.header(
        "Access-Control-Allow-Headers",
        "origin, X-Requested-With,Content-Type,Accept, Authorization"
    );
    // set the CORS method headers
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
        return res.status(200).json({});
    }
    next();
});

/** Routes */
app.use("/taskStatic", taskStaticRoutes.router);
app.use("/taskDynamic", taskDynamicoutes.router);

/** Error handling */
app.use((req, res, next) => {
    const error = new Error("not found");
    return res.status(404).json({
        message: error.message,
    });
});

export { app };
