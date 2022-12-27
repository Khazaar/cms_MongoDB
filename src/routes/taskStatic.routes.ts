import express, { Router } from "express";
import controller from "../controllers/document.controllers";
import { taskStatic } from "../models/taskStatic.model";

const router: Router = express.Router();

router.post("/create", controller.createDocument(taskStatic));
router.get("/readAll", controller.readDocuments(taskStatic));
router.get("/readByField", controller.readDocumentByFields(taskStatic));
router.delete("/deleteByField", controller.deleteDocumentByFields(taskStatic));
router.put("/updateByField", controller.updateDocumentByFields(taskStatic));

export default { router };
