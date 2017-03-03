/**
 * Created by daniele on 24/02/17.
 */

const assert = require("assert");
const should = require('should');

const Call = require("./src/apiCall");
const objects = require("./src/objects");
const Users = require("./src/users");

const baseUrl     = "https://api.test.chino.io/v1";
const customerId  = process.env.CHINO_ID;   // insert here your Chino Customer ID
const customerKey = process.env.CHINO_KEY;  // insert here your Chino Customer KEY

describe('Chino Users API', function() {
  // change timeout for slow network
  this.timeout(5000);

  let apiCall = new Call(baseUrl, customerId, customerKey);
  let userCaller = new Users(baseUrl, customerId, customerKey);
  // keep track of ids to delete them later
  let usrSchemaId = "";
  let usrId = "";

  // prepare the environment
  before("Set up resources to test the lib", function () {
    /* create user schema and insert a user */
    let userSchema = {
      description : "User Schema for testing Users lib",
      structure : {
        fields : [
          {
            type : "string",
            name : "user"
          }
        ]
      }
    };
    let user = {
      username: "aUser",
      password: "aPassword",
      attributes: {
        user: "TestUser"
      },
      is_active: true
    };

    return apiCall.post("/user_schemas", userSchema)
        .then((res) => {
          usrSchemaId = res.data.user_schema.user_schema_id;

          if (usrSchemaId) {
            return apiCall.post(`/user_schemas/${usrSchemaId}/users`, user)
                .then((res) => { usrId = res.data.user.user_id; })
                .catch((err) => console.log(`No user inserted\n${err}`));
          }
        })
        .catch((err) => console.log(err + "\nNo user schema created"));
  });

  /* create */
  it("Test the creation of a user: should return a User object",
      function () {
        let user = {
          username: "aSecondUser",
          password: "aPassword2",
          attributes: {
            user: "Daniele"
          },
          is_active: true
        }

        return userCaller.create(usrSchemaId, user)
            .then((result) => {
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
              // in this case we have inserted 2 user so it should have 2 users
              result.length.should.equal(2);
            });
      }
  );
  /* update */
  it("Test the update of user information: should return a User object",
      function () {
        let user = {
          username: "aThirdUser",
          password: "aPassword3",
          attributes: {
            user: "Daniele"
          },
          is_active: true
        }

        return userCaller.update(usrId, user)
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
            user: "Daniele Bissoli"
          }
        }

        return userCaller.patch(usrId, user)
            .then((result) => {
              result.should.be.an.instanceOf(objects.User);
              Object.keys(result).length.should.be.above(0);
              result.attributes.user.should.be.equal("Daniele Bissoli");
            })
      }
  );
  /* delete */
  it("Test the deletion of a user: should a success message",
      function () {
        return userCaller.delete(usrId, true)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);
              result.result_code.should.be.equal(200);
            })
      }
  );

  // clean the envinronment
  after("Remove test resources", function () {
    // be sure to have enough
    this.timeout(10000);

    function sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    return sleep(1000).then(() => {
      if (usrSchemaId !== "" && usrId !== "") {
        return apiCall.del(`/user_schemas/${usrSchemaId}?force=true`)
            .then(res => { /*console.log("Removed stub stuff")*/ })
            .catch(err => { console.log(`Error removing test resources`) });
      }
    });
  });
});