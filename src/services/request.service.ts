import { IField } from "./../entities";
import http from "http";
import { IOptions } from "../entities";
import fetch from "node-fetch";
import { Host, HTTPRequestType, Port } from "../emums";

export const getDocumentFieldRequest = function (
    field: string,
    options: IOptions
): Promise<string> {
    return new Promise((resolve, reject) => {
        let req = http.request(options, (res) => {
            let output = "";
            console.log("rest::", options.host + ":" + res.statusCode);
            res.setEncoding("utf8");

            res.on("data", function (chunk) {
                output += chunk;
            });

            res.on("end", () => {
                try {
                    let document = JSON.parse(output);
                    console.log("document: ", document);
                    const value = (document[0] as any)[`${field}`];
                    resolve(value);
                } catch (err) {
                    console.error("rest::end", err);
                    reject(err);
                }
            });
        });

        req.on("error", (err) => {
            console.error("rest::request", err);
            reject(err);
        });

        req.end();
    });
};

export const getDocumentsRequest = async function (
    authToken: string,
    GETPath: string,
    targetFields: IField
) {
    let reqPath = encodeURI(
        `${GETPath}?field=${targetFields.fieldTitle}&value=${targetFields.filedValue}`
    );

    try {
        const response = await fetch(reqPath, {
            method: HTTPRequestType.GET,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        } else {
            return response.json();
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("error message: ", error.message);
            return error.message;
        } else {
            console.log("unexpected error: ", error);
            return "An unexpected error occurred";
        }
    }
};

export const updateDocumentFieldsRequest = async function (
    authToken: string,
    PUTPath: string,
    updatedDocument: any
) {
    let reqPath = encodeURI(`${PUTPath}`);
    try {
        const response = await fetch(reqPath, {
            method: "PUT",
            body: JSON.stringify(updatedDocument),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();

        console.log("result is: ", JSON.stringify(result, null, 4));

        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.log("error message: ", error.message);
            return error.message;
        } else {
            console.log("unexpected error: ", error);
            return "An unexpected error occurred";
        }
    }
};

export const postDocumentRequest = async function (
    authToken: string,
    POSTPath: string,
    document: string
) {
    const reqPath = encodeURI(`${POSTPath}`);
    try {
        //  const response: Response
        const response = await fetch(reqPath, {
            method: "POST",
            body: document,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("result is: ", JSON.stringify(result, null, 4));
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.log("error message: ", error.message);
            throw new Error(error.message);
        } else {
            console.log("unexpected error: ", error);
            throw new Error("An unexpected error occurred");
        }
    }
};

export const getIDToken = async function (authToken: string) {
    const reqPath = encodeURI(`http://${process.env.AUTH0_DOMAIN}/userinfo`);
    try {
        //  const response: Response
        const response = await fetch(reqPath, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("result is: ", JSON.stringify(result, null, 4));
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.log("error message: ", error.message);
            return error.message;
        } else {
            console.log("unexpected error: ", error);
            return "An unexpected error occurred";
        }
    }
};

export const postNotificationRequest = async function (
    authToken: string,
    path: string,
    body: any
) {
    const reqPath = encodeURI(
        `http://${Host.localhost}:${Port.expressLocalEgor}/notificationManager/${path}`
    );
    try {
        const response = await fetch(reqPath, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("result is: ", JSON.stringify(result, null, 4));
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.log("error message: ", error.message);
            throw new Error(error.message);
        } else {
            console.log("unexpected error: ", error);
            throw new Error("An unexpected error occurred");
        }
    }
};

export const checkUserInTeam = async function (authToken: string) {};
