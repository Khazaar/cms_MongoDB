import * as dotenv from "dotenv";
dotenv.config();
import { ConnectionHelper } from "./src/helpers/connection.helper";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import * as winstonDailyRotateFile from "winston-daily-rotate-file";
import { app } from "./src/app";

ConnectionHelper.connectToDatabase();

const port = process.env.PORT as string; // != undefined process.env.PORT ? "2050"

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
