import { IUserAuth } from "./../entities";
import { Request, Response, NextFunction } from "express";
import { teamManager } from "../manager/team.manager";
import { getDocumentsRequest, getIDToken } from "../services/request.service";
import { Host, Port } from "../emums";
import { ITeam } from "../models/team.model";
import { IUserDB, userModel } from "../models/user.model";
import { DocumentService } from "../services/document.service";

const createTeam = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = (req.headers.authorization as string).slice(7);
    const teamName = req.body.teamName as string;
    const listOfParticipantsEmail = req.body
        .listOfParticipantsEmail as string[];
    const IDToken = (await getIDToken(authToken)) as IUserAuth;
    console.log(IDToken["http://localhost:6666/roles"]);

    try {
        await teamManager.createTeam(
            authToken,
            teamName,
            listOfParticipantsEmail
        );
        return res.status(200).json(`Team ${teamName} has been created`);
    } catch (error) {
        return res.status(500).send((error as Error).message);
    }
};

const takeTask = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = (req.headers.authorization as string).slice(7);
    const taskName = req.body.taskName as string;
    const teamName = req.body.teamName as string;
    const collaborators = req.body.collaborators as string[];
    //const decoded = jwt_decode(token);
    const IDToken = (await getIDToken(authToken)) as IUserAuth;
    const userEmail = IDToken.email;
    const userDB = ((await DocumentService.readDocumentByFields(userModel, {
        fieldTitle: "email",
        filedValue: userEmail,
    })) as unknown) as IUserDB;

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
    if (!team.listOfParticipants.includes(userEmail)) {
        return res.status(500).send("User is not a team member");
    }

    try {
        await teamManager.takeTask(
            authToken,
            teamName,
            taskName,
            collaborators
        );
        return res.status(200).json(`Task ${taskName} has been taken`);
    } catch (error) {
        return res.status(500).send((error as Error).message);
    }
};

const submitTask = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = (req.headers.authorization as string).slice(7);
    const taskName = req.body.taskName as string;
    const solution = req.body.solution as string;
    const teamName = req.body.teamName as string;
    const IDToken = (await getIDToken(authToken)) as IUserAuth;
    const userEmail = IDToken.email;

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
    if (!team.listOfParticipants.includes(userEmail)) {
        return res.status(500).send("User is not a team member");
    }

    try {
        await teamManager.submitTask(authToken, taskName, solution);
        return res.status(200).json(`Task ${taskName} has been submitted`);
    } catch (error) {
        return res.status(500).send((error as Error).message);
    }
};

const gradeTask = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = (req.headers.authorization as string).slice(7);
    const taskName = req.body.taskName as string;
    const gradePercent = req.body.gradePercent as number;
    try {
        await teamManager.gradeTask(authToken, taskName, gradePercent);
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
