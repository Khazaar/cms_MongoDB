import { AppError, Host, HTTPRequestType, Port } from "./emums";

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
