const axios = require("axios");

/**
 * Shopify: Function to Create a pickup & delivery order
 **/
module.exports.handler = async (event) => {
    try {
        switch (event.httpMethod) {
            case "POST": // means we need to create shipment
                let data = JSON.parse(event.body); // converts to js object; needs to be properly formated & labeled
                return createShipment(data);

            case "GET": // means retreive list of shipments
                return retreiveShipments();

            case "PATCH": // update a single shipment
                if (!event.body) break;
                let myData = JSON.parse(event.body); // converts to js object; needs to be properly formated & labeled
                let easyship_shipment_id = event["queryStringParameters"]["easyship_shipment_id"];
                return updateShipment(easyship_shipment_id, myData);

            case "DELETE": // update a single shipment
                let shipmentId = event["queryStringParameters"]["easyship_shipment_id"];
                return deleteShipment(shipmentId);

            default:
                break;
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: false, message: "Something went wrong. please try again." }),
        };
    } catch (err) {
        console.log(err.message);
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: false, message: err.message }),
        };
    }
};

/**
 *
 * @param {*} data is the JSON data
 */
const createShipment = async (data) => {
    try {
        let easyShipToken = process.env.EASY_SHIP_TOKEN;
        let rateObject = {
            origin_postal_code: data.origin_postal_code,
            destination_country_alpha2: data.destination_country_alpha2,
            destination_postal_code: data.destination_postal_code,
            items: data.items,
        };

        const ratesReponse = await axios({
            url: "https://api.easyship.com/rate/v1/rates",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${easyShipToken}`,
            },
            data: JSON.stringify(rateObject),
        });

        let list = ratesReponse.data.rates;

        // checking if there are actually rates
        if (!list.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: false, message: "No rates available for the current request," }),
            };
        }

        let sortedList = list.sort((a, b) =>
            a.total_charge > b.total_charge
                ? 1
                : a.total_charge === b.total_charge
                ? a.value_for_money_rank > b.value_for_money_rank
                    ? 1
                    : -1
                : -1
        );

        let lowestRateId = sortedList[0].courier_id; // THIS IS THE LOWEST SHIPMENT RATE RETURNED
        // Now we need to create a shipment based on the current courier id
        data["selected_courier_id"] = lowestRateId.toString();
        data["platform_name"] = "Shopify";

        const createShipmentResponse = await axios({
            url: "https://api.easyship.com/shipment/v1/shipments",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${easyShipToken}`,
            },
            data: JSON.stringify(data),
        });

        return {
            statusCode: 200,
            body: JSON.stringify(createShipmentResponse.data, null, 2),
        };
    } catch (err) {
        console.log(err.message);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: false, message: err.message }),
        };
    }
};

/**
 *
 * @description retrieve list of shipments
 */
const retreiveShipments = async () => {
    try {
        let easyShipToken = process.env.EASY_SHIP_TOKEN;
        const response = await axios({
            url:
                "https://api.easyship.com/shipment/v1/shipments?easyship_shipment_id=&platform_order_number=&shipment_state=&pickup_state=&delivery_state=&label_state=&created_at_from=&created_at_to=&confirmed_at_from=&confirmed_at_to=&per_page=&page=",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${easyShipToken}`,
            },
        });
        return {
            statusCode: 200,
            body: JSON.stringify(response.data, null, 2),
        };
    } catch (err) {
        console.log(err.message);
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: false, message: err.message }),
        };
    }
};

/**
 *
 * @description update shipment
 */
const updateShipment = async (easyship_shipment_id, data) => {
    try {
        let easyShipToken = process.env.EASY_SHIP_TOKEN;
        const response = await axios({
            url: `https://api.easyship.com/shipment/v1/shipments/${easyship_shipment_id}`,
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${easyShipToken}`,
            },
            data,
        });
        return {
            statusCode: 200,
            body: JSON.stringify(response.data, null, 2),
        };
    } catch (err) {
        console.log(err.message);
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: false, message: err.message }),
        };
    }
};

/**
 *
 * @description retrieve list of shipments
 */
const deleteShipment = async (easyship_shipment_id) => {
    try {
        let easyShipToken = process.env.EASY_SHIP_TOKEN;
        const response = await axios({
            url: `https://api.easyship.com/shipment/v1/shipments/${easyship_shipment_id}`,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${easyShipToken}`,
            },
        });
        return {
            statusCode: 200,
            body: JSON.stringify(response.data, null, 2),
        };
    } catch (err) {
        console.log(err.message);
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: false, message: err.message }),
        };
    }
};
