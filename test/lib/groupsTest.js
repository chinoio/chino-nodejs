const assert = require("assert");
const should = require('should');

const Call = require("../../src/apiCall");
const Groups = require("../../src/groups");
const objects = require("../../src/objects");
const settings = require("./../testsSettings");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

describe('Chino Groups API', function() {
    this.slow(300);
    // change timeout for slow network
    this.timeout(5000);

    let apiCaller = new Call(baseUrl, customerId, customerKey);
    let groupCaller = new Groups(baseUrl, customerId, customerKey);
    // keep track of ids to delete them later
    let usrSchemaId = "";
    let gId = "";
    let usersId = [];
    let elements = 0;

    // prepare the environment
    before("Set up resources to test the lib", function () {
        const data = settings.data();

        usrSchemaId = data.usrSchemaId;
        usersId = data.usrIds;
        elements = data.elements;
    });

    /* create */
    it("Test the creation of a group: should return a Group object",
        function () {
            let group = {
                group_name: "Group Test",
                attributes: {
                    description: "This is a test group"
                }
            };

            return groupCaller.create(group)
                .then((result) => {
                    gId = result.group_id;

                    result.should.be.an.instanceOf(objects.Group);
                    Object.keys(result).length.should.be.above(0);
                })
        }
    );
    /* details */
    it("Test the retrieving of group information: should return a Group object",
        function () {
            return groupCaller.details(gId)
                .then((result) => {
                    result.should.be.an.instanceOf(objects.Group);
                    Object.keys(result).length.should.be.above(0);
                })
        }
    );
    /* list */
    it("Test the listing of groups: should return a list of Users",
        function () {
            return groupCaller.list()
                .then((result) => {
                    result.should.be.an.instanceOf(objects.ChinoList);
                    result.count.should.be.above(0);
                    result.total_count.should.be.above(0);
                    result.list.forEach((group) => {
                        group.should.be.an.instanceOf(objects.Group);
                    });
                    // one inserted now and one already online
                    result.list.length.should.equal(2);
                });
        }
    );
    /* update */
    it("Test the update of group information: should return a Group object",
        function () {
            let newGroup = {
                group_name: "Group Test Update",
                attributes: {
                    description: "This is a test group"
                }
            };

            return groupCaller.update(gId, newGroup)
                .then((result) => {
                    result.should.be.an.instanceOf(objects.Group);
                    Object.keys(result).length.should.be.above(0);
                    result.group_name.should.be.equal("Group Test Update");
                })
        }
    );

    /* insert user */
    it("Test the insertion of a user inside a group: should return a Success message",
        function () {
            return groupCaller.insertUser(gId, usersId[elements-1])
                .then((result) => {
                    result.should.be.an.instanceOf(objects.Success);

                    return apiCaller.get(`/users/${usersId[elements-1]}`)
                        .then((res) => {
                            res.data.user.groups.should.containEql(gId);
                        })
                })
        }
    );

    /* remove user */
    it("Test the removal of a user from a group: should return a Success message",
        function () {
            return groupCaller.removeUser(gId, usersId[elements-1])
                .then((result) => {
                    result.should.be.an.instanceOf(objects.Success);
                    result.result_code.should.be.equal(200);
                })
        }
    );

    /* delete */
    it("Test the deletion of a group: should return a Success message",
        function () {
            return groupCaller.delete(gId, true)
                .then((result) => {
                    result.should.be.an.instanceOf(objects.Success);
                    result.result_code.should.be.equal(200);
                })
        }
    );

    /* =================================== */
    /* Test what happen in wrong situation */
    // describe("Test error situations:", function () {
    //   it("should throw a ChinoException object, because group information are incorrect",
    //       function () {
    //         let group = {}
    //
    //         return groupCaller.create(group)
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(400)
    //             })
    //       }
    //   );
    //   it("should throw a ChinoException object, because group id doesn't exist",
    //       function () {
    //         return groupCaller.details("")
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //       }
    //   );
    //   it("should throw a ChinoException object, because listing parameter are wrong (wrong offset)",
    //       function () {
    //         return groupCaller.list(-1)
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(400)
    //             })
    //       }
    //   );
    //   it("should throw a ChinoException object, because group information are incorrect",
    //       function () {
    //         let newGroup = {
    //           attributes: {
    //             description: "This is a test group"
    //           }
    //         }
    //
    //         return groupCaller.update(gId, newGroup)
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //       }
    //   );
    //   it("should throw a ChinoException object, because group id doesn't exist",
    //       function () {
    //         return groupCaller.insertUser("", usersId[elements-1])
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //       }
    //   );
    //   it("should throw a ChinoException object, because group id doesn't exist",
    //       function () {
    //         return groupCaller.removeUser(gId, usersId[elements-1])
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //       }
    //   );
    //   it("should throw a ChinoException object, because group id doesn't exist",
    //       function () {
    //         return groupCaller.delete(gId, true)
    //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //       }
    //   );
    // });
});