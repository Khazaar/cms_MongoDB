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
        field: string,
        value: string
    ): Promise<Model<any>[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const docs = await model.find({ [field]: value });
                resolve(docs);
            } catch {
                reject();
            }
        });
    }

    public async deleteDocumentByFields(
        model: Model<any>,
        field: string,
        value: string
    ): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await model.deleteMany({ [field]: value });
                resolve();
            } catch {
                reject();
            }
        });
    }

    public async updateDocumentByFields(
        model: Model<any>,
        updatedFields: IField[],
        doc: Document
    ): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                for (const fld of updatedFields) {
                    await model.findOneAndUpdate(
                        { [fld.fieldTitle]: fld.filedValue },
                        doc
                    );
                }
                resolve();
            } catch {
                reject();
            }
        });
    }
}
