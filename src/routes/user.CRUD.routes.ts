import express, { Router } from "express";
import controller from "../controllers/document.controllers";
import { userModel } from "../models/user.model";

const router: Router = express.Router();

router.post("/create", controller.createDocument(userModel));
router.get(
    "/readAll",

    controller.readDocuments(userModel)
);
router.get("/readByField", controller.readDocumentByFields(userModel));
router.delete("/deleteByField", controller.deleteDocumentByFields(userModel));
router.put("/updateByField", controller.updateDocumentByFields(userModel));

export default { router };
//[checkPermissions([TaskStaticPermission.ReadTaskStatic])],
