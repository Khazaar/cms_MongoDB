import express, { Router } from "express";
import controller from "../controllers/document.controllers";
import { ItemPermission } from "../emums";
import { checkPermissions } from "../middleware/permissions.middleware";
import { taskStaticModel } from "../models/taskStatic.model";

const router: Router = express.Router();

router.post("/create", controller.createDocument(taskStaticModel));
router.get("/readAll", controller.readDocuments(taskStaticModel));
router.get("/readByField", controller.readDocumentByFields(taskStaticModel));
router.delete(
    "/deleteByField",
    controller.deleteDocumentByFields(taskStaticModel)
);
router.put(
    "/updateByField",
    controller.updateDocumentByFields(taskStaticModel)
);

export default { router };
