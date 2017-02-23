/**
 * Created by daniele on 22/02/17.
 */
"use strict";

const ChinoAuth         = require("./auth.js");
const ChinoUsers        = require("./users.js");
const ChinoGroups       = require("./groups.js");
const ChinoPerms        = require("./perms.js");
const ChinoRepositories = require("./repositories.js");
const ChinoSchemas      = require("./schemas.js");
const ChinoDocuments    = require("./documents.js");
const ChinoBlobs        = require("./blobs.js");
const ChinoCollections  = require("./collections.js");
const ChinoSearch       = require("./search.js");

class ChinoAPIBase {
  /**
   * @constructor
   * @param {string} baseUrl
   * @param {string} customerId
   * @param {string} customerKey
   */
  constructor(baseUrl, customerId, customerKey) {
    this.baseUrl = baseUrl;
    this.customerId = customerId;
    this.customerKey = customerKey;
  }
}

module.exports = ChinoAPIBase;