/**
 * Created by daniele on 24/02/17.
 */
"use strict";

const Call = require("./apiCall");

class ChinoAPIBase {
  /** Create a caller for base class Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customer_id, customer_key = null) {
    this.baseUrl = baseUrl;
    const customerId = customer_id;
    // select between basic or bearer auth
    const customerKey = (customer_key !== null)
        ? customer_key
        : {type: "bearer"};

    this.call = new Call(baseUrl, customerId, customerKey);
  }
}

module.exports = ChinoAPIBase;