// Create dashbiard

import { Host, Port, HTTPRequestType } from "../emums";
import { IDashboard, IOptions } from "../entities";
import { ITaskDynamic } from "../models/taskDynamic.model";
import { ITaskStatic, taskStaticModel } from "../models/taskStatic.model";
import { getDocuments, postDocument } from "../services/request.service";

interface ITeamManager {
    takeTask(
        taskStaticName: string,
        collaboraters: string[]
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
    authToken: string,
    taskStaticName: string,
    collaborators: string[]
): Promise<void> {
    return new Promise(async (resolve, reject) => {
        //  Get TaskStatic by name

        const taskStatic = ((
            await getDocuments(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/taskStatic/readByField`,
                { fieldTitle: "name", filedValue: taskStaticName }
            )
        )[0] as unknown) as ITaskStatic;

        if (taskStatic == undefined) {
            reject("Task static nod found");
        } else {
            console.log(`Selected Task Static is:`);
            console.log(taskStatic);
            //  Create TaskDynamic
            const taskDynamic: ITaskDynamic = {
                taskStaticName: taskStatic.name,
                startTime: new Date(),
                collaborators: collaborators,
            };

            await postDocument(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/taskDynamic/create`,
                JSON.stringify(taskDynamic)
            );

            //  Update team
        }
    });
};
