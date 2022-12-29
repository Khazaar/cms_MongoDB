import { AppError, HTTPRequestType } from "./emums";

export interface systemError {
    key: AppError;
    code: number;
    message: string;
}

export interface IOptions {
    host: string;
    port: number;
    path: string;
    method: HTTPRequestType;
    headers: {
        "Content-Type": string | number;
        "Content-Length"?: string | number;
    };
}
