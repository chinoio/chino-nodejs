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
        resourcesType : objects.name.REPOSITORIES,
        subjectType   : objects.name.USERS,
        subjectId     : usrIds[4],
        manage        : ["C", "R", "U", "D"],
        authorize     : ["R"]
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
      resourceType  : objects.name.USER_SCHEMAS,
      resourceId    : usrSchemaId,
      subjectType   : objects.name.USERS,
      subjectId     : usrIds[4],
      manage        : ["R"]
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
      resourceType  : objects.name.DOCUMENTS,
      resourceId    : docIds[4],
      subjectType   : objects.name.USERS,
      subjectId     : usrIds[3],
      manage        : ["R", "U"]
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
      resourceType  : objects.name.SCHEMAS,
      resourceId    : schemaId,
      subjectType   : objects.name.GROUPS,
      subjectId     : groupId,
      manage        : ["R"]
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
      resourceType  : objects.name.SCHEMAS,
      resourceId    : schemaId,
      childrenType  : objects.name.DOCUMENTS,
      subjectType   : objects.name.GROUPS,
      subjectId     : groupId,
      manage        : ["R", "U", "L"],
      authorize     : ["R", "A"]
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
      resourceType  : objects.name.DOCUMENTS,
      resourceId    : docIds[4],
      subjectType   : objects.name.USERS,
      subjectId     : usrIds[3],
      manage        : ["R", "U"]
    };

    return permsCaller.onResource(data)
        .then((result) => {
          result.should.be.an.instanceOf(objects.Success);
          result.result_code.should.be.equal(200);
        });
  });
});