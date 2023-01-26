import { JSONSchemaType } from "ajv";

export interface ITakeTaskRequest {
    taskName: string;
    teamName: string;
    collaboratorsEmails: string[];
}

export const takeTaskRequestShcema: JSONSchemaType<ITakeTaskRequest> = {
    type: "object",
    properties: {
        teamName: {
            type: "string",
        },
        taskName: {
            type: "string",
        },
        collaboratorsEmails: {
            type: "array",
            items: { type: "string", format: "email" },
        },
    },

    required: ["teamName", "taskName", "collaboratorsEmails"],
    additionalProperties: false,
};
