const assert = require("assert");
const should = require('should');

const objects = require("../../src/objects");
const settings = require("./../testsSettings");
const Documents = require("../../src/documents");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

describe('Chino Documents API', function() {
  // change timeout for slow network
  this.timeout(5000);

  const documentCaller = new Documents(baseUrl, customerId, customerKey);
  // keep track of ids to delete them later
  let repoId = "";
  let schemaId = "";
  let documentId = "";
  let elements = 0;

  // prepare the environment
  before("Set up resources to test the lib", function () {
    const data = settings.data();

    repoId = data.repoId;
    schemaId = data.schemaId;
    elements = data.elements;
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
              // documents already inserted plus the new one
              result.length.should.equal(elements+1);
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
              return documentCaller.details(result.document_id)
                  .then(res => {
                    res.content.num.should.be.equal(7);
                  })
                  .catch(err => { console.log(`${JSON.stringify(err)}\n Error retrieving document info`); });
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
});