"use strict";
const axios = require("axios");
const util = require("util");

/**
 * @description Listen for cruds operation, perform them on backendless and return the result
 * this is the backendless part
 */
module.exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body); // get the operations array,

        const appId = process.env.APP_ID;
        const restApiKey = process.env.REST_API_KEY;
        const url = `https://api.backendless.com/${appId}/${restApiKey}/transaction/unit-of-work`;

        const resp = await axios.post(url, data);
        console.log(resp.data);

        return {
            statusCode: 200,
            body: JSON.stringify(resp.data, null, 2),
        };
    } catch (err) {
        // Handle Error Here
        console.error(err);
        return {
            statusCode: 400,
            body: JSON.stringify(err, null, 2),
        };
    }

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
