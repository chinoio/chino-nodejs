const assert = require("assert");
const should = require('should');

const Perms = require("../../src/search");
const objects = require("../../src/objects");
const settings = require("./../testsSettings");
const RESULT_TYPES = require("../../src/resultTypes");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

describe('Chino Perms API', function() {
  // change timeout for slow network
  this.timeout(10000);

  const permsCaller = new Perms(baseUrl, customerId, customerKey);
  // keep track of ids to delete them later
  let repoId = "";
  let schemaId = "";
  let documentIds = [];

  let usrSchemaId = "";
  let usrIds = [];

  // prepare the environment
  before("Set up resources to test the lib", function () {
    // TODO: set right resources
  });

  // TODO: write tests
});