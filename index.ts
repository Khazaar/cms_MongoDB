import * as dotenv from "dotenv";
dotenv.config();
import { Constants } from "./src/constants";
import { ConnectionHelper } from "./src/helpers/connection.helper";
import { app } from "./src/app";

ConnectionHelper.connectToDatabase();
const port = 6666;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
