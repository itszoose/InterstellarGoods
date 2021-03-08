# ReadME
 Here is a summary of what to expect from the code above in details. let me know if you've got any questions.




## Shopify API
**POST** | ex: ```https://n5871i3icd.execute-api.ap-southeast-1.amazonaws.com/prod/getSaveOrders```

Above triggers the functions:  **shopify.js/handler**: It's a function to get and save to Backendless all the order from the Shopify starting from the last order in the Backendless table `Shop_Orders`

PLease note: On first launch and if there are a lot of orders, too much for the function to fetch and save them all under 29 second, the function will respond with a message stating that the request timed out, this limit is put in place by API gateway, and there is no way to change it, however, the actual lambda function will continue on the background to fetch orders from Shopify and try to save them all not within 29-seconds limit but within 15 minutes, so plenty of time, but just note that during that first launch you may get that message. but afterwards, you will receive back the orders that have been fetched from Shopify and saved to the DB, hope that makes sense.

**The request body should be formated like this**
```
{
    "shopifyApiToken": "The Shopify Api Token here",
    "shopifyApiKey": "The Shopify Api Key here",
    "shopifyShopName": "The shopname or also known as the .myshopify without / at the end and without wwww. ex: myshop.myshopify.com"
}
```


#
## EasyShip API
**ANY*** | ex: ```https://n5871i3icd.execute-api.ap-southeast-1.amazonaws.com/prod/easyShip```

Above triggers the functions:  **easyShip.js/handler**: 

Depending on the request method, this end point's job differs, here is a table explaining how: 


| Method   | description   | return |
| ---------|:--------------------------:| -----:|
| POST     | create a single shipment | the newly created shipment  |
| GET     | retrieves a list of shipments | list of shipments  |
| PATCH     | update a single shipment | the updated shipment  |
| DELETE     | deletes a shipment | a message confirming the delete  |


Above gives an idea on what to expect, but each Method has its own requirements, below explains just that.


- **POST**: the post method expect a JSON formatted like below
```
{
    "origin_postal_code": "WC2N",
    "destination_country_alpha2": "US",
    "destination_postal_code": "10030",
    "destination_city": "New York",
    "destination_state": "NY",
    "destination_name": "Aloha Chen",
    "destination_address_line_1": "300 Park Avenue",
    "destination_address_line_2": null,
    "destination_phone_number": "+1 234-567-890",
    "destination_email_address": "api-support@easyship.com",
    "platform_order_number": "#1234",
    "items": [
        {
            "description": "Silk dress",
            "sku": "test",
            "actual_weight": 1.2,
            "height": 10,
            "width": 15,
            "length": 20,
            "category": "fashion",
            "declared_currency": "SGD",
            "declared_customs_value": 100
        }
    ]
}

```
#
- **POST**: the post method expects a JSON formatted like below
```
{
    "origin_postal_code": "WC2N",
    "destination_country_alpha2": "US",
    "destination_postal_code": "10030",
    "destination_city": "New York",
    "destination_state": "NY",
    "destination_name": "Aloha Chen",
    "destination_address_line_1": "300 Park Avenue",
    "destination_address_line_2": null,
    "destination_phone_number": "+1 234-567-890",
    "destination_email_address": "api-support@easyship.com",
    "platform_order_number": "#1234",
    "items": [
        {
            "description": "Silk dress",
            "sku": "test",
            "actual_weight": 1.2,
            "height": 10,
            "width": 15,
            "length": 20,
            "category": "fashion",
            "declared_currency": "SGD",
            "declared_customs_value": 100
        }
    ]
}
```

the `Items` is an array that can hold a single object or multiple objects.

# 
- **GET**: the GET method doesn't expect anything, it's very humble lol :D 
```
Nothing
```


# 
- **PATCH**: the PATCH method expects a query string `easyship_shipment_id` of the shipment that needs to be updated to be passed with the request URL

EX:`https://ylg7xj2ro7.execute-api.eu-west-1.amazonaws.com/dev/easyShip?easyship_shipment_id=ESAU37202171` 

Notice the `?` followed by `easyship_shipment_id=ESAU37202171`  which is the shipment id to be updated.



# 
- **DELETE**: Same requirements as PATCH, but instead of updating it actually removes the shipment as you'd expect.


## Backendless API

**POST** | ex: ```https://n5871i3icd.execute-api.ap-southeast-1.amazonaws.com/prod/backendlessCruds```

