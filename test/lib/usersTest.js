const assert = require("assert");
const should = require('should');

const Auth = require("../../src/auth");
const Users = require("../../src/users");
const objects = require("../../src/objects");
const settings = require("./../testsSettings");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

describe('Chino Users API', function () {
  this.slow(300);
  // change timeout for slow network
  this.timeout(5000);

  let userCaller = new Users(baseUrl, customerId, customerKey);
  let auth;

  // keep track of id to delete it later
  let usrSchemaId = "";
  let usrId2 = "";
  let elements = 0;

  before(function () {
    const data = settings.data();

    usrSchemaId = data.usrSchemaId;
    appId = data.appId;
    appKey = data.appKey;
    elements = data.elements;

    auth = new Auth(baseUrl, appId, appKey);
  })

  /* create */
  it("Test the creation of a user: should return a User object",
      function () {
        const user = {
          username: "adminUser",
          password: "aStrongPassword",
          attributes: {
            user: 3
          },
          is_active: true
        }

        return userCaller.create(usrSchemaId, user)
            .then((result) => {
              // save id
              usrId2 = result.user_id;
              result.should.be.an.instanceOf(objects.User);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );

  /* current details */
  it("Test the retrieving of current user details: should return a User object",
      function () {
        return auth.login("adminUser", "aStrongPassword")
            .then((result) => {
              // create a caller for the current logged in user
              let currentUserCaller = new Users(baseUrl, result.access_token);

              return currentUserCaller.current()
                .then((result) => {
                  result.should.be.an.instanceOf(objects.User);
                  Object.keys(result).length.should.be.above(0);
                })
            })

      }
  );

  /* details */
  it("Test the retrieving of user information: should return a User object",
      function () {
        return userCaller.details(usrId2)
            .then((result) => {
              result.should.be.an.instanceOf(objects.User);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* list */
  it("Test the listing of users contained into a schema: should return a list of Users",
      function () {
        assert(usrSchemaId, "User schema not defined");
        return userCaller.list(usrSchemaId)
            .then((result) => {
              result.should.be.an.instanceOf(Array);
              result.forEach((user) => {
                user.should.be.an.instanceOf(objects.User);
              });
              // in this case we have inserted 1 user more than before
              result.length.should.equal(elements+1);
            });
      }
  );
  /* update */
  it("Test the update of user information: should return a User object",
      function () {
        const newUser = {
          username: "aThirdUser",
          password: "aPassword3",
          attributes: {
            user: 21
          },
          is_active: true
        }

        return userCaller.update(usrId2, newUser)
            .then((result) => {
              result.should.be.an.instanceOf(objects.User);
              Object.keys(result).length.should.be.above(0);
              result.username.should.be.equal("aThirdUser");
            })
      }
  );
  /* partialUpdate */
  it("Test the partialUpdate of user information: should return a User object",
      function () {
        let user = {
          attributes: {
            user: 42
          }
        }

        return userCaller.partialUpdate(usrId2, user)
            .then((result) => {
              result.should.be.an.instanceOf(objects.User);
              Object.keys(result).length.should.be.above(0);
              result.attributes.user.should.be.equal(42);
            })
      }
  );
  /* delete */
  it("Test the deletion of a user: should return a success message",
      function () {
        return userCaller.delete(usrId2, true)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);
              result.result_code.should.be.equal(200);
            })
      }
  );
});