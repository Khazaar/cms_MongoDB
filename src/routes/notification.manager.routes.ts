import express, { Router } from "express";
import controller from "../controllers/notification.manager.controller";

const router: Router = express.Router();

router.post("/notifyTeamCreated", controller.notifyTeamCreated);

export default { router };
//[checkPermissions([TaskStaticPermission.ReadTaskStatic])],
