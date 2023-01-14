import * as mongoose from "mongoose";
import { TaskCategory } from "../emums";
import { ITaskStatic, taskStaticSchema } from "./taskStatic.model";

export interface ITaskDynamic {
    taskStatic: ITaskStatic;
    startTime: Date;
    endTime?: Date;
    collaboratorEmails: string[];
    solution?: string;
    points?: number;
}

export const taskDynamicSchema = new mongoose.Schema<ITaskDynamic>({
    taskStatic: {
        type: taskStaticSchema,
        required: true,
        unique: false,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: false },
    collaboratorEmails: [String],
    solution: { type: String, required: false },
    points: { type: Number, required: false },
});

export const taskDynamicModel = mongoose.model<ITaskDynamic>(
    "taskDynamic",
    taskDynamicSchema,
    "taskDynamic"
);
