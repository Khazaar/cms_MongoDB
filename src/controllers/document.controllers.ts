import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import { IField } from "../entities";
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
    const filterField: IField = {
        fieldTitle: req.query.field as string,
        filedValue: req.query.value as string,
    };

    console.log(
        `Reading all documents from ${model.name} with ${filterField.fieldTitle} equal to ${filterField.filedValue}`
    );
    documentService
        .readDocumentByFields(model, filterField)
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
    const filterField: IField = {
        fieldTitle: req.query.field as string,
        filedValue: req.query.value as string,
    };
    console.log(
        `Deleting all documents from ${model.name} with ${filterField.fieldTitle} equal to ${filterField.filedValue}`
    );
    documentService
        .deleteDocumentByFields(model, filterField)
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
    const updateFields = req.body as IField[];
    const filterField: IField = {
        fieldTitle: req.query.field as string,
        filedValue: req.query.value as string,
    };
    console.log(
        `Updating all documents from ${model.name} with ${filterField.fieldTitle} equal to ${filterField.filedValue}`
    );
    documentService
        .updateDocumentByFields(model, filterField, updateFields)
        .then((doc) => {
            return res.status(200).json(doc);
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
