import { Schema, model, connect } from "mongoose";
import { Constants } from "../constants";

export class ConnectionHelper {
    public static async connectToDatabase() {
        try {
            await connect(Constants.cmsDBConnectionString);
        } catch (error) {
            console.log(error);
        }
    }
}
