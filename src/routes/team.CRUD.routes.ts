import express, { Router } from "express";
import controller from "../controllers/document.controllers";
import { checkJwt } from "../middleware/authz.middleware";
import { checkPermissions } from "../middleware/permissions.middleware";
import { teamModel } from "../models/team.model";

const router: Router = express.Router();

router.post("/create", controller.createDocument(teamModel));
router.get(
    "/readAll",

    controller.readDocuments(teamModel)
);
router.get("/readByField", controller.readDocumentByFields(teamModel));
router.delete("/deleteByField", controller.deleteDocumentByFields(teamModel));
router.put("/updateByField", controller.updateDocumentByFields(teamModel));

export default { router };
//[checkPermissions([TaskStaticPermission.ReadTaskStatic])],
