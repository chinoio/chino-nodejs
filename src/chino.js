"use strict";

const ChinoAuth         = require("./auth");
const ChinoUsers        = require("./users");
const ChinoUserSchemas  = require("./userSchemas");
const ChinoGroups       = require("./groups");
const ChinoApplications = require("./applications");
const ChinoRepositories = require("./repositories");
const ChinoSchemas      = require("./schemas");
const ChinoDocuments    = require("./documents");
const ChinoPerms        = require("./perms");
const ChinoBlobs        = require("./blobs");
const ChinoCollections  = require("./collections");
const ChinoSearch       = require("./search");

class Chino {
  /**
   * @constructor
   * @param {string} baseUrl
   * @param {string} customerId
   * @param {string | null} customerKey
   */

  constructor(baseUrl = "", customerId = "", customerKey = null) {
    this.baseUrl = this._fixUrl(baseUrl);

    // create Chino objects
    this.users        = new ChinoUsers(this.baseUrl, customerId, customerKey);
    this.userSchemas  = new ChinoUserSchemas(this.baseUrl, customerId, customerKey);
    this.groups       = new ChinoGroups(this.baseUrl, customerId, customerKey);
    this.applications = new ChinoApplications(this.baseUrl, customerId, customerKey);
    this.repositories = new ChinoRepositories(this.baseUrl, customerId, customerKey);
    this.schemas      = new ChinoSchemas(this.baseUrl, customerId, customerKey);
    this.documents    = new ChinoDocuments(this.baseUrl, customerId, customerKey);
    this.perms        = new ChinoPerms(this.baseUrl, customerId, customerKey);
    this.blobs        = new ChinoBlobs(this.baseUrl, customerId, customerKey);
    this.collections  = new ChinoCollections(this.baseUrl, customerId, customerKey);
    this.search       = new ChinoSearch(this.baseUrl, customerId, customerKey);
  }

  /** Set up for Chino object an Auth object
   *  using previous created application id & secret
   *
   * @param appId     {string}
   * @param appSecret {string}
   */
  setAuth(appId, appSecret) {
    this.auth = new ChinoAuth(this.baseUrl, appId, appSecret);
  }

  /** Check that the URL for calls made to Chino.io API is correct:
   *  First, forces URL to https. This is done only for main Chino.io servers:
   *  'api.test.chino.io' and 'api.chino.io'.
   *  Then appends the version number "/v1", if required.
   *
   * @param uncheckedUrl   {String} the URL to Chino.io API
   * @returns     {String} the complete URL
   * @private
   */
  _fixUrl(uncheckedUrl) {
    let hostUrl = uncheckedUrl;

    // force HTTPS
    if (hostUrl.startsWith("http://")) {
        if (hostUrl.includes(".chino.io")) {
            hostUrl = hostUrl.replace("http://", "https://");
        } else {
            console.log(
                ">> WARNING: You are using Chino API over HTTP.\n" +
                ">> The API will work as usual, but HTTPS is strongly recommended.\n"
            );
        }
    }

    if (hostUrl.includes("v1")) {
      // remove trailing '/' (if any)
      return hostUrl.replace("v1/", "v1");
    }

    // append version number
    if (!hostUrl.endsWith("/")) {
      hostUrl += "/";
    }
    if (!hostUrl.endsWith("/v1")) {
      hostUrl += "v1";
    }

    return hostUrl;
  }
}

module.exports = Chino;