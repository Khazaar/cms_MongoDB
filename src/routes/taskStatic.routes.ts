import express, { Router } from "express";
import controller from "../controllers/document.controllers";
import { taskStatic } from "../models/taskStatic.model";

const router: Router = express.Router();

router.post("/create", controller.createDocument(taskStatic));

export default { router };
