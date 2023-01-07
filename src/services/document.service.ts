import { Model, Document } from "mongoose";
import { IField } from "../entities";

export class DocumentService {
    public async createDocument(
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

    public async readDocuments(model: Model<any>): Promise<Model<any>[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const docs = await model.find();
                resolve(docs);
            } catch {
                reject();
            }
        });
    }

    public async readDocumentByFields(
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

    public async deleteDocumentByFields(
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

    public async updateDocumentByFields(
        model: Model<any>,
        filterField: IField,
        updateFields: IField[]
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let doc;
                for (const fld of updateFields) {
                    doc = await model.findOneAndUpdate(
                        {
                            [filterField.fieldTitle]: filterField.filedValue,
                        },
                        { [fld.fieldTitle]: fld.filedValue },
                        {
                            new: true,
                        }
                    );
                }

                resolve(doc);
            } catch {
                reject();
            }
        });
    }
}
