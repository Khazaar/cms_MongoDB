import { IUserAuth } from "./../entities";
import { IUserDB } from "./../models/user.model";
import { Host, Port, HTTPRequestType } from "../emums";
import { IDashboard, IOptions } from "../entities";
import { ITaskDynamic } from "../models/taskDynamic.model";
import { ITaskStatic, taskStaticModel } from "../models/taskStatic.model";
import { ITeam, teamModel } from "../models/team.model";
import {
    getDocumentsRequest,
    postDocumentRequest,
    postNotificationRequest,
    updateDocumentFieldsRequest,
} from "../services/request.service";
import fs from "fs";
import multer from "multer";
import { imageModel } from "../models/image.model";
import { NotificationManager } from "./notification.manager";

//const notificationManager = new NotificationManager();
export class teamManager {
    static async createTeam(
        authToken: string,
        teamName: string,
        listOfParticipants: IUserDB[]
    ): Promise<ITeam> {
        //  Create blank team
        const team: ITeam = {
            name: teamName,
            listOfParticipantsEmail: listOfParticipants.map((p) => p.email),
            finishedTasksNumber: 0,
            openedTasksNumber: 0,
            icon: "",
            listOfTasksDynamicInProgress: [],
            listOfTasksDynamicSumbitted: [],
            listOfTasksDynamicSolved: [],
            earnedPoints: 0,
            potentionalPoints: 0,
        };

        //  Fix: Update competition.teams: push team.name

        try {
            //  Create team document
            await postDocumentRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/team/create`,
                JSON.stringify(team)
            );
            // Update .teamName field of team participants
            for (const usr of listOfParticipants) {
                await updateDocumentFieldsRequest(
                    authToken,
                    `http://${Host.localhost}:${Port.expressLocalEgor}/user/updateByField?field=email&value=${usr.email}`,
                    [{ fieldTitle: "teamName", filedValue: teamName }]
                );
            }
            await postNotificationRequest(
                authToken,
                "notifyTelegramTeam?action=notifyTeamCreated",
                { teamName: teamName }
            );
        } catch (error) {
            throw new Error(error as string);
        }

        return team;
    }

    static async takeTask(
        authToken: string,
        team: ITeam,
        taskStatic: ITaskStatic,
        collaborators: IUserDB[]
    ): Promise<ITaskDynamic> {
        const taskDynamic: ITaskDynamic = {
            taskStatic: taskStatic,
            startTime: new Date(),
            collaboratorEmails: collaborators.map((cl) => cl.email),
        };

        team.listOfTasksDynamicInProgress.push(taskDynamic);

        team.potentionalPoints += taskStatic.points;
        // repair
        const numberOfParallel = 3;
        if (team.openedTasksNumber > numberOfParallel) {
            throw new Error("You have reached maximum number of tasks");
        }
        team.openedTasksNumber += 1;
        //

        try {
            updateDocumentFieldsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/team/updateByField?field=name&value=${team.name}`,
                {
                    ["listOfTasksDynamicInProgress"]:
                        team.listOfTasksDynamicInProgress,
                    ["openedTasksNumber"]: team.openedTasksNumber,
                    ["potentionalPoints"]: team.potentionalPoints,
                }
            );
            await postNotificationRequest(
                authToken,
                "notifyTelegramTeam?action=notifyTaskTaken",
                { teamName: team.name, taskName: taskStatic.name }
            );
        } catch (error) {
            throw new Error(error as any);
        }

        return taskDynamic;
    }

    static async submitTask(
        authToken: string,
        team: ITeam,
        taskDynamic: ITaskDynamic,
        solution: string
    ): Promise<ITaskDynamic> {
        // Update team
        const listOfTasksDynamicInProgressUPD = team.listOfTasksDynamicInProgress.filter(
            (tsk) => {
                tsk.taskStatic.name !== taskDynamic.taskStatic.name;
            }
        );
        team.listOfTasksDynamicInProgress = listOfTasksDynamicInProgressUPD;
        team.openedTasksNumber -= 1;
        taskDynamic.solution = solution;
        taskDynamic.endTime = new Date();
        team.listOfTasksDynamicSumbitted.push(taskDynamic);

        try {
            updateDocumentFieldsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/team/updateByField?field=name&value=${team.name}`,
                {
                    ["listOfTasksDynamicSumbitted"]:
                        team.listOfTasksDynamicSumbitted,
                    ["openedTasksNumber"]: team.openedTasksNumber,
                    ["listOfTasksDynamicInProgress"]:
                        team.listOfTasksDynamicInProgress,
                }
            );
            await postNotificationRequest(
                authToken,
                "notifyTelegramTeam?action=notifyTaskSubmitted",
                { teamName: team.name, taskName: taskDynamic.taskStatic.name }
            );
        } catch (error) {
            throw new Error(error as any);
        }
        return taskDynamic;
    }

    static async gradeTask(
        authToken: string,
        team: ITeam,
        taskDynamic: ITaskDynamic,
        gradePercent: number
    ): Promise<ITaskDynamic> {
        const listOfTasksDynamicSumbittedUPD = team.listOfTasksDynamicSumbitted.filter(
            (tsk) => {
                tsk.taskStatic.name !== taskDynamic.taskStatic.name;
            }
        );
        taskDynamic.points =
            taskDynamic.taskStatic.points * (gradePercent / 100);
        team.listOfTasksDynamicSumbitted = listOfTasksDynamicSumbittedUPD;
        //team.openedTasksNumber -= 1;
        team.earnedPoints += taskDynamic.points;
        team.listOfTasksDynamicSolved.push(taskDynamic);

        try {
            updateDocumentFieldsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/team/updateByField?field=name&value=${team.name}`,
                {
                    ["listOfTasksDynamicSumbitted"]:
                        team.listOfTasksDynamicSumbitted,
                    ["listOfTasksDynamicSolved"]: team.listOfTasksDynamicSolved,
                    ["openedTasksNumber"]: team.openedTasksNumber,
                    ["earnedPoints"]: team.earnedPoints,
                }
            );
            await postNotificationRequest(
                authToken,
                "notifyTelegramTeam?action=notifyTaskGraded",
                { teamName: team.name, taskName: taskDynamic.taskStatic.name }
            );
        } catch (error) {
            throw new Error(error as any);
        }
        return taskDynamic;
    }

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
