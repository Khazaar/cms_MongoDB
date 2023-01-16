import { Model, Document } from "mongoose";
import { IField } from "../entities";

export abstract class DocumentService {
    public static async createDocument(
        model: Model<any>,
        doc: Document
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                await model.create(doc);
                resolve(doc);
            } catch (error) {
                reject(error);
            }
        });
    }

    public static async readDocuments(
        model: Model<any>
    ): Promise<Model<any>[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const docs = await model.find();
                resolve(docs);
            } catch {
                reject();
            }
        });
    }

    public static async readDocumentByFields(
        model: Model<any>,
        filterField: IField
    ): Promise<Model<any>[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const docs = await model.find({
                    [filterField.fieldTitle]: filterField.filedValue,
                });
                resolve(docs);
            } catch {
                reject();
            }
        });
    }

    public static async deleteDocumentByFields(
        model: Model<any>,
        filterField: IField
    ): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await model.deleteMany({
                    [filterField.fieldTitle]: filterField.filedValue,
                });
                resolve();
            } catch {
                reject();
            }
        });
    }

    public static async updateDocumentByFields(
        model: Model<any>,
        filterField: IField,
        updateFields: IField[]
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let doc;
                //for (const fld of updateFields) {
                // doc = await model.findOneAndUpdate(
                //     {
                //         [filterField.fieldTitle]: filterField.filedValue,
                //     },
                //     { [fld.fieldTitle]: fld.filedValue },
                //     {
                //         new: true,
                //     }
                // );
                //}
                doc = await model.findOneAndUpdate(
                    {
                        [filterField.fieldTitle]: filterField.filedValue,
                    },
                    updateFields
                );

                resolve(doc);
            } catch (error) {
                reject(error);
            }
        });
    }
}
