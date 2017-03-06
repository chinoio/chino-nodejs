/**
 * Created by daniele on 03/03/17.
 */

const assert = require("assert");
const should = require('should');

const objects = require("../../src/objects");
const credentials = require("./testsSettings");
const Call = require("../../src/apiCall");
const Schemas = require("../../src/schemas");

const baseUrl     = credentials.baseUrl;
const customerId  = credentials.customerId;
const customerKey = credentials.customerKey;

describe('Chino Schemas API', function() {
  // change timeout for slow network
  this.timeout(5000);

  const apiCall = new Call(baseUrl, customerId, customerKey);
  const schemaCaller = new Schemas(baseUrl, customerId, customerKey);
  // keep track of ids to delete them later
  let repoId = "";
  let schemaId = "";

  // prepare the environment
  before("Set up resources to test the lib", function () {
    /* create user schema and insert a user */
    const repo = {
      description : "Repository for testing Schema lib",
    };

    return apiCall.post("/repositories", repo)
        .then((res) => {
          repoId = res.data.repository.repository_id;
        })
        .catch((err) => console.log(err + "\nNo repository created"));
  });

  /* create */
  it("Test the creation of a schema: should return a Schema object",
      function () {
        const schema = {
          "description": "Schema test",
          "structure": {
            "fields": [
              {
                "name": "physician_id",
                "type": "string",
                "indexed": true
              },
              {
                "name": "patient_birth_date",
                "type": "date",
                "indexed": true
              },
              {
                "name": "observation",
                "type": "string"
              },
              {
                "name": "visit_date",
                "type": "datetime",
                "indexed": true
              }
            ]
          }
        };

        return schemaCaller.create(repoId, schema)
            .then((result) => {
              schemaId = result.schema_id;
              result.should.be.an.instanceOf(objects.Schema);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* details */
  it("Test the retrieving of schema information: should return a Schema object",
      function () {
        assert(schemaId !== "", "Schema undefined");
        return schemaCaller.details(schemaId)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Schema);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* list */
  it("Test the listing of schema from a repository: should return a list of Schema",
      function () {

        return schemaCaller.list(repoId)
            .then((result) => {
              result.should.be.an.instanceOf(Array);
              result.forEach((schema) => {
                schema.should.be.an.instanceOf(objects.Schema);
              });
              // in this case we have inserted 1 schema so it should have only 1
              result.length.should.equal(1);
            });
      }
  );
  /* update */
  it("Test the update of schema information: should return a Schema object",
      function () {
        assert(repoId !== "", "Repository undefined");
        const schemaUpdate = {
          "description": "Schema test Updated",
          "structure": {
            "fields": [
              {
                "name": "physician_id",
                "type": "string",
                "indexed": true
              },
              {
                "name": "patient_birth_date",
                "type": "date",
                "indexed": true
              },
              {
                "name": "observation",
                "type": "string"
              },
              {
                "name": "visit_date",
                "type": "datetime",
                "indexed": true
              },
              {
                "name": "address",
                "type": "string",
              }
            ]
          }
        };

        assert(schemaId !== "", "Schema undefined");
        return schemaCaller.update(schemaId, schemaUpdate)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Schema);
              Object.keys(result).length.should.be.above(0);
              result.description.should.be.equal("Schema test Updated");
            })
      }
  );

  /* delete */
  it("Test the deletion of a schema: should return a success message",
      function () {
        assert(schemaId !== "", "Schema undefined");
        return schemaCaller.delete(schemaId, true)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);
              result.result_code.should.be.equal(200);
            })
      }
  );

  // clean the environment
  after("Remove test resources", function () {
    // be sure to have enough
    this.timeout(10000);

    function sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    return sleep(1000).then(() => {
      if (repoId !== "") {
        return apiCall.del(`/repositories/${repoId}?force=true`)
            .then(res => { /*console.log("Removed stub stuff")*/ })
            .catch(err => { console.log(`Error removing test resources`) });
      }
    });
  });
});