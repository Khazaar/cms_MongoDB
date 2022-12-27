import express, { Router } from "express";
import controller from "../controllers/document.controllers";
import { taskDynamic } from "../models/taskDynamic.model";

const router: Router = express.Router();

router.post("/create", controller.createDocument(taskDynamic));
router.get("/readAll", controller.readDocuments(taskDynamic));
router.get("/readByField", controller.readDocumentByFields(taskDynamic));
router.delete("/deleteByField", controller.deleteDocumentByFields(taskDynamic));
router.put("/updateByField", controller.updateDocumentByFields(taskDynamic));

export default { router };
