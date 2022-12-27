import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import { ITaskStatic } from "../models/taskStatic.model";
import { DocumentService } from "../services/document.service";

const documentService: DocumentService = new DocumentService();

const createDocument =
    (model: Model<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        console.log(`Creatind new document for ${model.name}`);
        const body = req.body;
        documentService
            .createDocument(model, body)
            .then((result: ITaskStatic) => {
                return res.status(200).json(result);
            })
            .catch((error) => {
                //return ResponseHelper.handleError(res, error);
            });
    };

export default {
    createDocument,
};
