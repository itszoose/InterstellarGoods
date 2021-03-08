const axios = require("axios");
const util = require("util");

let allOrders = []; // a global orders object

/**
 * Shopify: function to get and save to backendless all the order from the shopify starting from the last order in backendless
 **/
module.exports.handler = async (event) => {
    try {
        let data = JSON.parse(event.body);

        let shopifyApiToken = data.shopifyApiToken; // the token
        let shopifyApiKey = data.shopifyApiKey; // the api key
        let shopifyShopName = data.shopifyShopName; // the .myshopify shopname without https ex: mystore.myshopify.com

        return getOrders(shopifyApiKey, shopifyApiToken, shopifyShopName);
    } catch (err) {
        console.log(err.message);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: false, message: err.message }),
        };
    }
    /// updated this
};

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getOrders(shopifyApiKey, shopifyApiToken, shopifyShopName) {
    try {
        const graphql = `https://${shopifyShopName}/admin/api/2021-01/graphql.json`;

        let after;
        let query;
        let appId = process.env.APP_ID;
        let restApiKey = process.env.REST_API_KEY;

        const getNameResponse = await axios({
            url: `https://api.backendless.com/${appId}/${restApiKey}/data/Shop_Orders?sortBy=name desc`,
            method: "get",
            headers: { "Content-Type": "application/json" },
        });

        if (getNameResponse.data.length > 0) {
            after = getNameResponse.data[0].cursor;
            console.log(
                "Backendless has some orders and doens't seem empty!, last order recorded is ",
                getNameResponse.data[0].name
            );
        } else console.log("Backendless doesn't have any orders yet!");

        after
            ? (query = `query {
                    orders(first: 10, after: "${after}") {
                      pageInfo {
                        hasNextPage
                        hasPreviousPage
                      }
                  
                      edges {
                        cursor
                        node {
                          id
                          legacyResourceId
                          billingAddress {
                            formatted(withName: true, withCompany: true)
                          }
                          confirmed
                          closed
                          cancelReason
                          cancelledAt
                          closedAt
                          createdAt
                          processedAt
                          updatedAt
                          currencyCode
                          currentSubtotalLineItemsQuantity
                          name
                          note
                          paymentGatewayNames
                          phone
                          email
                  
                          customer {
                            id
                            averageOrderAmountV2 {
                              amount
                            }
                            defaultAddress {
                              id
                              formatted(withName: true, withCompany: true)
                            }
                            email
                            displayName
                            ordersCount
                            phone
                            totalSpentV2 {
                              amount
                            }
                          }
                          discountCode
                          displayAddress {
                            formatted(withName: true, withCompany: true)
                          }
                  
                          lineItems(first: 10) {
                            edges {
                              node {
                                id
                                name
                                quantity
                                discountedTotalSet {
                                  shopMoney {
                                    amount
                                  }
                                }
                                fulfillmentStatus
                                fulfillmentService {
                                  id
                                }
                                originalTotalSet {
                                  shopMoney {
                                    amount
                                  }
                                }
                                originalUnitPriceSet {
                                  shopMoney {
                                    amount
                                  }
                                }
                                refundableQuantity
                                sku
                              }
                            }
                          }
                          shippingAddress {
                            id
                            formatted(withName: true, withCompany: true)
                          }
                          shippingLine {
                            title
                            carrierIdentifier
                            code
                            deliveryCategory
                            id
                          }
                          netPaymentSet {
                            shopMoney {
                              amount
                            }
                          }
                  
                          currentTaxLines {
                            rate
                            ratePercentage
                          }
                          currentTotalDutiesSet {
                            shopMoney {
                              amount
                            }
                          }
                          currentTotalDiscountsSet {
                            shopMoney {
                              amount
                            }
                          }
                          currentSubtotalPriceSet {
                            shopMoney {
                              amount
                            }
                          }
                          currentCartDiscountAmountSet {
                            shopMoney {
                              amount
                            }
                          }
                          cartDiscountAmountSet {
                            shopMoney {
                              amount
                            }
                          }
                  
                          transactions(first: 20) {
                            id
                            accountNumber
                            amountSet {
                              shopMoney {
                                amount
                              }
                            }
                  
                            gateway
                            fees {
                              id
                              rate
                              rateName
                              type
                              amount {
                                amount
                              }
                              taxAmount {
                                amount
                              }
                              flatFee {
                                amount
                              }
                            }
                          }
                        }
                      }
                    }
                        }`) // In pagination mode
            : (query = `query {
                orders(first: 10) {
                  pageInfo {
                    hasNextPage
                    hasPreviousPage
                  }
              
                  edges {
                    cursor
                    node {
                      id
                      legacyResourceId
                      billingAddress {
                        formatted(withName: true, withCompany: true)
                      }
                      confirmed
                      closed
                      cancelReason
                      cancelledAt
                      closedAt
                      createdAt
                      processedAt
                      updatedAt
                      currencyCode
                      currentSubtotalLineItemsQuantity
                      name
                      note
                      paymentGatewayNames
                      phone
                      email
              
                      customer {
                        id
                        averageOrderAmountV2 {
                          amount
                        }
                        defaultAddress {
                          id
                          formatted(withName: true, withCompany: true)
                        }
                        email
                        displayName
                        ordersCount
                        phone
                        totalSpentV2 {
                          amount
                        }
                      }
                      discountCode
                      displayAddress {
                        formatted(withName: true, withCompany: true)
                      }
              
                      lineItems(first: 10) {
                        edges {
                          node {
                            id
                            name
                            quantity
                            discountedTotalSet {
                              shopMoney {
                                amount
                              }
                            }
                            fulfillmentStatus
                            fulfillmentService {
                              id
                            }
                            originalTotalSet {
                              shopMoney {
                                amount
                              }
                            }
                            originalUnitPriceSet {
                              shopMoney {
                                amount
                              }
                            }
                            refundableQuantity
                            sku
                          }
                        }
                      }
                      shippingAddress {
                        id
                        formatted(withName: true, withCompany: true)
                      }
                      shippingLine {
                        title
                        carrierIdentifier
                        code
                        deliveryCategory
                        id
                      }
                      netPaymentSet {
                        shopMoney {
                          amount
                        }
                      }
              
                      currentTaxLines {
                        rate
                        ratePercentage
                      }
                      currentTotalDutiesSet {
                        shopMoney {
                          amount
                        }
                      }
                      currentTotalDiscountsSet {
                        shopMoney {
                          amount
                        }
                      }
                      currentSubtotalPriceSet {
                        shopMoney {
                          amount
                        }
                      }
                      currentCartDiscountAmountSet {
                        shopMoney {
                          amount
                        }
                      }
                      cartDiscountAmountSet {
                        shopMoney {
                          amount
                        }
                      }
              
                      transactions(first: 20) {
                        id
                        accountNumber
                        amountSet {
                          shopMoney {
                            amount
                          }
                        }
              
                        gateway
                        fees {
                          id
                          rate
                          rateName
                          type
                          amount {
                            amount
                          }
                          taxAmount {
                            amount
                          }
                          flatFee {
                            amount
                          }
                        }
                      }
                    }
                  }
                }
                    }`);

        const getOrdersResponse = await axios({
            url: graphql,
            method: "post",
            headers: { "X-Shopify-Access-Token": shopifyApiToken },
            data: { query },
        });

        let extensions = getOrdersResponse.data.extensions;
        let data = getOrdersResponse.data.data.orders;
        let hasNextPage = data.pageInfo.hasNextPage;
        let orders = data.edges;
        let ordersList = []; // saves current page orders only

        // has some childs
        if (orders.length > 0) {
            orders.forEach((order) => {
                let myOrder = order.node;
                myOrder.cursor = order.cursor;
                ordersList.push(myOrder);
                allOrders.push(myOrder);
            });

            console.log("\n [+] SAVING DATA TO Backendless");

            const saveOrdersResponse = await axios({
                url: `https://api.backendless.com/${appId}/${restApiKey}/data/bulk/Shop_Orders`,
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(ordersList),
            });
            console.log("[+] Data saved to backendless with success");

            if (hasNextPage) {
                // there is more in the next page. sleep and retry
                let lastCursor = ordersList[ordersList.length - 1].cursor;
                console.log();
                console.log("\n [+] Sleeping mode for 4x seconds");

                await timeout(4000);
                return getOrders(shopifyApiKey, shopifyApiToken, shopifyShopName);

                // setTimeout(async function () {
                //     await getOrders();
                // }, 4000);
            } else {
                console.log("Done");
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ success: true, orders: allOrders }),
                };
            }
        } else {
            console.log("Shopify says there are no new orders ");
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ success: true, message: "There are no new orders at the moment" }),
            };
        }
    } catch (err) {
        console.log(err.message);
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: false, message: err.message }),
        };
    }
}
