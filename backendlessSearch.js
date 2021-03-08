"use strict";
const axios = require("axios");
const util = require("util");

/**
 * @param {*} event expect an object with a where clause string,
 * ex {Where_clause: "Channel LIKE '%Consignment%' OR Channel='ISG'&loadRelations=LINK_User"}
 */
module.exports.handler = async (event) => {
    try {
        let data = JSON.parse(event.body);
        let whereClause = data.Where_clause;

        const appId = process.env.APP_ID;
        const restApiKey = process.env.REST_API_KEY;
        let url = `https://api.backendless.com/${appId}/${restApiKey}/data/SKU_itemEntries?where=${whereClause}`;

        let resp = await axios.get(url);

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

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
