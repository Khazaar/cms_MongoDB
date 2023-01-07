// Create dashbiard

import { reject } from "underscore";
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
                taskStatic: taskStatic,
                startTime: new Date(),
                collaborators: collaborators,
            };

            const teamName = "Popcorns2";

            let team = ((
                await getDocumentsRequest(
                    authToken,
                    `http://${Host.localhost}:${Port.expressLocalEgor}/team/readByField`,
                    { fieldTitle: "name", filedValue: teamName }
                )
            )[0] as unknown) as ITeam;
            team.listOfTasksDynamicInProgress.push(taskDynamic);
            team.openedTasksNumber += 1;
            team.potentionalPoints += taskStatic.points;

            updateDocumentFieldsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/team/updateByField?field=name&value=${team.name}`,
                [
                    {
                        fieldTitle: "listOfTasksDynamicInProgress",
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

export const submitTask = async function (authToken: string, taskName: string) {
    // Get team
    const teamName = "Popcorns2";
    let team = ((
        await getDocumentsRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/team/readByField`,
            { fieldTitle: "name", filedValue: teamName }
        )
    )[0] as unknown) as ITeam;

    //  Get terget Task Dynamic
    const targetTaskDynamic = team.listOfTasksDynamicInProgress.find(
        (tsk) => tsk.taskStatic.name == taskName
    );

    if (targetTaskDynamic == undefined) {
        console.log("WARNING! No such task");
        return;
    } else {
        team.listOfTasksDynamicSumbitted.push(targetTaskDynamic);
        // Remove task dynamic from istOfTasksDynamicInProgress
        const listOfTasksDynamicInProgressUPD = team.listOfTasksDynamicInProgress.filter(
            (tsk) => {
                tsk.taskStatic.name !== taskName;
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
    }
};

export const gradeTask = async function (
    authToken: string,
    taskName: string,
    gradePercent: number
) {
    // Get team
    const teamName = "Popcorns2";
    let team = ((
        await getDocumentsRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/team/readByField`,
            { fieldTitle: "name", filedValue: teamName }
        )
    )[0] as unknown) as ITeam;

    //  Get target Task Dynamic from submitted
    const targetTaskDynamic = team.listOfTasksDynamicSumbitted.find(
        (tsk) => tsk.taskStatic.name == taskName
    );

    if (targetTaskDynamic == undefined) {
        console.log("WARNING!! No such task");
        return;
    } else {
        //team.listOfTasksDynamicSumbitted.push(targetTaskDynamic);
        const listOfTasksDynamicSumbittedUPD = team.listOfTasksDynamicSumbitted.filter(
            (tsk) => {
                tsk.taskStatic.name !== taskName;
            }
        );
        team.listOfTasksDynamicSumbitted = listOfTasksDynamicSumbittedUPD;
        team.openedTasksNumber -= 1;
        team.earnedPoints +=
            targetTaskDynamic.taskStatic.points * (gradePercent / 100);

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
                    fieldTitle: "earnedPoints",
                    filedValue: team.earnedPoints,
                },
            ]
        );
    }
};
