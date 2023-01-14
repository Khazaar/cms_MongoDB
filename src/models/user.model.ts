import { ITaskDynamic, taskDynamicSchema } from "./taskDynamic.model";
import * as mongoose from "mongoose";
import { TaskCategory } from "../emums";

export interface IUserDB {
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string[];
    teamName?: string;
}

const userSchema = new mongoose.Schema<IUserDB>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
        required: false,
        unique: false,
    },
    teamName: {
        type: String,
        required: false,
        unique: false,
    },
    role: {
        type: [String],
        required: false,
        unique: false,
    },
});

export const userModel = mongoose.model<IUserDB>("user", userSchema, "user");
