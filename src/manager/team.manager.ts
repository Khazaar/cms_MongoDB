// Create dashbiard

import { Host, Port, HTTPRequestType } from "../emums";
import { IDashboard, IOptions } from "../entities";
import { ITaskDynamic } from "../models/taskDynamic.model";
import { ITaskStatic, taskStaticModel } from "../models/taskStatic.model";
import { ITeam } from "../models/team.model";
import {
    getDocumentsRequest,
    postDocumentRequest,
    updateDocumentFieldsRequest,
} from "../services/request.service";

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
            await getDocumentsRequest(
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

            await postDocumentRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/taskDynamic/create`,
                JSON.stringify(taskDynamic)
            );
            //  Get team by name
            // Assumption:
            const teamName = "Popcorns";

            let team = ((
                await getDocumentsRequest(
                    authToken,
                    `http://${Host.localhost}:${Port.expressLocalEgor}/team/readByField`,
                    { fieldTitle: "name", filedValue: teamName }
                )
            )[0] as unknown) as ITeam;
            team.listOfTasksDynamicInProgress.push(taskDynamic.taskStaticName);
            team.openedTasksNumber += 1;
            team.potentionalPoints += taskStatic.points;

            updateDocumentFieldsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/team/updateByField?field=name&value=${team.name}`,
                [
                    {
                        fieldTitle: "listOfTasksDynamic",
                        filedValue: team.listOfTasksDynamicInProgress,
                    },
                    {
                        fieldTitle: "openedTasksNumber",
                        filedValue: team.openedTasksNumber,
                    },
                    {
                        fieldTitle: "potentionalPoints",
                        filedValue: team.potentionalPoints,
                    },
                ]
            );
        }
    });
};

export const submitTask = async function (
    authToken: string,
    taskDynamicName: string
): Promise<void> {
    //  Get task dynamic from
    const taskDynamic = ((
        await getDocumentsRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/taskDynamic/readByField`,
            { fieldTitle: "name", filedValue: taskDynamicName }
        )
    )[0] as unknown) as ITaskDynamic;

    const teamName = "Popcorns";
    let team = ((
        await getDocumentsRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/team/readByField`,
            { fieldTitle: "name", filedValue: teamName }
        )
    )[0] as unknown) as ITeam;

    //  Update team
    team.listOfTasksDynamicSumbitted.push(taskDynamic.taskStaticName);
    const listOfTasksDynamicInProgressUPD = team.listOfTasksDynamicInProgress.filter(
        (tsk) => {
            tsk !== taskDynamic.taskStaticName;
        }
    );
    team.listOfTasksDynamicInProgress = listOfTasksDynamicInProgressUPD;
    team.openedTasksNumber -= 1;

    updateDocumentFieldsRequest(
        authToken,
        `http://${Host.localhost}:${Port.expressLocalEgor}/team/updateByField?field=name&value=${team.name}`,
        [
            {
                fieldTitle: "listOfTasksDynamicSumbitted",
                filedValue: team.listOfTasksDynamicSumbitted,
            },
            {
                fieldTitle: "openedTasksNumber",
                filedValue: team.openedTasksNumber,
            },
            {
                fieldTitle: "listOfTasksDynamicInProgress",
                filedValue: team.listOfTasksDynamicInProgress,
            },
        ]
    );
};
