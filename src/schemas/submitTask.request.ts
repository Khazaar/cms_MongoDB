import { JSONSchemaType } from "ajv";

export interface ISubmitTaskRequest {
    teamName: string;
    taskName: string;
    solution: string;
}

export const submitTaskRequestShcema: JSONSchemaType<ISubmitTaskRequest> = {
    type: "object",
    properties: {
        teamName: {
            type: "string",
        },
        taskName: {
            type: "string",
        },
        solution: {
            type: "string",
        },
    },

    required: ["teamName", "taskName", "solution"],
    additionalProperties: false,
};
