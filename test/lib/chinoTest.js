// testing libraries
const assert = require("assert");
const should = require('should');

const settings = require("./../testsSettings");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

const Chino             = require("../../src/chino")
const ChinoAuth         = require("../../src/auth");
const ChinoUsers        = require("../../src/users");
const ChinoUserSchemas  = require("../../src/userSchemas");
const ChinoGroups       = require("../../src/groups");
const ChinoApplications = require("../../src/applications");
const ChinoRepositories = require("../../src/repositories");
const ChinoSchemas      = require("../../src/schemas");
const ChinoDocuments    = require("../../src/documents");
const ChinoPerms        = require("../../src/perms");
const ChinoBlobs        = require("../../src/blobs");
const ChinoCollections  = require("../../src/collections");
const ChinoSearch       = require("../../src/search");

describe("Chino main class", function () {
  it("Test Chino Object: should create a Chino Object with all of its properties.",
      function () {
        const chino = new Chino(baseUrl, customerId, customerKey);

        // test object
        chino.should.be.instanceOf(Chino);
        // test properties
        chino.users.should.be.instanceOf(ChinoUsers);
        chino.userSchemas.should.be.instanceOf(ChinoUserSchemas);
        chino.groups.should.be.instanceOf(ChinoGroups);
        chino.applications.should.be.instanceOf(ChinoApplications);
        chino.repositories.should.be.instanceOf(ChinoRepositories);
        chino.schemas.should.be.instanceOf(ChinoSchemas);
        chino.documents.should.be.instanceOf(ChinoDocuments);
        chino.perms.should.be.instanceOf(ChinoPerms);
        chino.blobs.should.be.instanceOf(ChinoBlobs);
        chino.collections.should.be.instanceOf(ChinoCollections);
        chino.search.should.be.instanceOf(ChinoSearch);

        const app = {
          name: "App for Chino test",
          grant_type: "password",
        };
        return chino.applications.create(app)
            .then((res) => {
              chino.setAuth(res.app_id, res.app_secret)

              chino.auth.should.be.instanceOf(ChinoAuth);
            })
      }
  );
  it("Test Chino Object: force URL to HTTPS if using the .chino.io API server",
    function() {
      // Test for official .chino.io server
      const expectedUrls = ["https://api.chino.io/v1", "https://api.test.chino.io/v1"];
      const chinoIoUrls = ["http://api.chino.io", "http://api.chino.io/", "http://api.chino.io/v1/",
          "http://api.test.chino.io", "http://api.test.chino.io/", "http://api.test.chino.io/v1/"];

      for (i in chinoIoUrls) {
          let badUrl = chinoIoUrls[i];
          let chino = new Chino(badUrl, customerId, customerKey);
          // check that URL was fixed
          chino.baseUrl.should.be.oneOf(expectedUrls);
      }

      // Test for custom servers
      const customServerUrls = ["http://localhost:8443", "http://localhost:8443/", "http://localhost:8443/v1/",
          "https://localhost/asdfg", "https://localhost/asdfg/",  "https://localhost/asdfg/v1/"];
      for (i in customServerUrls) {
          let customUrl = customServerUrls[i];
          let chino = new Chino(customUrl, customerId, customerKey);
          // check that version nr was appended
          chino.baseUrl.should.endWith("/v1");

          // check that http/https was NOT changed,
          // i.e. original URL and actual URL stored in Chino obj start with the same protocol
          chino.baseUrl.should.startWith(
              customUrl.substr(0, 8)
          );
      }
    }
  );
});