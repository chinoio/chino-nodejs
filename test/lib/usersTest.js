/**
 * Created by daniele on 24/02/17.
 */

const assert = require("assert");
const should = require('should');

let baseUrl;
let customerId;
let customerKey;
let Users;
let objects;
let usrSchemaId;
let usersBefore;
/** Users library test */
module.exports.runTest = function (credentials, objectsChino, usersLib, data) {
  baseUrl = credentials.baseUrl;
  customerId = credentials.customerId;
  customerKey = credentials.customerKey;
  Users = usersLib;
  objects = objectsChino;
  usrSchemaId = data.usrSchemaId;
  usersBefore = data.users;
}

describe('Chino Users API', function () {
  // change timeout for slow network
  this.timeout(5000);

  let userCaller = new Users(baseUrl, customerId, customerKey);
  // keep track of id to delete it later
  let usrId = "";

  /* create */
  it("Test the creation of a user: should return a User object",
      function () {
        const user = {
          username: "aSecondUser",
          password: "aPassword2",
          attributes: {
            user: "Daniele"
          },
          is_active: true
        }

        return userCaller.create(usrSchemaId, user)
            .then((result) => {
              // save id
              usrId = result.user_id;
              result.should.be.an.instanceOf(objects.User);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* details */
  it("Test the retrieving of user information: should return a User object",
      function () {
        return userCaller.details(usrId)
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
              result.length.should.equal(usersBefore+1);
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
            user: "Daniele"
          },
          is_active: true
        }

        return userCaller.update(usrId, newUser)
            .then((result) => {
              result.should.be.an.instanceOf(objects.User);
              Object.keys(result).length.should.be.above(0);
              result.username.should.be.equal("aThirdUser");
            })
      }
  );
  /* patch */
  it("Test the patch of user information: should return a User object",
      function () {
        let user = {
          attributes: {
            user: "Daniele B"
          }
        }

        return userCaller.patch(usrId, user)
            .then((result) => {
              result.should.be.an.instanceOf(objects.User);
              Object.keys(result).length.should.be.above(0);
              result.attributes.user.should.be.equal("Daniele B");
            })
      }
  );
  /* delete */
  it("Test the deletion of a user: should return a success message",
      function () {
        return userCaller.delete(usrId, true)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);
              result.result_code.should.be.equal(200);
            })
      }
  );
});