import { Schema, model, connect } from "mongoose";
import { Constants } from "../constants";
import logger from "../services/logger.service";

export class ConnectionHelper {
    public static async connectToDatabase() {
        try {
            await connect(Constants.cmsDBConnectionString);
        } catch (error) {
            logger.error(error);
        }
    }
}
