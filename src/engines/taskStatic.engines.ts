import { ITaskDynamic, taskDynamicModel } from "../models/taskDynamic.model";
import { IOptions } from "../entities";
import { Host, HTTPRequestType, Port } from "../emums";
import {
    getDocumentField,
    getDocuments,
    postDocument,
} from "../services/request.service";
import { ITaskStatic, taskStaticModel } from "../models/taskStatic.model";

export const getTaskStatics = async function (
    authToken: string
): Promise<void> {
    return new Promise(async (resolve, reject) => {
        // Check if it is corresponding Task Static
        let path = encodeURI(`/taskStatic/readAll`);
        const taskStaticsRequestOptions: IOptions = {
            host: Host.localhost,
            port: Port.expressLocalEgor,
            path: path,
            method: HTTPRequestType.GET,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        };
        const taskStatics = await getDocuments(
            taskStaticModel,
            taskStaticsRequestOptions
        );

        if (taskStatics == undefined) {
            reject("Task static nod found");
        } else {
            console.log(taskStatics);
        }
    });
};
