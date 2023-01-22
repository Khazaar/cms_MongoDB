import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import { IField } from "../entities";
import { DocumentService } from "../services/document.service";
import logger from "../services/logger.service";

const createDocument = (model: Model<any>) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(`Creating new document for ${model.modelName}`);
    //console.log(`Creating new document for ${model.modelName}`);
    const body = req.body;
    if (body._id != undefined) {
        delete body._id;
    }
    DocumentService.createDocument(model, body)
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
    console.log(`Reading all documents from ${model.modelName}`);
    const body = req.body;
    DocumentService.readDocuments(model)
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
        `Reading all documents from ${model.modelName} with ${filterField.fieldTitle} equal to ${filterField.filedValue}`
    );
    DocumentService.readDocumentByFields(model, filterField)
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
        `Deleting all documents from ${model.modelName} with ${filterField.fieldTitle} equal to ${filterField.filedValue}`
    );
    DocumentService.deleteDocumentByFields(model, filterField)
        .then(() => {
            return res.status(200).json();
        })
        .catch((error) => {
            return res.status(400).json(error);
        });
};

const updateDocumentFieldsByFields = (model: Model<any>) => async (
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
        `Updating all documents from ${model.modelName} with ${filterField.fieldTitle} equal to ${filterField.filedValue}`
    );
    DocumentService.updateDocumentFieldsByFields(
        model,
        filterField,
        updateFields
    )
        .then((doc) => {
            return res.status(200).json(doc);
        })
        .catch((error) => {
            return res.status(400).json(error);
        });
};

const updateEntireDocumentByFields = (model: Model<any>) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const updatedDocument = req.body;
    const filterField: IField = {
        fieldTitle: req.query.field as string,
        filedValue: req.query.value as string,
    };
    console.log(
        `Updating all documents from ${model.modelName} with ${filterField.fieldTitle} equal to ${filterField.filedValue}`
    );
    DocumentService.updateEntireDocumentByFields(
        model,
        filterField,
        updatedDocument
    )
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
    updateDocumentFieldsByFields,
    updateEntireDocumentByFields,
};
