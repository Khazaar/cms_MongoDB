import { ITeam } from "./../models/team.model";
import { Request, Response, NextFunction } from "express";
import { NotificationManager } from "../manager/notification.manager";

//  We perform existance check in controllers, business ligic - in managers. In controller We transform strings to object
//const notificationManager = new NotificationManager();

const notifyTeamCreated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const team = req.body as ITeam;
    // try {
    //     notificationManager.notifyTeamCreated(team);
    //     return res.status(200).json(``);
    // } catch (error) {
    //     return res.status(500).send((error as Error).message);
    // }
};

export default {
    notifyTeamCreated,
};
