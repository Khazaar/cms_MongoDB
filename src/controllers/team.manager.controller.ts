import { Role } from "./../emums";
import {
    ITakeTaskRequest,
    takeTaskRequestShcema,
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
import {
    ISubmitTaskRequest,
    submitTaskRequestShcema,
} from "../schemas/submitTask.request";
import {
    IGradeTaskRequest,
    gradeTaskRequestShcema,
} from "../schemas/gradeTask.request";
import jwt_decode from "jwt-decode";

//  We perform existance check in controllers, business ligic - in managers. In controller We transform strings to object
const createTeam = async (req: Request, res: Response, next: NextFunction) => {
    let msg;

    logger.defaultMeta = { context: "team.manager.controller_createTeam" };
    //  Parce  request body
    const authToken = (req.headers.authorization as string).slice(7);
    const createTeamRequestBody: ICreateTeamRequest = req.body;
    const ajv = new Ajv();
    addFormats(ajv, ["email"]);
    const validateCreateTeamRequestBody = ajv.compile(createTeamRequestShcema);
    const isCreateTeamRequestBodyValid = validateCreateTeamRequestBody(
        createTeamRequestBody
    );

    const decodedAuthToken = jwt_decode(authToken);
    const roles = (decodedAuthToken as any)[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] as string[];
    if (!roles.includes(Role.CompetitionAdministrator)) {
        msg = "Competition administrator role required";
        logger.error(msg);
        return res.status(500).json({
            isSuccess: false,
            message: msg,
        });
    }

    if (!isCreateTeamRequestBodyValid) {
        msg = `Validation failed: ${validateCreateTeamRequestBody.errors?.map(
            (e) => e.message
        )}`;
        logger.error(msg);
        return res.status(500).json({
            isSuccess: false,
            message: msg,
        });
    }

    //console.log(IDToken["http://localhost:6666/roles"]);
    const listOfParticipants: IUserDB[] = [];

    try {
        //  Check that participants are in database
        for (const usrEmail of createTeamRequestBody.listOfParticipantsEmail) {
            const usr = ((await getDocumentsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/user/readByField`,
                { fieldTitle: "email", filedValue: usrEmail }
            )) as IUserDB[])[0];
            if (usr == undefined) {
                msg = "Participant is absent";
                logger.error(msg);
                return res.status(500).json({
                    isSuccess: false,
                    message: msg,
                });
            }
            listOfParticipants.push(usr);
        }

        const newTeam = await teamManager.createTeam(
            authToken,
            createTeamRequestBody.teamName,
            listOfParticipants
        );
        msg = `Team ${createTeamRequestBody.teamName} has been created`;
        logger.info(msg);
        return res.status(200).json(msg);
    } catch (error) {
        logger.error(error);
        return res.status(500).send((error as Error).message);
    }
};

const takeTask = async (req: Request, res: Response, next: NextFunction) => {
    let msg;
    logger.defaultMeta = { context: "team.manager.controller_takeTask" };
    //  Parce  request body
    const authToken = (req.headers.authorization as string).slice(7);
    const decodedAuthToken = jwt_decode(authToken);
    const roles = (decodedAuthToken as any)[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] as string[];
    if (!roles.includes(Role.Participant)) {
        msg = "Participant role required";
        logger.error(msg);
        return res.status(500).json({
            isSuccess: false,
            message: msg,
        });
    }
    const takeTaskRequestBody: ITakeTaskRequest = req.body;
    const ajv = new Ajv();
    addFormats(ajv, ["email"]);
    const validateTakeTaskRequestBody = ajv.compile(takeTaskRequestShcema);
    const isTakeTaskRequestBodyValid = validateTakeTaskRequestBody(
        takeTaskRequestBody
    );

    if (!isTakeTaskRequestBodyValid) {
        msg = `Validation failed: ${validateTakeTaskRequestBody.errors?.map(
            (e) => e.message
        )}`;
        logger.error(msg);
        return res.status(400).json({
            isSuccess: false,
            message: msg,
        });
    }
    const collaborators: IUserDB[] = [];

    //  Check that collaborators are in database
    try {
        for (const usrEmail of takeTaskRequestBody.collaboratorsEmails) {
            const usr = ((await getDocumentsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/user/readByField`,
                { fieldTitle: "email", filedValue: usrEmail }
            )) as IUserDB[])[0];
            if (usr == undefined) {
                msg = "Collaborator does not exists";
                logger.error(msg);
                return res.status(500).send(msg);
            }
            collaborators.push(usr);
        }

        //  Get team
        const team = ((
            await getDocumentsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/team/readByField`,
                {
                    fieldTitle: "name",
                    filedValue: takeTaskRequestBody.teamName,
                }
            )
        )[0] as unknown) as ITeam;

        if (team == undefined) {
            msg = "Team does not exists";
            logger.error(msg);
            return res.status(500).send(msg);
        }

        // Get Task Static
        const taskStatic = ((
            await getDocumentsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/taskStatic/readByField`,
                {
                    fieldTitle: "name",
                    filedValue: takeTaskRequestBody.taskName,
                }
            )
        )[0] as unknown) as ITaskStatic;

        if (taskStatic == undefined) {
            msg = "Task static does not exists";
            logger.error(msg);
            return res.status(500).send(msg);
        }

        // Check that task is not already in progress
        const newTask = await teamManager.takeTask(
            authToken,
            team,
            taskStatic,
            collaborators
        );
        msg = `Task ${takeTaskRequestBody.taskName} has been taken`;
        logger.info(msg);
        return res.status(200).json(msg);
    } catch (error) {
        logger.error((error as Error).message);
        return res.status(500).send((error as Error).message);
    }
};

