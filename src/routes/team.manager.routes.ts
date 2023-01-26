import express, { Router } from "express";
import controller from "../controllers/team.manager.controller";
import { checkPermissions } from "../middleware/permissions.middleware";
import { Permissions } from "../emums";

const router: Router = express.Router();
router.post("/takeTask", controller.takeTask);
router.post("/submitTask", controller.submitTask);
router.post("/gradeTask", controller.gradeTask);
router.post("/resetTasks", controller.resetTasks);
router.post("/createTeam", controller.createTeam);

export default { router };
//[checkPermissions([TaskStaticPermission.ReadTaskStatic])],
