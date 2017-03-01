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
    // save as private data
    const customerId = customerId;
    const customerKey = customerKey;

    // create Chino objects
    this.auth         = new ChinoAuth(this.baseUrl, customerId, customerKey);
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
}

module.exports = Chino;