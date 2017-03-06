/**
 * Created by daniele on 06/03/17.
 */

const assert = require("assert");
const should = require('should');

const objects = require("../../src/objects");
const credentials = require("./testsSettings");
const Call = require("../../src/apiCall");
const Collections = require("../../src/collections");

const baseUrl     = credentials.baseUrl;
const customerId  = credentials.customerId;
const customerKey = credentials.customerKey;

describe('Chino Collections API', function() {
  // change timeout for slow network
  this.timeout(5000);

  const apiCall = new Call(baseUrl, customerId, customerKey);
  const collectionCaller = new Collections(baseUrl, customerId, customerKey);
  // keep track of ids to delete them later
  let repoId = "";
  let schemaId = "";
  let documentIds = [];
  let collectionId = "";

  // prepare the environment
  before("Set up resources to test the lib", function () {
    /* create user schema and insert a user */
    const repo = {
      description : "Repository for testing Collections lib",
    };

    const schema = {
      description: "Schema for testing Collections lib",
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

    // return a doc Js representation
    let doc = (id) => ({
      content: {
        info : `document test ${id}`,
        num : id
      }
    });

    const ids = [1,2,3,4];

    // create a repository with a schema that own 4 documents
    return apiCall.post("/repositories", repo)
    .then((res) => {
      repoId = res.data.repository.repository_id;

      if (repoId) {
        return apiCall.post(`/repositories/${repoId}/schemas`, schema)
            .then((res) => {
              schemaId = res.data.schema.schema_id;

              if (schemaId) {
                return Promise.all(ids.map(id => apiCall.post(`/schemas/${schemaId}/documents`, doc(id))))
                    .then((res) => {
                      res.forEach(r => { documentIds.push(r.data.document.document_id); });
                    })
                    .catch((err) => console.log(`Error inserting documents\n${err}`));
              }
              else {
                throw new Error("No schema created");
              }
            })
            .catch((err) => console.log(`err\nNo schema created`));
      }
    })
    .catch((err) => console.log(`err\nNo repository created`));
  });

  /* create */
  it("Test the creation of a collection: should return a Collection object",
      function () {
        const coll = {
          name : "Collection for testing"
        };

        return collectionCaller.create(coll)
            .then((result) => {
              collectionId = result.collection_id;
              result.should.be.an.instanceOf(objects.Collection);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* details */
  it("Test the retrieving of collection information: should return a Collection object",
      function () {
        assert(collectionId !== "", "Collection undefined");
        return collectionCaller.details(collectionId)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Collection);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* list */
  it("Test the listing of collections of a schema: should return a list of Collection",
      function () {
        return collectionCaller.list()
            .then((result) => {
              result.should.be.an.instanceOf(Array);
              result.forEach((coll) => {
                coll.should.be.an.instanceOf(objects.Collection);
              });
              // in this case we have inserted 1 collection so it should have only 1
              result.length.should.equal(1);
            });
      }
  );
  /* update */
  it("Test the update of collection information: should return a Collection object",
      function () {
        assert(collectionId !== "", "Collection undefined");

        const collUpdate = {
          name : "Collection name updated"
        };

        assert(collectionId !== "", "Collection undefined");
        return collectionCaller.update(collectionId, collUpdate)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Collection);
              Object.keys(result).length.should.be.above(0);
              result.name.should.be.equal("Collection name updated");
        });
      }
  );
  /* insert document into collection */
  it("Test the insertion of a document into a collection: should return a Success message",
      function () {
        assert(collectionId !== "", "Collection undefined");
        return collectionCaller.insertDocument(collectionId, documentIds[0])
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);
              result.result_code.should.be.equal(200);
            })
      }
  );
  /* list */
  it("Test the listing of documents of a collection: should return a list of Documents",
      function () {
        assert(collectionId !== "", "Collection undefined");
        return collectionCaller.listDocuments(collectionId)
            .then((result) => {
              result.should.be.an.instanceOf(Array);
              result.forEach((doc) => {
                doc.should.be.an.instanceOf(objects.Document);
              });
              // in this case we have inserted 1 collection so it should have only 1
              result.length.should.equal(1);
            });
      }
  );
  /* remove document from collection */
  it("Test the removal of a document from a collection: should return a Success message",
      function () {
        assert(collectionId !== "", "Collection undefined");
        return collectionCaller.removeDocument(collectionId, documentIds[0])
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);
              result.result_code.should.be.equal(200);
            })
      }
  );

  /* search collection */
  it("Test the search feature between collections: should return a list of Collections",
      function () {
        const filter = {
          name : "update",
          contains : true
        }

        return collectionCaller.search(filter)
            .then((result) => {
              result.should.be.an.instanceOf(Array);
              result.forEach((coll) => {
                coll.should.be.an.instanceOf(objects.Collection);
                coll.name.should.containEql("updated");
              });
              // in this case we have 1 collection that contain "Update" in its name
              result.length.should.equal(1);
            });
      }
  );

  /* delete */
  it("Test the deletion of a collection: should return a Success message",
      function () {
        assert(collectionId !== "", "Collection undefined");
        return collectionCaller.delete(collectionId, true)
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