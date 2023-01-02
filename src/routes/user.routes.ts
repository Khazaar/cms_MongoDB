import express, { Router } from "express";
import controller from "../controllers/user.controllers";

const router: Router = express.Router();

router.get("/getUser", controller.getUserData);
export default { router };
