import http from "http";
import { IOptions } from "../entities";
import queryString from "query-string";

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

export const putDocument = function (
    options: IOptions,
    postData: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        let req = http.request(options, (res) => {
            let output = "";
            console.log("rest::", options.host + ":" + res.statusCode);
            res.setEncoding("utf8");

            res.on("data", function (chunk) {
                output += chunk;
            });

            res.on("end", () => {
                console.log("Body: ", JSON.parse(postData));
            });
        });
        req.on("error", (err) => {
            console.error("rest::request", err);
            reject(err);
        });
        req.write(postData);
        req.end(() => {
            resolve();
        });
    });
};
