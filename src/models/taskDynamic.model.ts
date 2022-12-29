import * as mongoose from "mongoose";
import { Category } from "../emums";
import { ITaskStatic } from "./taskStatic.model";

export interface ITaskDynamic {
    taskStaticName: string;
    startTime: number;
    endTime: number;
    participantsList: string[];
}

const taskDynamicSchema = new mongoose.Schema<ITaskDynamic>({
    taskStaticName: {
        type: String,
        required: true,
        unique: true,
    },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    participantsList: { type: Array<String>, required: true },
});

export const taskDynamicModel = mongoose.model<ITaskDynamic>(
    "taskDynamic",
    taskDynamicSchema,
    "taskDynamic"
);
