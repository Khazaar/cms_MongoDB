import * as mongoose from "mongoose";
import { TaskCategory } from "../emums";

export interface ITaskStatic {
    name: string;
    category: TaskCategory[];
    durationLimit: number;
    points: number;
    bonusTask: String;
    extraTime: number;
    extraPoints: number;
    description: string;
}

export const taskStaticSchema = new mongoose.Schema<ITaskStatic>({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    category: [String],
    durationLimit: { type: Number, required: true },
    points: { type: Number, required: true },
    bonusTask: { type: String, required: true },
    extraTime: { type: Number, required: true },
    extraPoints: { type: Number, required: true },
    description: { type: String, required: true },
});

export const taskStaticModel = mongoose.model<ITaskStatic>(
    "taskStatic",
    taskStaticSchema,
    "taskStatic"
);
