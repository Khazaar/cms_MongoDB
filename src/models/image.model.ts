import * as mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    image: {
        data: Buffer,
        contentType: String,
    },
});

export const imageModel = mongoose.model("image", imageSchema, "image");
