import { IField } from "./../entities";
import http from "http";
import { Model } from "mongoose";
import { IOptions } from "../entities";
import fetch from "node-fetch";
import { HTTPRequestType } from "../emums";

export const getDocumentField = function (
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

export const getDocuments = async function (
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
                "Content-Type": "application/json",
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

export const updateDocumentFields = function (
    options: IOptions,
    updateData: [{ field: string; value: string }]
): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const response = await fetch(`${options.host}${options.path}`, {
            method: options.method,
            body: JSON.stringify({
                name: "John Smith",
                job: "manager",
            }),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
    });
};

export const postDocument = async function (
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
            return error.message;
        } else {
            console.log("unexpected error: ", error);
            return "An unexpected error occurred";
        }
    }
};

// export const postDocument = function (
//     options: IOptions,
//     postData: string
// ): Promise<void> {
//     return new Promise((resolve, reject) => {
//         let req = http.request(options, (res) => {
//             let output = "";
//             console.log("rest::", options.host + ":" + res.statusCode);
//             res.setEncoding("utf8");

//             res.on("data", function (chunk) {
//                 output += chunk;
//             });

//             res.on("end", () => {
//                 console.log("Body: ", JSON.parse(postData));
//             });
//         });
//         req.on("error", (err) => {
//             console.error("rest::request", err);
//             reject(err);
//         });
//         req.write(postData);
//         req.end(() => {
//             resolve();
//         });
//     });
// };
