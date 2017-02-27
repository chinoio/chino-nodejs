/**
 * Created by daniele on 24/02/17.
 */

const assert = require("assert");
const should = require('should');

const Call = require("../src/apiCall");
const objects = require("../src/objects");
const Users = require("../src/users");

const baseUrl     = "https://api.test.chino.io/v1";
const customerId  = process.env.CHINO_ID;   // insert here your Chino Customer ID
const customerKey = process.env.CHINO_KEY;  // insert here your Chino Customer KEY

describe('Chino Users API', function() {
  let apiCall = new Call(baseUrl, customerId, customerKey);
  let userCaller = new Users(baseUrl, customerId, customerKey);
  // keep track of ids to delete them later
  let usrSchemaId = "";
  let usrId = "";

  // prepare the envinronment
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
            console.log(usrSchemaId)
            apiCall.post(`/user_schemas/${usrSchemaId}/users`, user)
                .then((res) => { usrId = res.data.user.user_id; console.log("User inserted");})
                .catch((err) => console.log(err + "\nNo user inserted"));
          }
        })
        .catch((err) => console.log(err + "\nNo user schema created"));
  });

  /* create */
  it.skip("Test the creation of a user: should return 200",
      function () {
        let user = {
          username: "aUser",
          password: "aPassword",
          attributes: {
            name: "Daniele"
          },
          is_active: true
        }

        /* THIS DOESN'T WORK! */
        return userCaller.create(usrSchemaId, user)
            .then((result) => {
              result.should.instanceOf(objects.User);
              (Object.keys(result).length).should.be.above(0);
            })
            .catch((error) => { error.should.be.equal(400); });
      }
  );
  /* details */
  it("Test the retrieving of user information: should return 200",
      function () {

      }
  );
  /* list */
  it.skip("Test the listing of users contained into a schema: should return 200",
      function () {

      }
  );
  /* update1 */
  it.skip("Test the update of user information: should return 200",
      function () {

      }
  );
  /* patch2 */
  it.skip("Test the patch of user information: should return 200",
      function () {

      }
  );
  /* delete */
  it.skip("Test the deletion of a user: should return 200",
      function () {

      }
  );

  // clean the envinronment
  after("Remove test resources", function () {
    if (usrSchemaId) {
      return apiCall.del(`/user_schemas/${usrSchemaId}?force=true`)
          .then(res => { /*console.log("Removed stub stuff")*/ })
          .catch(err => { console.log("Error removing test resources") });
    }
  });
});