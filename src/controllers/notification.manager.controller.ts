import { ITaskDynamic } from "./../models/taskDynamic.model";
import { ITeam } from "./../models/team.model";
import { Request, Response, NextFunction } from "express";
import { NotificationManager } from "../manager/notification.manager";
import { getDocumentsRequest } from "../services/request.service";
import { Host, Port } from "../emums";

//  We perform existance check in controllers, business ligic - in managers. In controller We transform strings to object
const notificationManager = new NotificationManager();

const notifyTelegramTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const teamName = req.body.teamName as string;
    const taskName = req.body.task as ITaskDynamic;
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

        switch (action) {
            case "notifyTeamCreated": {
                notificationManager.notifyTeamCreated(team);
                break;
            }
            // case "notifyTaskSubmitted": {
            //     notificationManager.notifyTaskSubmitted(team, task);
            //     break;
            // }
        }

        return res.status(200).json(`Notification sent`);
    } catch (error) {
        return res.status(500).send((error as Error).message);
    }
};

export default {
    notifyTelegramTeam,
};
