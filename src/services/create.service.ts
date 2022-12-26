import { Schema, model, connect } from "mongoose";
import { ITaskStatic, taskStatic } from "../models/task.model";
import { sampleTaskStatic } from "../sample-data";

export class CreateService {
    public async createTask(task: ITaskStatic) {
        await taskStatic.create(task);
    }
}
