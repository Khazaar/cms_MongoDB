import { ITaskDynamic, taskDynamicSchema } from "./taskDynamic.model";
import * as mongoose from "mongoose";
import { TaskCategory } from "../emums";

export interface ITeam {
    name: string;
    icon: string;
    listOfParticipants: string[];
    listOfTasksDynamicInProgress: ITaskDynamic[];
    listOfTasksDynamicSumbitted: ITaskDynamic[];
    finishedTasksNumber: number;
    openedTasksNumber: number;
    earnedPoints: number;
    potentionalPoints: number;
}

const teamSchema = new mongoose.Schema<ITeam>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    icon: {
        data: Buffer,
        contentType: String,
        required: false,
    },
    listOfParticipants: { type: [String], required: true, sparse: true },
    listOfTasksDynamicInProgress: {
        type: [taskDynamicSchema],
        required: false,
        sparse: true,
    },
    listOfTasksDynamicSumbitted: { type: [taskDynamicSchema], required: false },
    finishedTasksNumber: { type: Number, required: false },
    openedTasksNumber: { type: Number, required: false },
    earnedPoints: { type: Number, required: false },
    potentionalPoints: { type: Number, required: false },
});

export const teamModel = mongoose.model<ITeam>("team", teamSchema, "team");
