/**
 * Created by daniele on 22/02/17.
 */
"use strict";

const request = require("superagent");
const _ = require('private-parts').createKey();
const GRANT_TYPES = require("./grantTypes");

class Call {
  /** Create a Call object
   * @constructor
   * @param baseUrl {string}
   * @param id      {string}
   * @param secret  {string | object}
   */
  constructor(baseUrl, authId, authSecret) {
    this.baseUrl = baseUrl;

    this.TYPES = {
      JSON : "application/json",
      FORM_DATA : "multipart/form-data",
      OCT_STREAM : "application/octet-stream"
    }

    // set private properties
    _(this).id = authId;
    _(this).secret = authSecret;
  }

  /** Make GET request to Chino APIs
   *
   * @param url         {string}
   * @param params      {object}
   * @param acceptType  {string | null}
   * @return {Promise}
   */
  get(url, params = {}, acceptType = null) {
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
      if(acceptType === this.TYPES.OCT_STREAM) {
        request
            .get(this.baseUrl + url)
            .auth(_(this).id, _(this).secret)
            .type("application/json")
            .accept("application/octet-stream")
            .query(params)
            .end(responseHandler);
      }
      else {
        request
            .get(this.baseUrl + url)
            .auth(_(this).id, _(this).secret)
            .type("application/json")
            .accept("application/json")
            .query(params)
            .end(responseHandler);
      }
    }

    return new Promise(makeCall);
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

      if (acceptType === this.TYPES.FORM_DATA) {
        if (data["grant_type"] === GRANT_TYPES.AUTH_CODE) {
          // console.log(data["grant_type"])
          request
              .post(this.baseUrl + url)
              .auth(_(this).id, _(this).secret)
              .set("Content-Type", "multipart/form-data")
              .accept("multipart/json")
              .field("grant_type", data["grant_type"])
              .field("code", data["code"])
              .field("redirect_url", data["redirect_url"])
              .field("client_id", data["client_id"])
              .field("client_secret", data["client_secret"])
              .field("scope", "read write")
              .end(responseHandler);
        }
        if (data["grant_type"] === GRANT_TYPES.RFS_TOKEN) {
          request
              .post(this.baseUrl + url)
              .auth(_(this).id, _(this).secret)
              .set("Content-Type", "multipart/form-data")
              .accept("multipart/json")
              .field("grant_type", "refresh_token")
              .field("refresh_token", data["code"])
              .field("client_id", data["client_id"])
              .field("client_secret", data["client_secret"])
              .field("scope", "read write")
              .end(responseHandler);
        }
        else {
          request
              .post(this.baseUrl + url)
              .auth(_(this).id, _(this).secret)
              .set("Content-Type", "multipart/form-data")
              .accept("multipart/json")
              .field("grant_type", "password")
              .field("username", data["username"])
              .field("password", data["password"])
              .end(responseHandler);
        }
      }
      else {
        request
            .post(this.baseUrl + url)
            .auth(_(this).id, _(this).secret)
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
   * @param url         {string}
   * @param data        {object}
   * @param acceptType  {string | null}
   * @param params      {object}
   * @return {Promise}
   */
  put(url, data = {}, acceptType = null, params = {}) {
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

      if (acceptType === this.TYPES.OCT_STREAM) {
        request
            .put(this.baseUrl + url)
            .auth(_(this).id, _(this).secret)
            .set("offset", params.blob_offset)
            .set("length", params.blob_length)
            .type("application/octet-stream")
            .accept("application/json")
            .send(data)
            .end(responseHandler);
      }
      else {
        request
            .put(this.baseUrl + url)
            .auth(_(this).id, _(this).secret)
            .type("application/json")
            .accept("application/json")
            .send(data)
            .end(responseHandler);
      }
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
          .auth(_(this).id, _(this).secret)
          .type("application/json")
          .accept("application/json")
          .send(data)
          .end(responseHandler);
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
          .auth(_(this).id, _(this).secret)
          .type("application/json")
          .accept("application/json")
          .query(params)
          .end(responseHandler);
    }

    return new Promise(makeCall);
  }
}

module.exports = Call;

