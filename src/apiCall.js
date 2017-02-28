/**
 * Created by daniele on 22/02/17.
 */
"use strict";

const request = require("superagent");
const GRANT_TYPES = require("./grantTypes");

// module internal variables
let id;
let secret;

/** Set Chino authentication as private information
 *
 * @param authId      the customer id or the bearer token
 * @param authSecret  the customer key or the auth type as object
 */
function setAuth(authId, authSecret) {
  id = authId;
  secret = authSecret;
}

class Call {
  /** Create a Call object
   * @constructor
   * @param baseUrl
   * @param id
   * @param secret
   */
  constructor(baseUrl, authId, authSecret) {
    this.baseUrl = baseUrl;

    setAuth(authId, authSecret);
  }

  /** Make GET request to Chino APIs
   *
   * @param url
   * @param params
   */
  get(url, params = {}) {
    let makeCall = (resolve, reject) => {
      /** Manage response from Chino API
       *
       * @param error
       * @param response
       */
      function responseHandler(error, response) {
        if (error) {
          reject(response.body);
        }
        else {
          resolve(response.body);
        }
      }
      // call Chino API
      request
          .get(this.baseUrl + url)
          .auth(id, secret)
          .type("application/json")
          .accept("application/json")
          .query(params)
          .end(responseHandler);
    }

    return new Promise(makeCall);
  }

  /** Make POST request to Chino APIs
   *
   * @param url
   * @param data
   * @param form
   */
  post(url, data = null, form = null) {
    let makeCall = (resolve, reject) => {
      /** Manage response from Chino API
       *
       * @param error
       * @param response
       */
      function responseHandler(error, response) {
        if (error) {
          reject(response.body);
        }
        else {
          resolve(response.body);
        }
      }

      if (!data && form) {
        if (form["grant_type"] === GRANT_TYPES.AUTH_CODE) {
          console.log(form["grant_type"])
          request
              .post(this.baseUrl + url)
              .auth(id, secret)
              .set("Content-Type", "multipart/form-data")
              .accept("multipart/json")
              .field("grant_type", form["grant_type"])
              .field("code", form["code"])
              .field("redirect_url", form["redirect_url"])
              .field("client_id", form["client_id"])
              .field("client_secret", form["client_secret"])
              .field("scope", "read write")
              .end(responseHandler);
        }
        if (form["grant_type"] === GRANT_TYPES.RFS_TOKEN) {
          request
              .post(this.baseUrl + url)
              .auth(id, secret)
              .set("Content-Type", "multipart/form-data")
              .accept("multipart/json")
              .field("grant_type", "refresh_token")
              .field("refresh_token", form["code"])
              .field("client_id", form["client_id"])
              .field("client_secret", form["client_secret"])
              .field("scope", "read write")
              .end(responseHandler);
        }
        else {
          request
              .post(this.baseUrl + url)
              .auth(id, secret)
              .set("Content-Type", "multipart/form-data")
              .accept("multipart/json")
              .field("grant_type", "password")
              .field("username", form["username"])
              .field("password", form["password"])
              .end(responseHandler);
        }
      }
      else {
        request
            .post(this.baseUrl + url)
            .auth(id, secret)
            .type("application/json")
            .accept("application/json")
            .send(data)
            .end(responseHandler);
      }
    }

    return new Promise(makeCall);
  }

  /** Make PUT request to Chino APIs
   *
   * @param url
   * @param data
   */
  put(url, data = {}) {
    let makeCall = (resolve, reject) => {
      /** Manage response from Chino API
       *
       * @param error
       * @param response
       */
      function responseHandler(error, response) {
        if (error) {
          reject(response.body);
        }
        else {
          resolve(response.body);
        }
      }

      request
          .put(this.baseUrl + url)
          .auth(id, secret)
          .type("application/json")
          .accept("application/json")
          .send(data)
          .end(responseHandler);
    }

    return new Promise(makeCall);
  }

  /** Make PATCH request to Chino APIs
   *
   * @param url
   * @param data
   */
  patch(url, data = {}) {
    let makeCall = (resolve, reject) => {
      /** Manage response from Chino API
       *
       * @param error
       * @param response
       */
      function responseHandler(error, response) {
        if (error) {
          reject(response.body);
        }
        else {
          resolve(response.body);
        }
      }

      request
          .patch(this.baseUrl + url)
          .auth(id, secret)
          .type("application/json")
          .accept("application/json")
          .send(data)
          .end(responseHandler);
    }

    return new Promise(makeCall);
  }


  /** Make DELETE request to Chino APIs
   *
   * @param url
   * @param params
   */
  del(url, params = {}) {
    let makeCall = (resolve, reject) => {
      /** Manage response from Chino API
       *
       * @param error
       * @param response
       */
      function responseHandler(error, response) {
        if (error) {
          reject(response.body);
        }
        else {
          resolve(response.body);
        }
      }

      request
          .del(this.baseUrl + url)
          .auth(id, secret)
          .type("application/json")
          .accept("application/json")
          .query(params)
          .end(responseHandler);
    }

    return new Promise(makeCall);
  }
}

module.exports = Call;

