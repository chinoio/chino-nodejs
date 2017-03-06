/**
 * Created by daniele on 04/03/17.
 */

const assert = require("assert");
const should = require('should');

const objects = require("../../src/objects");
const credentials = require("./testsSettings");
const Call = require("./src/apiCall");
const Documents = require("./src/documents");

const baseUrl     = credentials.baseUrl;
const customerId  = credentials.customerId;
const customerKey = credentials.customerKey;

describe('Chino Documents API', function() {
  // change timeout for slow network
  this.timeout(5000);

  const apiCall = new Call(baseUrl, customerId, customerKey);
  const documentCaller = new Documents(baseUrl, customerId, customerKey);
  // keep track of ids to delete them later
  let repoId = "";
  let schemaId = "";
  let documentId = "";

  // prepare the environment
  before("Set up resources to test the lib", function () {
    /* create user schema and insert a user */
    const repo = {
      description : "Repository for testing Documents lib",
    };

    const schema = {
      description: "Schema for testing Documents lib",
      structure: {
        fields: [
          {
            name: "info",
            type: "string",
          },
          {
            name: "num",
            type: "integer",
            indexed: true
          },
        ]
      }
    };

    return apiCall.post("/repositories", repo)
        .then((res) => {
          repoId = res.data.repository.repository_id;

          if (repoId) {
            return apiCall.post(`/repositories/${repoId}/schemas`, schema)
                .then((res) => {
                  schemaId = res.data.schema.schema_id;
                })
                .catch((err) => console.log(`err\nNo schema created`));
          }
        })
        .catch((err) => console.log(`err\nNo repository created`));
  });

  /* create */
  it("Test the creation of a document: should return a Document object",
      function () {
        const doc = {
          content: {
            info : "document test",
            num : 3
          }
        };

        assert(schemaId !== "", "Schema undefined");
        return documentCaller.create(schemaId, doc)
            .then((result) => {
              documentId = result.document_id;
              result.should.be.an.instanceOf(objects.Document);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* details */
  it("Test the retrieving of document information: should return a Document object",
      function () {
        assert(documentId !== "", "Document undefined");
        return documentCaller.details(documentId)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Document);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* list */
  it("Test the listing of documents of a schema: should return a list of Document",
      function () {
        assert(schemaId !== "", "Schema undefined");
        return documentCaller.list(schemaId)
            .then((result) => {
              result.should.be.an.instanceOf(Array);
              result.forEach((doc) => {
                doc.should.be.an.instanceOf(objects.Document);
              });
              // in this case we have inserted 1 document so it should have only 1
              result.length.should.equal(1);
            });
      }
  );
  /* update */
  it("Test the update of document information: should return a Document object",
      function () {
        assert(documentId !== "", "Document undefined");

        const docUpdate = {
          content: {
            info : "document test",
            num : 7
          }
        };

        assert(documentId !== "", "Document undefined");
        return documentCaller.update(documentId, docUpdate)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Document);
              Object.keys(result).length.should.be.above(0);

              // check if document info was changed
              return apiCall.get(`/documents/${result.document_id}`)
                  .then(result => {
                    result.data.document.content.num.should.be.equal(7);
                  })
                  .catch(err => { console.log(`${err}\n Error retrieving document info`); });
            })
      }
  );

  /* delete */
  it("Test the deletion of a document: should return a Success message",
      function () {
        assert(documentId !== "", "Document undefined");
        return documentCaller.delete(documentId, true)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);
              result.result_code.should.be.equal(200);
            })
      }
  );

  // clean the environment
  after("Remove test resources", function () {
    // be sure to have enough time
    this.timeout(10000);

    function sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    return sleep(1000).then(() => {
      if (schemaId !== "") {
        return apiCall.del(`/schemas/${schemaId}?force=true&all_content=true`)
            .then(res => {
              if (repoId !== "") {
                return apiCall.del(`/repositories/${repoId}?force=true`)
                    .then(res => { /*console.log("Removed stub stuff")*/ })
                    .catch(err => { console.log(`Error removing repository resources`) });
              }
            })
            .catch(err => { console.log(`Error removing test resources`) });
      }
    });
  });
});