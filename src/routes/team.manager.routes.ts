import express, { Router } from "express";
import controller from "../controllers/team.manager.controller";
import { checkJwt } from "../middleware/authz.middleware";
import { checkPermissions } from "../middleware/permissions.middleware";
import { teamModel } from "../models/team.model";

const router: Router = express.Router();

router.post("/takeTask", controller.takeTask);
router.post("/submitTask", controller.submitTask);
router.post("/gradeTask", controller.gradeTask);
router.post("/resetTasks", controller.resetTasks);

export default { router };
//[checkPermissions([TaskStaticPermission.ReadTaskStatic])],
