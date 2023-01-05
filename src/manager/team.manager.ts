// Create dashbiard

import { IDashboard } from "../entities";
import { ITaskDynamic } from "../models/taskDynamic.model";
import { ITaskStatic } from "../models/taskStatic.model";

interface ITeamManager {
    takeTask(
        taskStatic: ITaskStatic,
        collaboraters: [string]
    ): Promise<ITaskDynamic>; // For team participant
    //check Number of parallel tasks
    // update time
    // update potentional points
    // update participantsList

    createDashboard(): Promise<IDashboard>; // Team member
    submitTask(taskDynamic: ITaskDynamic): Promise<void>; // Team member
    // update time
    // decrease openedTasksNumber

    checkTask(taskDynamic: ITaskDynamic): Promise<void>; //CA
}

export const takeTask = async function (
    taskStatic: ITaskStatic
): Promise<void> {
    return new Promise(async (resolve, reject) => {
        // // Check if it is corresponding Task Static
        // let path = encodeURI(`/taskStatic/readAll`);
        // const taskStaticsRequestOptions: IOptions = {
        //     host: Host.localhost,
        //     port: Port.expressLocalEgor,
        //     path: path,
        //     method: HTTPRequestType.GET,
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${authToken}`,
        //     },
        // };
        // const taskStatics = await getDocuments(
        //     taskStaticModel,
        //     taskStaticsRequestOptions
        // );
        // if (taskStatics == undefined) {
        //     reject("Task static nod found");
        // } else {
        //     console.log(taskStatics);
        // }
    });
};