const submitTask = async (req: Request, res: Response, next: NextFunction) => {
    let msg;
    logger.defaultMeta = { context: "team.manager.controller_submitTask" };

    const submitTaskRequestBody: ISubmitTaskRequest = req.body;
    const ajv = new Ajv();
    addFormats(ajv, ["email"]);
    const validateSubmitTaskRequestBody = ajv.compile(submitTaskRequestShcema);
    const isTakeTaskRequestBodyValid = validateSubmitTaskRequestBody(
        submitTaskRequestBody
    );

    if (!isTakeTaskRequestBodyValid) {
        msg = `Validation failed: ${validateSubmitTaskRequestBody.errors?.map(
            (e) => e.message
        )}`;
        logger.error(msg);
        return res.status(400).json({
            isSuccess: false,
            message: msg,
        });
    }

    const authToken = (req.headers.authorization as string).slice(7);
    const decodedAuthToken = jwt_decode(authToken);
    const roles = (decodedAuthToken as any)[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] as string[];
    if (!roles.includes(Role.Participant)) {
        msg = "Participant role required";
        logger.error(msg);
        return res.status(500).json({
            isSuccess: false,
            message: msg,
        });
    }
    //const teamName = req.body.teamName as string;
    const IDToken = (await getIDToken(authToken)) as IUserAuth;
    let userEmail = IDToken.email;
    if (userEmail == undefined) {
        userEmail = req.body.email as string;
    }
    try {
        const usr = ((await getDocumentsRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/user/readByField`,
            { fieldTitle: "email", filedValue: userEmail }
        )) as IUserDB[])[0];
        if (usr == undefined) {
            msg = "Collaborator is absent";
            logger.error(msg);
            return res.status(500).send(msg);
        }

        if (usr.teamName != submitTaskRequestBody.teamName) {
            msg = "You are not a team member";
            logger.error(msg);
            return res.status(500).send(msg);
        }

        const team = ((
            await getDocumentsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/team/readByField`,
                {
                    fieldTitle: "name",
                    filedValue: submitTaskRequestBody.teamName,
                }
            )
        )[0] as unknown) as ITeam;

        if (team == undefined) {
            msg = "Team does not exists";
            logger.error(msg);
            return res.status(500).send(msg);
        }

        const taskDynamic = team.listOfTasksDynamicInProgress.filter(
            (tsk) => tsk.taskStatic.name == submitTaskRequestBody.taskName
        )[0];

        if (taskDynamic == undefined) {
            msg = "No requested task in progress";
            logger.error(msg);
            return res.status(500).send(msg);
        }

        const submittedTask = await teamManager.submitTask(
            authToken,
            team,
            taskDynamic,
            submitTaskRequestBody.solution
        );
        msg = `Task ${submitTaskRequestBody.taskName} has been submitted`;
        logger.info(msg);
        return res.status(200).json(msg);
    } catch (error) {
        return res.status(500).send((error as Error).message);
    }
};

const gradeTask = async (req: Request, res: Response, next: NextFunction) => {
    let msg;
    logger.defaultMeta = { context: "team.manager.controller_gradeTask" };
    //  Parce request body
    const gradeTaskRequestBody: IGradeTaskRequest = req.body;
    const ajv = new Ajv();
    addFormats(ajv, ["email"]);
    const validateGradeTaskRequestBody = ajv.compile(gradeTaskRequestShcema);
    const isGradeTaskRequestBodyValid = validateGradeTaskRequestBody(
        gradeTaskRequestBody
    );

    if (!isGradeTaskRequestBodyValid) {
        msg = `Validation failed: ${validateGradeTaskRequestBody.errors?.map(
            (e) => e.message
        )}`;
        logger.error(msg);
        return res.status(400).json({
            isSuccess: false,
            message: msg,
        });
    }

    const authToken = (req.headers.authorization as string).slice(7);
    const decodedAuthToken = jwt_decode(authToken);
    const roles = (decodedAuthToken as any)[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] as string[];
    if (!roles.includes(Role.CompetitionAdministrator)) {
        msg = "Competition administrator role required";
        logger.error(msg);
        return res.status(500).json({
            isSuccess: false,
            message: msg,
        });
    }
    try {
        const team = ((
            await getDocumentsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/team/readByField`,
                {
                    fieldTitle: "name",
                    filedValue: gradeTaskRequestBody.teamName,
                }
            )
        )[0] as unknown) as ITeam;

        if (team == undefined) {
            msg = "Team does not exists";
            logger.error(msg);
            return res.status(500).send(msg);
        }

        const taskDynamic = team.listOfTasksDynamicSumbitted.filter(
            (tsk) => tsk.taskStatic.name == gradeTaskRequestBody.taskName
        )[0];

        if (taskDynamic == undefined) {
            msg = "Task does not exists";
            logger.error(msg);
            return res.status(500).send(msg);
        }

        const gradedTask = await teamManager.gradeTask(
            authToken,
            team,
            taskDynamic,
            gradeTaskRequestBody.gradePercent
        );
        msg = `Task ${gradeTaskRequestBody.taskName} has been graded at ${gradeTaskRequestBody.gradePercent}%`;
        logger.info(msg);
        return res.status(200).json(msg);
    } catch (error) {
        logger.error((error as Error).message);
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
