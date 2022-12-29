import queryString from "query-string";
import { Constants } from "../constants";
import { ITaskDynamic, taskDynamicModel } from "../models/taskDynamic.model";
import { DocumentService } from "../services/document.service";
import { IOptions } from "../entities";
import { HTTPRequestType } from "../emums";
import { getDocumentField, putDocument } from "../services/request.service";

export const createTaskDynamic = async function (
    taskDynamic: ITaskDynamic
): Promise<void> {
    return new Promise(async (resolve, reject) => {
        // Check if it is corresponding Task Static
        let path = encodeURI(
            `/taskStatic/readByField?field=name&value=${taskDynamic.taskStaticName}`
        );
        const taskStaticRequestOptions: IOptions = {
            host: "localhost",
            port: Constants.port,
            path: path,
            method: HTTPRequestType.GET,
            headers: {
                "Content-Type": "application/json",
            },
        };
        const taskStaticName = await getDocumentField(
            "name",
            taskStaticRequestOptions
        );

        if (taskStaticName == undefined) {
            reject("Task static nod found");
        } else {
            console.log(`Task static name is ${taskStaticName}`);
            const taskStaticRequestPostData = JSON.stringify(taskDynamic);
            path = encodeURI(`/taskDynamic/create`);
            const taskStaticRequestOptions: IOptions = {
                host: "localhost",
                port: Constants.port,
                path: path,
                method: HTTPRequestType.POST,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(
                        taskStaticRequestPostData
                    ),
                },
            };
            await putDocument(
                taskStaticRequestOptions,
                taskStaticRequestPostData
            );
        }
        // Run Task Dynamic CRUD with obtained Task Static name
    });
};
