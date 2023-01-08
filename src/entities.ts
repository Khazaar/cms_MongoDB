import { AppError, Host, HTTPRequestType, Port } from "./emums";
import { ITaskDynamic } from "./models/taskDynamic.model";

export interface systemError {
    key: AppError;
    code: number;
    message: string;
}

export interface IOptions {
    host: Host;
    port: Port;
    path: string;
    method: HTTPRequestType;
    headers: {
        "Content-Type": string | number;
        "Content-Length"?: string | number;
        Authorization?: string;
    };
}

export interface IDashboard {
    userName: string;
    teamName: string;
    listOfOpenedTasks: [ITaskDynamic];
    listOfSolvedTasks: [ITaskDynamic];
    listOfSubmittedTasks: [ITaskDynamic];
}

export interface IField {
    fieldTitle: string;
    filedValue: any;
}
//filedValue: string | string[] | number | ITaskDynamic[] | Date | Buffer;
