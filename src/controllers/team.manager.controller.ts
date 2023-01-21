import {
    ITakeTaskRequest,
    takeTaskmRequestShcema,
} from "./../schemas/takeTask.request";
import {
    createTeamRequestShcema,
    ICreateTeamRequest,
} from "./../schemas/createTeam.request";
import { IUserAuth } from "./../entities";
import { Request, Response, NextFunction } from "express";
import { teamManager } from "../manager/team.manager";
import { getDocumentsRequest, getIDToken } from "../services/request.service";
import { Host, Port } from "../emums";
import { ITeam } from "../models/team.model";
import { IUserDB, userModel } from "../models/user.model";
import { ITaskStatic } from "../models/taskStatic.model";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import logger from "../services/logger.service";

//  We perform existance check in controllers, business ligic - in managers. In controller We transform strings to object
const createTeam = async (req: Request, res: Response, next: NextFunction) => {
    //  Parce  request body

    const authToken = (req.headers.authorization as string).slice(7);
    const createTeamRequestBody: ICreateTeamRequest = req.body;
    const ajv = new Ajv();
    addFormats(ajv, ["email"]);
    const validateCreateTeamRequestBody = ajv.compile(createTeamRequestShcema);
    const isCreateTeamRequestBodyValid = validateCreateTeamRequestBody(
        createTeamRequestBody
    );

    if (!isCreateTeamRequestBodyValid) {
        logger.warn("First warning");
        logger.error("First error");
        logger.info("Some info");
        return res.status(400).json({
            isSuccess: false,
            message: validateCreateTeamRequestBody.errors,
        });
    }

    //console.log(IDToken["http://localhost:6666/roles"]);
    const listOfParticipants: IUserDB[] = [];

    //  Check that participants are in database
    try {
        for (const usrEmail of createTeamRequestBody.listOfParticipantsEmail) {
            const usr = ((await getDocumentsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/user/readByField`,
                { fieldTitle: "email", filedValue: usrEmail }
            )) as IUserDB[])[0];
            if (usr == undefined) {
                throw new Error("Parlicipant is absent");
            }
            listOfParticipants.push(usr);
        }
    } catch (error) {
        console.log(error);
    }

    try {
        const newTeam = await teamManager.createTeam(
            authToken,
            createTeamRequestBody.teamName,
            listOfParticipants
        );
        return res
            .status(200)
            .json(`Team ${createTeamRequestBody.teamName} has been created`);
    } catch (error) {
        return res.status(500).send((error as Error).message);
    }
};

const takeTask = async (req: Request, res: Response, next: NextFunction) => {
    //  Parce  request body
    const authToken = (req.headers.authorization as string).slice(7);
    const createTeamRequestBody: ITakeTaskRequest = req.body;
    const ajv = new Ajv();
    addFormats(ajv, ["email"]);
    const validateTakeTaskRequestBody = ajv.compile(takeTaskmRequestShcema);
    const isTakeTaskRequestBodyValid = validateTakeTaskRequestBody(
        createTeamRequestBody
    );

    if (!isTakeTaskRequestBodyValid) {
        return res.status(400).json({
            isSuccess: false,
            message: validateTakeTaskRequestBody.errors,
        });
    }
    const collaborators: IUserDB[] = [];

    //  Check that collaborators are in database
    for (const usrEmail of createTeamRequestBody.collaboratorsEmails) {
        const usr = ((await getDocumentsRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/user/readByField`,
            { fieldTitle: "email", filedValue: usrEmail }
        )) as IUserDB[])[0];
        if (usr == undefined) {
            return res.status(500).send("Collaborator does not exists");
        }
        collaborators.push(usr);
    }

    //  Get team
    const team = ((
        await getDocumentsRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/team/readByField`,
            { fieldTitle: "name", filedValue: createTeamRequestBody.teamName }
        )
    )[0] as unknown) as ITeam;

    if (team == undefined) {
        return res.status(500).send("Team does not exists");
    }
    // Get Task Static
    const taskStatic = ((
        await getDocumentsRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/taskStatic/readByField`,
            { fieldTitle: "name", filedValue: createTeamRequestBody.taskName }
        )
    )[0] as unknown) as ITaskStatic;

    if (taskStatic == undefined) {
        return res.status(500).send("Task static does not exists");
    }

    // Check that task is not already in progress

    try {
        const newTask = await teamManager.takeTask(
            authToken,
            team,
            taskStatic,
            collaborators
        );
        return res
            .status(200)
            .json(`Task ${createTeamRequestBody.taskName} has been taken`);
    } catch (error) {
        return res.status(500).send((error as Error).message);
    }
};

const submitTask = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = (req.headers.authorization as string).slice(7);
    const taskName = req.body.taskName as string;
    const solution = req.body.solution as string;
    //const teamName = req.body.teamName as string;
    const IDToken = (await getIDToken(authToken)) as IUserAuth;
    let userEmail = IDToken.email;
    if (userEmail == undefined) {
        userEmail = req.body.email as string;
    }
    const usr = ((await getDocumentsRequest(
        authToken,
        `http://${Host.localhost}:${Port.expressLocalEgor}/user/readByField`,
        { fieldTitle: "email", filedValue: userEmail }
    )) as IUserDB[])[0];
    if (usr == undefined) {
        return res.status(500).send("Collaborator is absent");
    }

    const teamName = usr.teamName;
    const team = ((
        await getDocumentsRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/team/readByField`,
            { fieldTitle: "name", filedValue: teamName }
        )
    )[0] as unknown) as ITeam;

    if (team == undefined) {
        return res.status(500).send("Team does not exists");
    }

    const taskDynamic = team.listOfTasksDynamicInProgress.filter(
        (tsk) => tsk.taskStatic.name == taskName
    )[0];

    if (taskDynamic == undefined) {
        return res.status(500).send("No requested task in progress");
    }
    try {
        const submittedTask = await teamManager.submitTask(
            authToken,
            team,
            taskDynamic,
            solution
        );
        return res.status(200).json(`Task ${taskName} has been submitted`);
    } catch (error) {
        return res.status(500).send((error as Error).message);
    }
};

const gradeTask = async (req: Request, res: Response, next: NextFunction) => {
    //  Parce request body
    const authToken = (req.headers.authorization as string).slice(7);
    const taskName = req.body.taskName as string;
    const gradePercent = req.body.gradePercent as number;
    const teamName = req.body.teamName as string;

    const team = ((
        await getDocumentsRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/team/readByField`,
            { fieldTitle: "name", filedValue: teamName }
        )
    )[0] as unknown) as ITeam;

    const taskDynamic = team.listOfTasksDynamicSumbitted.filter(
        (tsk) => tsk.taskStatic.name == taskName
    )[0];

    try {
        const gradedTask = await teamManager.gradeTask(
            authToken,
            team,
            taskDynamic,
            gradePercent
        );
        return res
            .status(200)
            .json(`Task ${taskName} has been graded at ${gradePercent}`);
    } catch (error) {
        return res.status(500).send((error as Error).message);
    }
};

const resetTasks = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = (req.headers.authorization as string).slice(7);
    try {
        await teamManager.resetTasks(authToken);
        return res.status(200).json(`Tasks has been reseted`);
    } catch (error) {
        return res.status(500).send((error as Error).message);
    }
};

export default {
    takeTask,
    submitTask,
    gradeTask,
    resetTasks,
    createTeam,
};
