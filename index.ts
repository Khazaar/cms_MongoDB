import * as dotenv from "dotenv";
dotenv.config();
import { Constants } from "./src/constants";
import { ConnectionHelper } from "./src/helpers/connection.helper";
import { app } from "./src/app";
import { Port } from "./src/emums";

ConnectionHelper.connectToDatabase();

const port = process.env.PORT as string; // != undefined process.env.PORT ? "2050"
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
