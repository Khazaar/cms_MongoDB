import { Schema, model, connect } from "mongoose";
import { Constants } from "../constants";

export class ConnectionHelper {
    public static async connectToDatabase() {
        await connect(Constants.cmsDBConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
}
