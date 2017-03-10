const assert = require("assert");
const should = require("should");

const Perms = require("../../src/perms");
const objects = require("../../src/objects");
const settings = require("./../testsSettings");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

describe('Chino Perms API', function() {
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

  // prepare the environment
  before("Set up resources to test the lib", function () {
    const data = settings.data();

    repoId = data.repoId;
    schemaId = data.schemaId;
    docIds = data.docIds;
    groupId = data.groupId;
    usrSchemaId = data.usrSchemaId;
    usrIds = data.usrIds;
  });

  /* on resources */
  it("Test the granting of permission on resources: should return a Success object", function () {
    const manage = ["C", "R", "U", "D"];
    const authorize = ["R"];

    return permsCaller.onResources(
        "grant",
        objects.name.REPOSITORIES,
        objects.name.USERS,
        usrIds[4],
        manage,
        authorize
    )
    .then((result) => {
      result.should.be.an.instanceOf(objects.Success);
      result.result_code.should.be.equal(200);
    });
  });
  /* on resource */
  it("Test the granting of permission on resource (user schema): should return a Success object", function () {
    const manage = ["R"];

    return permsCaller.onResource(
        "grant",
        objects.name.USER_SCHEMAS,
        usrSchemaId,
        objects.name.USERS,
        usrIds[4],
        manage
    )
    .then((result) => {
      result.should.be.an.instanceOf(objects.Success);
      result.result_code.should.be.equal(200);
    });
  });

  it("Test the granting of permission on resource (document): should return a Success object", function () {
    const manage = ["R", "U"];

    return permsCaller.onResource(
        "grant",
        objects.name.DOCUMENTS,
        docIds[4],
        objects.name.USERS,
        usrIds[3],
        manage
    )
    .then((result) => {
      result.should.be.an.instanceOf(objects.Success);
      result.result_code.should.be.equal(200);
    });
  });

  it("Test the granting of permission on resource (group): should return a Success object", function () {
    const manage = ["R"];

    return permsCaller.onResource(
        "grant",
        objects.name.SCHEMAS,
        schemaId,
        objects.name.GROUPS,
        groupId,
        manage
    )
    .then((result) => {
      result.should.be.an.instanceOf(objects.Success);
      result.result_code.should.be.equal(200);
    });
  });

  /* on children */
  it("Test the granting of permission on children of a resource: should return a Success object", function () {
    const manage = ["R", "U", "L"];
    const authorize = ["R", "A"];

    return permsCaller.onChildren(
        "grant",
        objects.name.SCHEMAS,
        schemaId,
        objects.name.DOCUMENTS,
        objects.name.GROUPS,
        groupId,
        manage,
        authorize
    )
    .then((result) => {
      result.should.be.an.instanceOf(objects.Success);
      result.result_code.should.be.equal(200);
    });
  });
  /* on view perms */
  // TODO: need to use Bearer auth to test
  it.skip("Test viewing of all permissions assigned to current user: should return a list of Perms object",
      function () {
        return permsCaller.getPermissions()
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
});