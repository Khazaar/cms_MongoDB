import { ITeam } from "./../models/team.model";
import { Request, Response, NextFunction } from "express";
import { NotificationManager } from "../manager/notification.manager";
import { getDocumentsRequest } from "../services/request.service";
import { Host, Port } from "../emums";
import logger from "../services/logger.service";

//  We perform existance check in controllers, business ligic - in managers. In controller We transform strings to object
const notificationManager = new NotificationManager();

const notifyTeam = async (req: Request, res: Response, next: NextFunction) => {
    let msg: string;
    const teamName = req.body.teamName as string;
    const taskName = req.body.taskName as string;
    const action = req.query.action as string;
    const authToken = (req.headers.authorization as string).slice(7);
    try {
        //  Get team
        const team = ((
            await getDocumentsRequest(
                authToken,
                `http://${Host.localhost}:${Port.expressLocalEgor}/team/readByField`,
                { fieldTitle: "name", filedValue: teamName }
            )
        )[0] as unknown) as ITeam;

        //  Get task

        switch (action) {
            case "notifyTeamCreated": {
                notificationManager.notifyTeamCreated(team);
                break;
            }
            case "notifyTaskTaken": {
                const task = team.listOfTasksDynamicInProgress.filter(
                    (tsk) => tsk.taskStatic.name == taskName
                )[0];
                await notificationManager.notifyTaskTaken(team, task);

                break;
            }

            case "notifyTaskSubmitted": {
                const task = team.listOfTasksDynamicSumbitted.filter(
                    (tsk) => tsk.taskStatic.name == taskName
                )[0];
                await notificationManager.notifyTaskSubmitted(team, task);
                break;
            }
            case "notifyTaskGraded": {
                const task = team.listOfTasksDynamicSolved.filter(
                    (tsk) => tsk.taskStatic.name == taskName
                )[0];
                await notificationManager.notifyTaskGraded(team, task);
                break;
            }
        }

        return res.status(200).json(`Notification sent`);
    } catch (error) {
        return res.status(500).send((error as Error).message);
    }
};

export default {
    notifyTeam,
};
