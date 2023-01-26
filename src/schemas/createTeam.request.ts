import { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";

export interface ICreateTeamRequest {
    teamName: string;
    listOfParticipantsEmail: string[];
}

export const createTeamRequestShcema: JSONSchemaType<ICreateTeamRequest> = {
    type: "object",
    properties: {
        teamName: {
            type: "string",
        },
        listOfParticipantsEmail: {
            type: "array",
            items: { type: "string", format: "email" },
        },
    },

    required: ["teamName", "listOfParticipantsEmail"],
    additionalProperties: false,
};
