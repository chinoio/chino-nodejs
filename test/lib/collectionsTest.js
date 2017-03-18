const assert = require("assert");
const should = require('should');

const objects = require("../../src/objects");
const settings = require("./../testsSettings");
const Collections = require("../../src/collections");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

describe('Chino Collections API', function() {
  this.slow(300);
  // change timeout for slow network
  this.timeout(5000);

  const collectionCaller = new Collections(baseUrl, customerId, customerKey);
  // keep track of ids to delete them later
  let repoId = "";
  let schemaId = "";
  let documentIds = [];
  let collectionId = "";

  // prepare the environment
  before("Set up resources to test the lib", function () {
    const data = settings.data();

    repoId = data.repoId;
    schemaId = data.schemaId;
    documentIds = data.docIds;
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
              // one collection inserted plus an existing one
              result.length.should.equal(2);
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
              // only one document inserted in this collection
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
});