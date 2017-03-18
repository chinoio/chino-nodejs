const assert = require("assert");
const should = require('should');

const Schemas = require("../../src/schemas");
const objects = require("../../src/objects");
const settings = require("./../testsSettings");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

describe('Chino Schemas API', function() {
  this.slow(300);
  // change timeout for slow network
  this.timeout(5000);

  const schemaCaller = new Schemas(baseUrl, customerId, customerKey);
  // keep track of ids to delete them later
  let repoId = "";
  let schemaId = "";

  // prepare the environment
  before("Set up resources to test the lib", function () {
    repoId = settings.data()["repoId"];
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
              result.should.be.an.instanceOf(objects.ChinoList);
              result.count.should.be.above(0);
              result.total_count.should.be.above(0);
              result.list.forEach((schema) => {
                schema.should.be.an.instanceOf(objects.Schema);
              });
              // one inserted now and one already online
              result.list.length.should.equal(2);
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
});