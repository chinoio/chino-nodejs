"use strict";

const request = require("superagent");
const binaryParser = require("superagent-binary-parser");
const _ = require('private-parts').createKey();
const GRANT_TYPES = require("./grantTypes");
const CONT_TYPES = require("./callTypes");

/** Manage response from Chino API
 *
 * @param error
 * @param response
 */
function responseHandler(error, response) {
  if (error) {
    this.reject(response.body || error);
  }
  else {
    this.resolve(response.body);
  }
}

class Call {
  /** Create a Call object
   * @constructor
   * @param baseUrl {string}
   * @param id      {string}
   * @param secret  {string | object}
   */
  constructor(baseUrl = "", authId = "", authSecret = "") {
    this.baseUrl = baseUrl;

    // set private properties
    _(this).id = authId;
    _(this).secret = authSecret;
  }

  /** Make GET request to Chino APIs
   *
   * @param url         {string}
   * @param params      {object}
   * @return {Promise}
   */
  get(url, params = {}) {
    let makeCall = (resolve, reject) => {
      request
          .get(this.baseUrl + url)
          .auth(_(this).id, _(this).secret)
          .type("application/json")
          .accept("application/json")
          .query(params)
          .end(responseHandler.bind({resolve, reject}));
    }

    return new Promise(makeCall);
  }

  /** Make GET request to Chino APIs
   *  to retrieve blob data
   *
   * @param url         {string}
   * @param params      {object}
   * @return  {request}
   */
  getBlob(url, params = {}) {
      return request
          .get(this.baseUrl + url)
          .auth(_(this).id, _(this).secret)
          .type("application/json")
          .accept("application/octet-stream")
          .query(params)
          .buffer(true)
          .parse(binaryParser)
  }

  /** Make POST request to Chino APIs
   *
   * @param url         {string}
   * @param data        {object}
   * @param acceptType  {string | null}
   * @return {Promise}
   */
  post(url, data = {}, acceptType = null) {
    let makeCall = (resolve, reject) => {
      // prepare the request and then send it
      const req = request
                    .post(this.baseUrl + url)
                    .auth(_(this).id, _(this).secret);

      if (acceptType === CONT_TYPES.FORM_DATA) {
        req
          .set("Content-Type", "multipart/form-data")
          .accept("multipart/json");

        // set form fields
        switch (data["grant_type"]) {
          case GRANT_TYPES.PASSWORD:
            req
              .field("grant_type", "password")
              .field("username", data["username"])
              .field("password", data["password"])
            break;
          case GRANT_TYPES.AUTH_CODE:
            req
              .field("grant_type", data["grant_type"])
              .field("code", data["code"])
              .field("redirect_url", data["redirect_url"])
              .field("client_id", data["client_id"])
              .field("client_secret", data["client_secret"])
              .field("scope", "read write")
            break;
          case GRANT_TYPES.RFS_TOKEN:
            req
              .field("grant_type", "refresh_token")
              .field("refresh_token", data["token"])
              .field("client_id", data["client_id"])
              .field("client_secret", data["client_secret"])
            break;
          case GRANT_TYPES.REVOKE:
            req
              .field("token", data["token"])
              .field("client_id", data["client_id"])
              .field("client_secret", data["client_secret"])
            break;
          default:
            throw new Error("No grant type selected.");
        }
      }
      else {
        req
          .type("application/json")
          .accept("application/json")
          .send(data)
      }

      req.end(responseHandler.bind({resolve, reject}));
    }

    return new Promise(makeCall);
  }

  /** Make PUT request to Chino APIs
   *
   * @param url         {string}
   * @param data        {object}
   * @param params      {object}
   * @return {Promise}
   */
  put(url, data = {}, params = {}) {
    let makeCall = (resolve, reject) => {
      request
        .put(this.baseUrl + url)
        .auth(_(this).id, _(this).secret)
        .type("application/json")
        .accept("application/json")
        .send(data)
        .end(responseHandler.bind({resolve, reject}));
    }

    return new Promise(makeCall);
  }

  /** Make PUT request to Chino APIs
   *  sending data as octet stream
   *
   * @param url         {string}
   * @param data        {object}
   * @param params      {object}
   * @return {Promise}
   */
  chunk(url, data = {}, params = {}) {
    let makeCall = (resolve, reject) => {
      request
          .put(this.baseUrl + url)
          .auth(_(this).id, _(this).secret)
          .set("offset", params.blob_offset)
          .set("length", params.blob_length)
          .type("application/octet-stream")
          .accept("application/json")
          .send(data)
          .end(responseHandler.bind({resolve, reject}));
    }

    return new Promise(makeCall);
  }

  /** Make PATCH request to Chino APIs
   *
   * @param url   {string}
   * @param data  {object}
   * @return {Promise}
   */
  patch(url, data = {}) {
    let makeCall = (resolve, reject) => {
      request
          .patch(this.baseUrl + url)
          .auth(_(this).id, _(this).secret)
          .type("application/json")
          .accept("application/json")
          .send(data)
          .end(responseHandler.bind({resolve, reject}));
    }

    return new Promise(makeCall);
  }


  /** Make DELETE request to Chino APIs
   *
   * @param url     {string}
   * @param params  {object}
   * @return {Promise}
   */
  del(url, params = {}) {
    let makeCall = (resolve, reject) => {
      request
          .del(this.baseUrl + url)
          .auth(_(this).id, _(this).secret)
          .type("application/json")
          .accept("application/json")
          .query(params)
          .end(responseHandler.bind({resolve, reject}));
    }

    return new Promise(makeCall);
  }
}

module.exports = Call;