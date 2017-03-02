/**
 * Created by daniele on 22/02/17.
 */
"use strict";

const ChinoAuth         = require("./auth.js");
const ChinoUsers        = require("./users.js");
const ChinoUserSchemas  = require("./userSchemas.js");
const ChinoGroups       = require("./groups.js");
const ChinoApplications = require("./applications.js");
const ChinoRepositories = require("./repositories.js");
const ChinoSchemas      = require("./schemas.js");
const ChinoDocuments    = require("./documents.js");
const ChinoPerms        = require("./perms.js");
const ChinoBlobs        = require("./blobs.js");
const ChinoCollections  = require("./collections.js");
const ChinoSearch       = require("./search.js");

class Chino {
  /**
   * @constructor
   * @param {string} baseUrl
   * @param {string} customerId
   * @param {string} customerKey
   */

  constructor(baseUrl, customerId, customerKey) {
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
    this.auth = new ChinoAuth(this.baseUrl, appId, appKey);
  }
}

module.exports = Chino;