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
        required: true,
        unique: true,
    },
    teamName: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: [String],
        required: true,
        unique: true,
    },
});

export const userModel = mongoose.model<IUserDB>("user", userSchema, "user");
