import * as mongoose from "mongoose";
import { Category } from "../emums";

export interface ITaskStatic {
    name: string;
    category: Category[];
    durationLimit: number;
    points: number;
    bonusTask: String;
    extraTime: number;
    extraPoints: number;
    description: string;
}

const taskStaticSchema = new mongoose.Schema<ITaskStatic>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    category: { type: Array<Category>, required: true, default: [] },
    durationLimit: { type: Number, required: true },
    points: { type: Number, required: true },
    bonusTask: { type: String, required: true },
    extraTime: { type: Number, required: true },
    extraPoints: { type: Number, required: true },
    description: { type: String, required: true },
});

export const taskStatic = mongoose.model<ITaskStatic>(
    "taskStatic",
    taskStaticSchema,
    "taskStatic"
);
