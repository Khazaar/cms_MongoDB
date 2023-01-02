import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import { ITaskStatic } from "../models/taskStatic.model";
import { DocumentService } from "../services/document.service";

const documentService: DocumentService = new DocumentService();

const getUserData = async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.oidc?.user?.sub;
    if (userData != undefined) {
        console.log(`Logged user ${userData}`);
        res.status(200).json(userData);
    } else {
        return res.status(500).json("Usre undefined");
    }
};

export default {
    getUserData,
};
