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
    this.baseUrl = baseUrl;

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
}

module.exports = Chino;