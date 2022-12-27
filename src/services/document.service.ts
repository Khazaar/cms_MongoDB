import { Model, Document } from "mongoose";

export class DocumentService {
    // public async createTask(task: ITaskStatic): Promise<ITaskStatic> {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             await taskStatic.create(task);
    //             resolve(task);
    //         } catch {
    //             reject();
    //         }
    //     });
    // }

    public async createDocument(
        model: Model<any>,
        doc: Document
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                await model.create(doc);
                resolve(doc);
            } catch {
                reject();
            }
        });
    }
}
