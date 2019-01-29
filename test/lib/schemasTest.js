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
    // IDs required for running tests -
    let repoId = "";
    let schemaId = "";
    // ID of a Schema which is created during tests
    let createdSchemaId = "";

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    const testSchemaStructure = {
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

    // prepare the environment
    before("Set up resources to test the lib", function () {
        repoId = settings.data()["repoId"];
        schemaId = settings.data()["schemaId"];
    });

    /* create */
    it("Test the creation of a schema: should return a Schema object",
        function (done) {

            schemaCaller.create(repoId, testSchemaStructure)
                .then((result) => {
                    createdSchemaId = result.schema_id;
                    result.should.be.an.instanceOf(objects.Schema);
                    Object.keys(result).length.should.be.above(0);
                    return done();
                })
                .catch(error=> done(error));
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
    /* update */
    it("Test the update of schema information: should return a Schema object",
        function (done) {
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

            // assert(schemaId !== "", "Schema undefined");
            if (createdSchemaId === "") {
                console.log("creating new Schema for UPDATE");
                schemaCaller.create(repoId, testSchemaStructure)
                    .then((newSchema) => {
                        schemaCaller.update(newSchema.schema_id, schemaUpdate)
                            .then((result) => {
                                result.should.be.an.instanceOf(objects.Schema);
                                Object.keys(result).length.should.be.above(0);
                                result.description.should.be.equal("Schema test Updated");
                                done();
                            })
                            .catch(err => done(err))
                    })
                    .catch(err => done("Unable to find Schema to delete ~ " + err));
            } else {
                schemaCaller.update(createdSchemaId, schemaUpdate)
                    .then((result) => {
                        result.should.be.an.instanceOf(objects.Schema);
                        Object.keys(result).length.should.be.above(0);
                        result.description.should.be.equal("Schema test Updated");
                        done();
                    })
                    .catch(err => done(err))
            }

        }
    );

    /* delete */
    it("Test the deletion of a schema: should return a success message",
        function (done) {
            if (createdSchemaId === "") {
                console.log("creating new Schema for DELETE");
                schemaCaller.create(repoId, testSchemaStructure)
                    .then((newSchema) => {
                        schemaCaller.delete(newSchema.schema_id, true)
                            .then((result) => {
                                result.should.be.an.instanceOf(objects.Success);
                                result.result_code.should.be.equal(200);
                                return done();
                            })
                            .catch(err => done(err))
                    })
                    .catch(err => done("Unable to find Schema to delete ~ " + err));

            } else {
                // delete existing schema
                schemaCaller.delete(createdSchemaId, true)
                    .then((result) => {
                        result.should.be.an.instanceOf(objects.Success);
                        result.result_code.should.be.equal(200);
                        return done();
                    })
                    .catch(err => done(err))
            }
        }
    );

    /* =================================== */
    /* Test what happen in wrong situation */
    // describe("Test error situations:", function () {
    //   it("should throw a ChinoException object, because schema information are incorrect",
    //       function () {
    //         const schema = {};
    //
    //         return schemaCaller.create(repoId, schema)
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(400)
    //             })
    //       }
    //   );
    //   it("should throw a ChinoException object, because schema id doesn't exist",
    //       function () {
    //         return schemaCaller.details("")
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //       }
    //   );
    //   it("should throw a ChinoException object, because repository id doesn't exist, so no schemas can be retrieved",
    //       function () {
    //
    //         return schemaCaller.list("")
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //       }
    //   );
    //   it("should throw a ChinoException object, because schema id doesn't exist",
    //       function () {
    //         const schemaUpdate = {
    //           "description": "Schema test Updated",
    //           "structure": {
    //             "fields": [
    //               {
    //                 "name": "physician_id",
    //                 "type": "string",
    //                 "indexed": true
    //               },
    //               {
    //                 "name": "patient_birth_date",
    //                 "type": "date",
    //                 "indexed": true
    //               },
    //               {
    //                 "name": "observation",
    //                 "type": "string"
    //               },
    //               {
    //                 "name": "visit_date",
    //                 "type": "datetime",
    //                 "indexed": true
    //               },
    //               {
    //                 "name": "address",
    //                 "type": "string",
    //               }
    //             ]
    //           }
    //         };
    //
    //         return schemaCaller.update(schemaId, schemaUpdate)
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })        }
    //   );
    //   it("should throw a ChinoException object, because schema id doesn't exist",
    //       function () {
    //         return schemaCaller.delete(schemaId, null)
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //       }
    //   );
    // });
});