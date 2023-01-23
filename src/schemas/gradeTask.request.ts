import { JSONSchemaType } from "ajv";

export interface IGradeTaskRequest {
    teamName: string;
    taskName: string;
    gradePercent: number;
}

export const gradeTaskRequestShcema: JSONSchemaType<IGradeTaskRequest> = {
    type: "object",
    properties: {
        teamName: {
            type: "string",
        },
        taskName: {
            type: "string",
        },
        gradePercent: {
            type: "number",
            minimum: 0,
            maximum: 100,
        },
    },

    required: ["teamName", "taskName", "gradePercent"],
    additionalProperties: false,
};
