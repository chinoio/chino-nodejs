const assert = require("assert");
const should = require("should");

const Auth = require("../../src/auth");
const Perms = require("../../src/perms");
const objects = require("../../src/objects");
const settings = require("./../testsSettings");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

describe('Chino Perms API', function() {
    this.slow(300);
    // change timeout for slow network
    this.timeout(10000);

    const permsCaller = new Perms(baseUrl, customerId, customerKey);
    // keep track of ids to delete them later
    let repoId = "";
    let schemaId = "";
    let docIds = [];

    let groupId = "";
    let usrSchemaId = "";
    let usrIds = [];

    let auth;

    // prepare the environment
    before("Set up resources to test the lib", function () {
        const data = settings.data();

        repoId = data.repoId;
        schemaId = data.schemaId;
        docIds = data.docIds;
        groupId = data.groupId;
        usrSchemaId = data.usrSchemaId;
        usrIds = data.usrIds;

        auth = new Auth(baseUrl, data.appId, data.appKey);
    });

    /* on resources */
    it("Test the granting of permission on resources: should return a Success object", function () {
        const data = {
            action        : "grant",
            resourcesType : "repositories",
            subjectType   : "users",
            subjectId     : usrIds[4],
            permissions   : {
                manage      : ["C", "R", "U", "D"],
                authorize   : ["R"]
            }
        }

        return permsCaller.onResources(data)
            .then((result) => {
                result.should.be.an.instanceOf(objects.Success);
                result.result_code.should.be.equal(200);
            });
    });
    /* on resource */
    it("Test the granting of permission on resource (user schema): should return a Success object", function () {
        const data = {
            action        : "grant",
            resourceType  : "user_schemas",
            resourceId    : usrSchemaId,
            subjectType   : "users",
            subjectId     : usrIds[4],
            permissions   : {
                manage      : ["R"]
            }
        };

        return permsCaller.onResource(data)
            .then((result) => {
                result.should.be.an.instanceOf(objects.Success);
                result.result_code.should.be.equal(200);
            });
    });

    it("Test the granting of permission on resource (document): should return a Success object", function () {
        const data = {
            action        : "grant",
            resourceType  : "documents",
            resourceId    : docIds[4],
            subjectType   : "users",
            subjectId     : usrIds[3],
            permissions   : {
                manage      : ["R", "U"]
            }
        };

        return permsCaller.onResource(data)
            .then((result) => {
                result.should.be.an.instanceOf(objects.Success);
                result.result_code.should.be.equal(200);
            });
    });

    it("Test the granting of permission on resource (group): should return a Success object", function () {
        const data = {
            action        : "grant",
            resourceType  : "schemas",
            resourceId    : schemaId,
            subjectType   : "groups",
            subjectId     : groupId,
            permissions   : {
                manage      : ["R"]
            }
        };

        return permsCaller.onResource(data)
            .then((result) => {
                result.should.be.an.instanceOf(objects.Success);
                result.result_code.should.be.equal(200);
            });
    });

    /* on children */
    it("Test the granting of permission on children of a resource: should return a Success object", function () {
        const data = {
            action        : "grant",
            resourceType  : "schemas",
            resourceId    : schemaId,
            childrenType  : "documents",
            subjectType   : "groups",
            subjectId     : groupId,
            permissions   : {
                manage        : ["R", "U", "L"],
                authorize     : ["R", "A"]
            }
        };

        return permsCaller.onChildren(data)
            .then((result) => {
                result.should.be.an.instanceOf(objects.Success);
                result.result_code.should.be.equal(200);
            });
    });

    /* on view perms */
    it("Test viewing of all permissions assigned to current user: should return a list of Perms object",
        function () {
            return auth.login("theLoginUser", "This1CouldBe_a_StrongPassword!")
                .then((user) => {
                    // need a perms caller from user POV
                    const userPermsCaller = new Perms(baseUrl, user.access_token);

                    return userPermsCaller.getPermissions();
                })
                .then((result) => {
                    result.should.be.an.instanceOf(Array);
                    result.forEach((perm) => {
                        perm.should.be.an.instanceOf(objects.Perms);
                        Object.keys(perm).length.should.be.above(0);
                    });
                });
        });

    it("Test viewing of all permissions assigned to document: should return a list of Perms object",
        function () {
            return permsCaller.getDocumentPermissions(docIds[4])
                .then((result) => {
                    result.should.be.an.instanceOf(Array);
                    result.forEach((perm) => {
                        perm.should.be.an.instanceOf(objects.Perms);
                        Object.keys(perm).length.should.be.above(0);
                    });
                });
        });

    it("Test viewing of all permissions assigned to user: should return a list of Perms object",
        function () {
            return permsCaller.getUserPermissions(usrIds[4])
                .then((result) => {
                    result.should.be.an.instanceOf(Array);
                    result.forEach((perm) => {
                        perm.should.be.an.instanceOf(objects.Perms);
                        Object.keys(perm).length.should.be.above(0);
                    });
                });
        });

    it("Test viewing of all permissions assigned to group: should return a list of Perms object",
        function () {
            return permsCaller.getGroupPermissions(groupId)
                .then((result) => {
                    result.should.be.an.instanceOf(Array);
                    result.forEach((perm) => {
                        perm.should.be.an.instanceOf(objects.Perms);
                        Object.keys(perm).length.should.be.above(0);
                    });
                });
        });

    /* revoke */
    it("Test the revoking of permission on resource (document): should return a Success object", function () {
        const data = {
            action        : "revoke",
            resourceType  : "documents",
            resourceId    : docIds[4],
            subjectType   : "users",
            subjectId     : usrIds[3],
            permissions   : {
                manage      : ["R", "U"]
            }
        };

        return permsCaller.onResource(data)
            .then((result) => {
                result.should.be.an.instanceOf(objects.Success);
                result.result_code.should.be.equal(200);
            });
    });

    /* =================================== */
    /* Test what happen in wrong situation */
    // describe("Test error situations:", function () {
    //   it("should throw a ChinoException object, because perms data are incorrect",
    //       function () {
    //         const data = {
    //           action: "grant",
    //           resourcesType: "repositories",
    //           subjectType: "users", /* the subject id is missing */
    //           permissions: {
    //             manage: ["L", "C", "R", "U", "D"], /* wrong permission on this resource (L) */
    //             authorize: ["R"]
    //           }
    //         }
    //
    //         return permsCaller.onResources(data)
    //             .then((res) => {
    //               throw new Error("This promise shouldn't be fulfilled!")
    //             })
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(400)
    //             })
    //       });
    //
    //   it("should throw a ChinoException object, because perms data are incorrect",
    //       function () {
    //         const data = {
    //           action: "grant",
    //           resourceType: "user_schema", /* eg. typo error: missing 's'*/
    //           resourceId: usrSchemaId,
    //           subjectType: "users",
    //           subjectId: usrIds[4],
    //           permissions: {
    //             manage: ["W"]   /* or wrong permission on this resource */
    //           }
    //         };
    //
    //         return permsCaller.onResource(data)
    //             .then((res) => {
    //               throw new Error("This promise shouldn't be fulfilled!")
    //             })
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(400)
    //             })
    //       }
    //   );
    //
    //   it("should throw a ChinoException object, because perms data are incorrect (empty)",
    //       function () {
    //         const data = {};
    //
    //         return permsCaller.onChildren(data)
    //             .then((res) => {
    //               throw new Error("This promise shouldn't be fulfilled!")
    //             })
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //       }
    //   );
    //   it("should throw a ChinoException object, because this is not an application user",
    //       function () {
    //         return permsCaller.getPermissions()
    //             .then((res) => {
    //               throw new Error("This promise shouldn't be fulfilled!")
    //             })
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(403)
    //             })
    //       });
    //
    //   it("should throw a ChinoException object, because document id doesn't exist",
    //       function () {
    //         return permsCaller.getDocumentPermissions("")
    //             .then((res) => {
    //               throw new Error("This promise shouldn't be fulfilled!")
    //             })
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //       });
    //
    //   it("should throw a ChinoException object, because user id doesn't exist",
    //       function () {
    //         return permsCaller.getUserPermissions(null)
    //             .then((res) => {
    //               throw new Error("This promise shouldn't be fulfilled!")
    //             })
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //       });
    //
    //   it("should throw a ChinoException object, because group id doesn't exist",
    //       function () {
    //         return permsCaller.getGroupPermissions(undefined)
    //             .then((res) => {
    //               throw new Error("This promise shouldn't be fulfilled!")
    //             })
    //             .catch((error) => {
    //               error.should.be.instanceOf(objects.ChinoException)
    //               error.result_code.should.be.equal(404)
    //             })
    //   });
    // });
});