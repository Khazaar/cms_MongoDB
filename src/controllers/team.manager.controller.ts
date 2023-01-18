import { IUserAuth } from "./../entities";
import { Request, Response, NextFunction } from "express";
import { teamManager } from "../manager/team.manager";
import { getDocumentsRequest, getIDToken } from "../services/request.service";
import { Host, Port } from "../emums";
import { ITeam } from "../models/team.model";
import { IUserDB, userModel } from "../models/user.model";
import { DocumentService } from "../services/document.service";
import { ITaskStatic } from "../models/taskStatic.model";

//  We perform existance check in controllers, business ligic - in managers. In controller We transform strings to object
const createTeam = async (req: Request, res: Response, next: NextFunction) => {
    //  Parce  request body
    const authToken = (req.headers.authorization as string).slice(7);
    const teamName = req.body.teamName as string;
    const listOfParticipantsEmail = req.body
        .listOfParticipantsEmail as string[];

    const IDToken = (await getIDToken(authToken)) as IUserAuth;
    //console.log(IDToken["http://localhost:6666/roles"]);
    const listOfParticipants: IUserDB[] = [];

    //  Check that participants are in database
    for (const usrEmail of listOfParticipantsEmail) {
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

    try {
        const newTeam = await teamManager.createTeam(
            authToken,
            teamName,
            listOfParticipants
        );
        return res.status(200).json(`Team ${teamName} has been created`);
    } catch (error) {
        return res.status(500).send((error as Error).message);
    }
};

const takeTask = async (req: Request, res: Response, next: NextFunction) => {
    //  Parce  request body
    const authToken = (req.headers.authorization as string).slice(7);
    const taskName = req.body.taskName as string;
    const teamName = req.body.teamName as string;
    const collaboratorsEmails = req.body.collaboratorsEmails as string[];
    //const decoded = jwt_decode(token);
    const IDToken = (await getIDToken(authToken)) as IUserAuth;
    const collaborators: IUserDB[] = [];

    //  Check that collaborators are in database
    for (const usrEmail of collaboratorsEmails) {
        const usr = ((await getDocumentsRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/user/readByField`,
            { fieldTitle: "email", filedValue: usrEmail }
        )) as IUserDB[])[0];
        if (usr == undefined) {
            throw new Error("Collaborator is absent");
        }
        collaborators.push(usr);
    }

    //  Get team
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
    // Get Task Static
    const taskStatic = ((
        await getDocumentsRequest(
            authToken,
            `http://${Host.localhost}:${Port.expressLocalEgor}/taskStatic/readByField`,
            { fieldTitle: "name", filedValue: taskName }
        )
    )[0] as unknown) as ITaskStatic;

    if (taskStatic == undefined) {
        throw new Error("Task static nod found");
    }

    // Check that task is not already in progress

    try {
        const newTask = await teamManager.takeTask(
            authToken,
            team,
            taskStatic,
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
    //const teamName = req.body.teamName as string;
    const IDToken = (await getIDToken(authToken)) as IUserAuth;
    let userEmail = IDToken.email;
    if (userEmail!) {
        userEmail = req.body.email as string; //  ИЗМЕНЕНИЯ
    }
    const usr = ((await getDocumentsRequest(
        authToken,
        `http://${Host.localhost}:${Port.expressLocalEgor}/user/readByField`,
        { fieldTitle: "email", filedValue: userEmail }
    )) as IUserDB[])[0];
    if (usr == undefined) {
        throw new Error("Collaborator is absent");
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
