const assert = require("assert");
const should = require('should');

const Search = require("../../src/search");
const objects = require("../../src/objects");
const settings = require("../testsSettings");
const RESULT_TYPES = require("../../src/resultTypes");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

describe('Chino Search API', function() {
    this.slow(300);
    // change timeout for slow network
    this.timeout(10000);

    const searchCaller = new Search(baseUrl, customerId, customerKey);
    // keep track of ids to delete them later
    let repoId = "";
    let schemaId = "";
    let documentIds = [];

    let usrSchemaId = "";
    let usrIds = [];

    // prepare the environment
    before("Set up resources to test the lib", function () {
        // read data file
        let data = settings.data();

        repoId = data.repoId;
        schemaId = data.schemaId;
        documentIds = data.docIds;
        usrSchemaId = data.usrSchemaId;
        usrIds = data.usrIds;
    });

    /* Search Documents */
    describe("Search Documents", function () {
        it("Test the searching of documents from a schema: should return a list of Documents",
            function () {
                const filterValue = 2;

                const params = {
                    result_type: RESULT_TYPES.FULL_CONTENT,
                    filter_type: "and",
                    filter: [
                        {
                            field: "num",
                            type: "lte",
                            value: filterValue
                        },
                    ]
                };

                return searchCaller.documents(schemaId, params)
                    .then((result) => {
                        result.should.be.an.instanceOf(objects.ChinoList);
                        result.count.should.be.above(0);
                        result.total_count.should.be.above(0);
                        result.list.forEach((doc) => {
                            doc.should.be.an.instanceOf(objects.Document);
                            doc.schema_id.should.be.eql(schemaId);
                            doc.content.num.should.be.belowOrEqual(filterValue);
                        });

                        result.list.length.should.equal(filterValue);
                    });
            }
        );

        it("Test the searching of documents from a schema: should return a list of Documents without content",
            function () {
                const filterValue = 4;
                const offset = 2;

                const params = {
                    result_type: RESULT_TYPES.NO_CONTENT,
                    filter_type: "and",
                    filter: [
                        {
                            field: "num",
                            type: "lte",
                            value: filterValue
                        },
                    ]
                };

                return searchCaller.documents(schemaId, params, offset)
                    .then((result) => {
                        result.should.be.an.instanceOf(objects.ChinoList);
                        result.count.should.be.above(0);
                        result.total_count.should.be.above(0);
                        result.list.forEach((doc) => {
                            doc.should.be.an.instanceOf(objects.Document);
                            doc.schema_id.should.be.eql(schemaId);
                        });

                        result.list.length.should.equal(filterValue-offset);
                    });
            }
        );

        it("Test the searching of documents from a schema: should return the ids of Documents matching search criteria",
            function () {
                const filterValue = 5;

                const params = {
                    result_type: RESULT_TYPES.ONLY_ID,
                    filter_type: "and",
                    filter: [
                        {
                            field: "num",
                            type: "lte",
                            value: filterValue
                        },
                    ]
                };

                return searchCaller.documents(schemaId, params)
                    .then((result) => {
                        result.data.count.should.equal(filterValue);
                        result.data.IDs.should.instanceOf(Array);
                    });
            }
        );

        it("Test the searching of documents from a schema: should return the number of Documents matching search criteria",
            function () {
                const filterValue = 4;

                const params = {
                    result_type: RESULT_TYPES.COUNT,
                    filter_type: "and",
                    filter: [
                        {
                            field: "num",
                            type: "lte",
                            value: filterValue
                        },
                    ]
                };

                return searchCaller.documents(schemaId, params)
                    .then((result) => { result.data.count.should.equal(filterValue); });
            }
        );
    });

    /* Search Users */
    describe("Search Users", function () {
        it("Test the searching of users from a user schema: should return a list of Users",
            function () {
                const filterValue = 3;

                const params = {
                    result_type: RESULT_TYPES.FULL_CONTENT,
                    filter_type: "and",
                    filter: [
                        {
                            field: "user",
                            type: "lte",
                            value: filterValue
                        },
                    ]
                };

                return searchCaller.users(usrSchemaId, params)
                    .then((result) => {
                        result.should.be.an.instanceOf(objects.ChinoList)
                        result.count.should.be.above(0);
                        result.total_count.should.be.above(0);
                        result.list.forEach((usr) => {
                            usr.should.be.an.instanceOf(objects.User);
                            usr.schema_id.should.be.eql(usrSchemaId);
                        });
                        result.list.length.should.equal(filterValue);
                    });
            }
        );
        it("Test the searching of users from a user schema: should return the number of User matching search criteria",
            function () {
                const filterValue = 4;

                const params = {
                    result_type: RESULT_TYPES.COUNT,
                    filter_type: "and",
                    filter: [
                        {
                            field: "user",
                            type: "lte",
                            value: filterValue
                        },
                    ]
                };

                return searchCaller.users(usrSchemaId, params)
                    .then((result) => { result.data.count.should.equal(filterValue); });
            }
        );
        it("Test the searching of users from a user schema (EXISTS): should return true",
            function () {
                const filterValue = 2;

                const params = {
                    result_type: RESULT_TYPES.EXISTS,
                    filter_type: "and",
                    filter: [
                        {
                            field: "user",
                            type: "lte",
                            value: filterValue
                        },
                    ]
                };

                return searchCaller.users(usrSchemaId, params)
                    .then((result) => {
                        result.data.exists.should.be.equal(true);
                    });
            }
        );
        it("Test the searching of users from a user schema (USERNAME_EXISTS): should return true",
            function () {
                const filterValue = 2;

                const params = {
                    result_type: RESULT_TYPES.USERNAME_EXISTS,
                    filter_type: "and",
                    filter: [
                        {
                            field: "username",
                            type: "eq",
                            value: "theLoginUser"
                        },
                    ]
                };

                return searchCaller.users(usrSchemaId, params)
                    .then((result) => {
                        result.data.exists.should.be.equal(true);
                    });
            }
        );
    });

    /* =================================== */
    /* Test what happen in wrong situation */
    // describe("Test error situations:", function () {
    //   it("searching documents (full content) should throw a ChinoException error, because filter is wrong",
    //       function () {
    //         const filterValue = 2;
    //
    //         const params = {
    //           result_type: RESULT_TYPES.FULL_CONTENT,
    //           filter_type: "as",
    //           filter: []
    //         };
    //
    //         return searchCaller.documents(schemaId, params)
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(400)
    //             })
    //       }
    //   );
    //
    //   it("searching documents (count) should throw a ChinoException error, because filter type is wrong",
    //       function () {
    //         const filterValue = 4;
    //         const offset = 2;
    //
    //         const params = {
    //           result_type: RESULT_TYPES.COUNT,
    //           filter_type: null,
    //           filter: [
    //             {
    //               field: "num",
    //               type: "lte",
    //               value: filterValue
    //             },
    //           ]
    //         };
    //
    //         return searchCaller.documents(schemaId, params, offset)
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(400)
    //             })
    //       }
    //   );
    //
    //   it("searching documents (ids) should throw a ChinoException error, because schema id doesn't exist",
    //       function () {
    //         const filterValue = 5;
    //
    //         const params = {
    //           result_type: RESULT_TYPES.ONLY_ID,
    //           filter_type: "and",
    //           filter: [
    //             {
    //               field: "num",
    //               type: "lte",
    //               value: filterValue
    //             },
    //           ]
    //         };
    //
    //         return searchCaller.documents("", params)
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //       }
    //   );
    //
    //   it("searching documents (wrong result type) should throw a ChinoException error, because result type is wrong",
    //       function () {
    //         const filterValue = 4;
    //
    //         const params = {
    //           result_type: null,
    //           filter_type: "and",
    //           filter: [
    //             {
    //               field: "num"
    //             },
    //           ]
    //         };
    //
    //         assert.throws(function () {
    //           let wrongSearch = searchCaller.documents(schemaId, params);
    //         }, Error);
    //       }
    //   );
    //
    //   it("searching users (full content) should throw a ChinoException error, because filter is wrong",
    //       function () {
    //         const params = {
    //           result_type: RESULT_TYPES.FULL_CONTENT,
    //           filter_type: "ciao",
    //         };
    //
    //         return searchCaller.users(usrSchemaId, params)
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(400)
    //             })
    //       }
    //   );
    //   it("searching users (count) should throw a ChinoException error, because filter is wrong",
    //       function () {
    //         const filterValue = 2;
    //
    //         const params = {
    //           result_type: RESULT_TYPES.COUNT,
    //           filter_type: "and",
    //           filter: [
    //             {},
    //           ]
    //         };
    //
    //         return searchCaller.users(usrSchemaId, params)
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(400)
    //             })
    //       }
    //   );
    //   it("searching users (username exists) should throw a ChinoException error, because user schema id doesn't exist",
    //       function () {
    //         const filterValue = 2;
    //
    //         const params = {
    //           result_type: RESULT_TYPES.USERNAME_EXISTS,
    //           filter_type: "and",
    //           filter: [
    //             {
    //               field: "username",
    //               type: "eq",
    //               value: "theLoginUser"
    //             },
    //           ]
    //         };
    //
    //         return searchCaller.users(null, params)
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //       }
    //   );
    //   it("searching users (wrong result type) should throw a ChinoException error, because result type is wrong",
    //       function () {
    //         const params = {
    //           result_type: "wrongResultType",
    //           filter_type: "and",
    //           filter: [
    //             {
    //               field: "user",
    //               type: "lte",
    //               value: 3
    //             },
    //           ]
    //         };
    //
    //         assert.throws(function () {
    //           let wrongSearch = searchCaller.users(usrSchemaId, params);
    //         }, Error);
    //       }
    //   );
    // });
});
