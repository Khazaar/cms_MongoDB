import express, { Router } from "express";
import controller from "../controllers/notification.manager.controller";

const router: Router = express.Router();

router.post("/notifyTeam", controller.notifyTeam);
//router.post("/notifyTwitter", controller.notifyTweet);

export default { router };
//[checkPermissions([TaskStaticPermission.ReadTaskStatic])],
