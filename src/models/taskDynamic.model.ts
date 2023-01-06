import * as mongoose from "mongoose";
import { Category } from "../emums";
import { ITaskStatic } from "./taskStatic.model";

export interface ITaskDynamic {
    taskStaticName: string;
    startTime: Date;
    endTime?: Date;
    collaborators: string[];
    solution?: string;
}

const taskDynamicSchema = new mongoose.Schema<ITaskDynamic>({
    taskStaticName: {
        type: String,
        required: true,
        unique: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: false },
    collaborators: [String],
    solution: { type: String, required: false },
});

export const taskDynamicModel = mongoose.model<ITaskDynamic>(
    "taskDynamic",
    taskDynamicSchema,
    "taskDynamic"
);