Above triggers the functions:  **backendlessCruds.js/handler**
As its name suggests, it’s a crud Listner, you pass in the Backendless crud operation you want to perform, and it returns the results of the execution. 

**The request body should be formated like this**
```
{
    "operations": [
        {
            "operationType": "CREATE",
            "table": "SKU_itemEntries",
            "opResultId": "create",
            "payload": {
                "NonXero_orderIdentifier": null,
                "Comments": null,
                "Channel": "RETAILER C",
                "InboundDocument": null,
                "COPY_LatestCurLocation": "WAREHOUSE C",
                "ownerId": null,
                "ACTIVE_IS_STATUS": true,
                "COPY_conditional_latestTrackingURL": null,
                "Conditional_XeroInvoiceComputerID": null,
                "COPY_LOCALSKU_NOTUSED": null,
                "COPY_conditional_latestTrackingNumber": null,
                "Qty": 1,
                "COPY_MasterSKU": "MSKU_TransactionTest",
                "updated": null,
                "Conditional_XeroInvoiceHumanID": null,
                "Conditional_returnOrder": null,
                "COPY_LatestStatus": "USABLE"
            }
        },
        {
            "operationType": "CREATE_BULK",
            "table": "SKU_itemEntries_statuses",
            "opResultId": "createStat",
            "payload": [
                {
                    "Status": "PHYSICAL RETAIL SENT",
                    "Conditional_shippingAddress": null,
                    "Conditional_shippingName": null,
                    "LINK_SKU_itemEntries": null,
                    "COPY_conditional_TrackingURL": null,
                    "COPY_conditional_TrackingNumber": null,
                    "Comments": "Bulk Create Test",
                    "created": 1607185175000,
                    "COPY2_localSKU_NOTUSED": null,
                    "ownerId": null,
                    "COPY2_masterSKU": "",
                    "ACTIVE_IS_STATUS": true,
                    "Conditional_shippingPostal": null,
                    "SendingLocType_Warehouse_Store_Event_Others": null,
                    "COPY_Channel": "",
                    "CurrentLocation": "RETAILER C",
                    "Conditional_shippingMobile": null
                }
            ]
        }

    ]
}
```

#


**POST** | ex: ```https://2ul90gphga.execute-api.ap-southeast-1.amazonaws.com/prod/backendlessSearch```

Above triggers the functions:  **backendlessSearch.js/handler**. Pass a where clause search query in a post body request to fetch the Backendless and return the result. 


**The request body should be formated like this**
```
{
    "Where_clause": "Your Where clause query"
}
```
#
## MessageBird API

**POST** | ex: ```https://2ul90gphga.execute-api.ap-southeast-1.amazonaws.com/prod/messageBird```

Above triggers the functions:  **messageBird.js/handler**

**The request body should be formated like this**
```
{
    "body": {
        "contact": {
            "attributes": {},
            "createdDatetime": "2021-01-24T16:33:27Z",
            "customDetails": {},
            "displayName": "1137010048",
            "firstName": "Interstellar Goods",
            "href": "https://contacts.messagebird.com/v2/contacts/9ba04fd223294e5db36a16281f92757a",
            "id": "9ba04fd223294e5db36a16281f92757a",
            "lastName": "",
            "updatedDatetime": "2021-01-24T16:33:28Z"
        },
        "conversation": {
            "contactId": "9ba04fd223294e5db36a16281f92757a",
            "createdDatetime": "2021-01-24T16:33:27Z",
            "id": "5e5c12066371455ab7818e2f4090311c",
            "lastReceivedDatetime": "2021-01-25T14:23:26.928184953Z",
            "status": "active",
            "updatedDatetime": "2021-01-25T14:23:22.859637341Z"
        },
        "message": {
            "channelId": "e1acaa74de74438f873598c61e9dd1ff",
            "content": {
                "text": "Now!"
            },
            "conversationId": "5e5c12066371455ab7818e2f4090311c",
            "createdDatetime": "2021-01-25T14:23:26.683585671Z",
            "direction": "received",
            "from": "1137010048",
            "id": "4a42e8834ff342dd8714abd0551d270b",
            "origin": "inbound",
            "platform": "telegram",
            "status": "received",
            "to": "Isg_cs_bot",
            "type": "text",
            "updatedDatetime": "2021-01-25T14:23:26.937329595Z"
        },
        "type": "message.created"
    }
}
```
