import express, { Router } from "express";
import controller from "../controllers/document.controllers";
import { taskDynamic } from "../models/taskDynamic.model";

const router: Router = express.Router();

router.post("/create", controller.createDocument(taskDynamic));

export default { router };
