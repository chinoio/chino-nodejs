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
  constructor(baseUrl, customerId, customerKey = null) {
    this.baseUrl = baseUrl;
    const _customerId = customerId;
    // select between basic or bearer auth
    const _customerKey = (customerKey !== null)
        ? customerKey
        : {type: "bearer"};

    this.call = new Call(baseUrl, _customerId, _customerKey);
  }
}

module.exports = ChinoAPIBase;