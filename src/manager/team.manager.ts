import { Host, Port, HTTPRequestType } from "../emums";
import { IDashboard, IOptions } from "../entities";
import { ITaskDynamic } from "../models/taskDynamic.model";
import { ITaskStatic, taskStaticModel } from "../models/taskStatic.model";
import { ITeam, teamModel } from "../models/team.model";
import {
    getDocumentsRequest,
    postDocumentRequest,
    updateDocumentFieldsRequest,
} from "../services/request.service";
import fs from "fs";
import multer from "multer";
import { DocumentService } from "../services/document.service";
import { imageModel } from "../models/image.model";

export abstract class teamManager {
    static createTeam = async function (
        authToken: string,
        teamName: string,
        listOfParticipantsEmail: string[]
    ) {
        for (const usrEmail of listOfParticipantsEmail) {
            const usr = await getDocumentsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/user/readByField`,
                { fieldTitle: "email", filedValue: usrEmail }
            );
            if (usr == undefined) {
                throw new Error("Parlicipant is absent");
            }
        }

        const team: ITeam = {
            name: teamName,
            listOfParticipants: listOfParticipantsEmail,
            finishedTasksNumber: 0,
            openedTasksNumber: 0,
            icon: "",
            listOfTasksDynamicInProgress: [],
            listOfTasksDynamicSumbitted: [],
            earnedPoints: 0,
            potentionalPoints: 0,
        };
        //  Update competition.teams: push team.name

        await postDocumentRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/team/create`,
            JSON.stringify(team)
        );
        for (const usrEmail of listOfParticipantsEmail) {
            await updateDocumentFieldsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/user/updateByField?field=email&value=${usrEmail}`,
                [{ fieldTitle: "teamName", filedValue: teamName }]
            );
        }
    };
    static takeTask = async function (
        authToken: string,
        taskStaticName: string,
        collaborators: string[]
    ) {
        //  Get TaskStatic by name

        const taskStatic = ((
            await getDocumentsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/taskStatic/readByField`,
                { fieldTitle: "name", filedValue: taskStaticName }
            )
        )[0] as unknown) as ITaskStatic;

        if (taskStatic == undefined) {
            throw new Error("Task static nod found");
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
            // repair
            const numberOfParallel = 3;
            if (team.openedTasksNumber > numberOfParallel) {
                throw new Error("You have reached maximum number of tasks");
            }

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
    };

    static submitTask = async function (
        authToken: string,
        taskName: string,
        solution: string
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

        //  Get terget Task Dynamic
        const targetTaskDynamic = team.listOfTasksDynamicInProgress.find(
            (tsk) => tsk.taskStatic.name == taskName
        );

        if (targetTaskDynamic == undefined) {
            throw new Error("WARNING! No such task");
        }

        team.listOfTasksDynamicSumbitted.push(targetTaskDynamic);
        // Remove task dynamic from istOfTasksDynamicInProgress
        const listOfTasksDynamicInProgressUPD = team.listOfTasksDynamicInProgress.filter(
            (tsk) => {
                tsk.taskStatic.name !== taskName;
            }
        );
        team.listOfTasksDynamicInProgress = listOfTasksDynamicInProgressUPD;
        team.openedTasksNumber -= 1;
        targetTaskDynamic.solution = solution;
        targetTaskDynamic.endTime = new Date();

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
                {
                    fieldTitle: "solution",
                    filedValue: solution,
                },
                {
                    fieldTitle: "targetTaskDynamic.endTime",
                    filedValue: targetTaskDynamic.endTime,
                },
            ]
        );
    };

    static gradeTask = async function (
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
            //team.openedTasksNumber -= 1;
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
    static resetTasks = async function (authToken: string) {
        // Get team
        const teamName = "Popcorns2";
        let team = ((
            await getDocumentsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/team/readByField`,
                { fieldTitle: "name", filedValue: teamName }
            )
        )[0] as unknown) as ITeam;

        updateDocumentFieldsRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/team/updateByField?field=name&value=${team.name}`,
            [
                {
                    fieldTitle: "listOfTasksDynamicInProgress",
                    filedValue: [],
                },
                {
                    fieldTitle: "listOfTasksDynamicSumbitted",
                    filedValue: [],
                },
                {
                    fieldTitle: "finishedTasksNumber",
                    filedValue: 0,
                },
                {
                    fieldTitle: "openedTasksNumber",
                    filedValue: 0,
                },
                {
                    fieldTitle: "earnedPoints",
                    filedValue: 0,
                },
                {
                    fieldTitle: "potentionalPoints",
                    filedValue: 0,
                },
            ]
        );
    };
    static setTeamIcon = async function (authToken: string) {
        const multerStorage = multer.memoryStorage();
        const upload = multer({ storage: multerStorage });
        //upload.single().
        const path = "data/images/logo2.jpg";
        var imageFile = await fs.readFileSync(path);

        const image = { data: imageFile, contentType: "image/jpg" };
        const imageDoc = new imageModel(image);
        //const savedImage = await imageModel.create(image);
        try {
            imageDoc.save();
        } catch (e) {
            console.log(e);
        }
        //await imageModel.create(image);
    };
}
