/**
 * Created by daniele on 22/02/17.
 */
"use strict";

const request = require("superagent");

// TODO: test the Call class

class Call {
  /** Create a Call object
   * @constructor
   * @param baseUrl
   * @param id
   * @param secret
   */
  constructor(baseUrl, id, secret) {
    this.baseUrl = baseUrl;
    this.id = id;
    this.secret = secret;
  }

  /** Make GET request to Chino APIs
   *
   * @param url
   * @param params
   */
  get(url, params) {
    // params parameter can be used in the future
    request
        .get(this.baseUrl + url)
        .auth(this.id, this.secret)
        .type("application/json")
        .accept("application/json")
        .then((result) => JSON.parse(result))
        .catch((error) => {
          console.log(`Error: ${error}`);
          return JSON.parse(error);
        });
  }

  /** Make POST request to Chino APIs
   *
   * @param url
   * @param params
   * @param data
   * @param form
   */
  post(url, params, data = null, form = null) {
    if (!data && form) {
      if (form["grant_type"] === "authorization_code") {
        request
            .get(this.baseUrl + url)
            .auth(this.id, this.secret)
            .set("Content-Type", "multipart/form-data")
            .accept("multipart/json")
            .field("grant_type", form["grant_type"])
            .field("code", form["code"])
            .field("redirect_url", form["redirect_url"])
            .field("client_id", form["client_id"])
            .field("client_secret", form["client_secret"])
            .field("scope", "read write")
            .then((result) => JSON.parse(result))
            .catch((error) => {
              console.log(`Error: ${error}`);
              return JSON.parse(error);
            });
      }
      else {
        request
            .get(this.baseUrl + url)
            .auth(this.id, this.secret)
            .set("Content-Type", "multipart/form-data")
            .accept("multipart/json")
            .field("grant_type", form["grant_type"])
            .field("username", form["username"])
            .field("password", form["password"])
            .then((result) => JSON.parse(result))
            .catch((error) => {
              console.log(`Error: ${error}`);
              return JSON.parse(error);
            });
      }
    }
    else {
      request
          .post(this.baseUrl + url)
          .auth(this.id, this.secret)
          .type("application/json")
          .accept("application/json")
          .send(data)
          .then((result) => JSON.parse(result))
          .catch((error) => {
            console.log(`Error: ${error}`);
            return JSON.parse(error);
          });
    }
  }

  /** Make PUT request to Chino APIs
   *
   * @param url
   * @param data
   */
  put(url, data = {}) {
    request
        .put(this.baseUrl + url)
        .auth(this.id, this.secret)
        .type("application/json")
        .accept("application/json")
        .send(data)
        .then((result) => JSON.parse(result))
        .catch((error) => {
          console.log(`Error: ${error}`);
          return JSON.parse(error);
        });
  }

  /** Make PATCH request to Chino APIs
   *
   * @param url
   * @param data
   */
  patch(url, data = {}) {
    request
        .patch(this.baseUrl + url)
        .auth(this.id, this.secret)
        .type("application/json")
        .accept("application/json")
        .send(data)
        .then((result) => JSON.parse(result))
        .catch((error) => {
          console.log(`Error: ${error}`);
          return JSON.parse(error);
        });
  }

  /** Make DELETE request to Chino APIs
   *
   * @param url
   * @param params
   */
  del(url, params) {
    request
        .del(this.baseUrl + url)
        .auth(this.id, this.secret)
        .type("application/json")
        .accept("application/json")
        .then((result) => JSON.parse(result))
        .catch((error) => {
          console.log(`Error: ${error}`);
          return JSON.parse(error);
        });
  }
}

module.exports = Call;

