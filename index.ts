import * as dotenv from "dotenv";
dotenv.config();
import { Constants } from "./src/constants";
import { ConnectionHelper } from "./src/helpers/connection.helper";
import { app } from "./src/app";
import { Port } from "./src/emums";

ConnectionHelper.connectToDatabase();

app.listen(Port.expressLocalEgor, () => {
    console.log(`App listening on port ${Port.expressLocalEgor}`);
});
