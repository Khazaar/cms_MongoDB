import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import { DocumentService } from "../services/document.service";

const documentService: DocumentService = new DocumentService();

const createDocument = (model: Model<any>) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(`Creating new document for ${model.name}`);
    const body = req.body;
    documentService
        .createDocument(model, body)
        .then((result: any) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(500).json(error);
        });
};

const readDocuments = (model: Model<any>) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(`Reading all documents from ${model.name}`);
    const body = req.body;
    documentService
        .readDocuments(model)
        .then((result: any[]) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(400).json(error);
        });
};

const readDocumentByFields = (model: Model<any>) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const field = req.query.field as string;
    const value = req.query.value as string;
    console.log(
        `Reading all documents from ${model.name} with ${field} equal to ${value}`
    );
    documentService
        .readDocumentByFields(model, field, value)
        .then((result: any[]) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(400).json(error);
        });
};

const deleteDocumentByFields = (model: Model<any>) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const field = req.query.field as string;
    const value = req.query.value as string;
    console.log(
        `Deleting all documents from ${model.name} with ${field} equal to ${value}`
    );
    documentService
        .deleteDocumentByFields(model, field, value)
        .then(() => {
            return res.status(200).json();
        })
        .catch((error) => {
            return res.status(400).json(error);
        });
};

const updateDocumentByFields = (model: Model<any>) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const body = req.body;
    const field = req.query.field as string;
    const value = req.query.value as string;
    console.log(
        `Updating all documents from ${model.name} with ${field} equal to ${value}`
    );
    documentService
        .updateDocumentByFields(model, field, value, body)
        .then(() => {
            return res.status(200).json();
        })
        .catch((error) => {
            return res.status(400).json(error);
        });
};

export default {
    createDocument,
    readDocuments,
    readDocumentByFields,
    deleteDocumentByFields,
    updateDocumentByFields,
};
