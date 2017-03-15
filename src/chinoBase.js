"use strict";

const Call = require("./apiCall");

class ChinoAPIBase {
  /** Create a caller for base class Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    // select between basic or bearer auth
    const _customerKey = (customerKey !== null)
        ? customerKey
        : {type: "bearer"};
    this.call = new Call(baseUrl, customerId, _customerKey);
  }
}

module.exports = ChinoAPIBase;