"use strict";
const axios = require("axios");
const util = require("util");

/**
 * Messagebird – the relevant table is Messagebird_Storage.
 * I'll like to store the entire object in column RawObject.
 * I'll also like to extract individual keys out and store them
 * in the MessageText, MessageDirection, ContactNumber columns
 **/
module.exports.handler = async (event) => {
    try {
        let data = JSON.parse(event.body);
        data = data.body; // remove this line if there is an error;

        let message = data.message;
        let { to, channelId, direction, updatedDatetime } = message;
        let { text } = message.content;

        let requestBody = {
            isolationLevelEnum: "READ_COMMITTED",
            operations: [
                {
                    operationType: "CREATE",
                    table: "Messagebird_Storage",
                    opResultId: "OPRESULT-ID",
                    payload: {
                        Channel_ID: channelId,
                        RawObject: data,
                        ContactNumber: to,
                        MessageDirection: direction,
                        MessageText: text,
                        Timestamp: updatedDatetime,
                    },
                },
            ],
        };

        const appId = process.env.APP_ID;
        const restApiKey = process.env.REST_API_KEY;
        let url = `https://api.backendless.com/${appId}/${restApiKey}/transaction/unit-of-work`;

        const resp = await axios.post(url, requestBody);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resp.data),
        };
    } catch (err) {
        let theError = "Error: " + err;

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(theError),
        };
    }
    /// updated this
};
