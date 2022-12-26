import { connect } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
import { Constants } from "./src/constants";
import { ConnectionHelper } from "./src/helpers/connection.helper";
import { CreateService } from "./src/services/create.service";
import { sampleTaskStatic } from "./src/sample-data";

ConnectionHelper.connectToDatabase();
const createService: CreateService = new CreateService();
createService.createTask(sampleTaskStatic[1]);
