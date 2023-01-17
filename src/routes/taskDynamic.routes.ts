import express, { Router } from "express";
import controller from "../controllers/document.controllers";
import { taskDynamicModel } from "../models/taskDynamic.model";

const router: Router = express.Router();

router.post("/create", controller.createDocument(taskDynamicModel));
router.get("/readAll", controller.readDocuments(taskDynamicModel));
router.get("/readByField", controller.readDocumentByFields(taskDynamicModel));
router.delete(
    "/deleteByField",
    controller.deleteDocumentByFields(taskDynamicModel)
);
router.put(
    "/updateByField",
    controller.updateEntireDocumentByFields(taskDynamicModel)
);

export default { router };
