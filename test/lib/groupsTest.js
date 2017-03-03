/**
 * Created by daniele on 24/02/17.
 */

const assert = require("assert");
const should = require('should');

const Call = require("./src/apiCall");
const objects = require("./src/objects");
const Groups = require("./src/groups");

const baseUrl     = "https://api.test.chino.io/v1";
const customerId  = process.env.CHINO_ID;   // insert here your Chino Customer ID
const customerKey = process.env.CHINO_KEY;  // insert here your Chino Customer KEY

describe('Chino Groups API', function() {
  // change timeout for slow network
  this.timeout(5000);

  let apiCall = new Call(baseUrl, customerId, customerKey);
  let groupCaller = new Groups(baseUrl, customerId, customerKey);
  // keep track of ids to delete them later
  let usrSchemaId = "";
  let gId = "";
  let usersId = [];

  // prepare the environment
  before("Set up resources to test the lib", function () {
    /* create user schema and insert a user */
    const userSchema = {
      description : "User Schema for testing Groups lib",
      structure : {
        fields : [
          {
            type : "integer",
            name : "user"
          }
        ]
      }
    };
    let user = (id) => ({
      username: `aUser${id}`,
      password: `aPassword+${id}`,
      attributes: {
        user: id
      },
      is_active: true
    });

    const ids = [1,2,3];

    // create a user schema and insert inside 3 user
    return apiCall.post("/user_schemas", userSchema)
        .then((res) => {
          usrSchemaId = res.data.user_schema.user_schema_id;

          if (usrSchemaId) {
            return Promise.all(ids.map(id => apiCall.post(`/user_schemas/${usrSchemaId}/users`, user(id))))
                .then((res) => {
                  res.forEach(r => { usersId.push(r.data.user.user_id); });
                })
                .catch((err) => console.log(`Error inserting user\n${err}`));
          }
        })
        .catch((err) => console.log(`{err}\nNo user schema created`));
  });

  /* create */
  it("Test the creation of a group: should return a Group object",
      function () {
        let group = {
          group_name: "Group Test",
              attributes: {
            description: "This is a test group"
          }
        }

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
              result.should.be.an.instanceOf(Array);
              result.forEach((group) => {
                group.should.be.an.instanceOf(objects.Group);
              });
              // in this case we have inserted 1 group so it should have 1 group
              result.length.should.equal(1);
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
        }

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
        return groupCaller.insertUser(gId, usersId[0])
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);

              return apiCall.get(`/users/${usersId[0]}`)
                  .then((result) => {
                    result.data.user.groups.should.containEql(gId)
                  })
                  .catch((err) => { console.log(`${err} Error retrieving user`); });
            })
            .catch((err) => {console.log(JSON.stringify((err))); });
      }
  );

  /* remove user */
  it("Test the removal of a user from a group: should a success message",
      function () {
        return groupCaller.removeUser(gId, usersId[0])
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);
              result.result_code.should.be.equal(200);
            })
      }
  );

  /* delete */
  it("Test the deletion of a group: should a success message",
      function () {
        return groupCaller.delete(gId, true)
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
      if (usrSchemaId !== "") {
        return apiCall.del(`/user_schemas/${usrSchemaId}?force=true`)
            .then(res => { /*console.log("Removed stub stuff")*/ })
            .catch(err => { console.log(`Error removing test resources`) });
      }
    });
  });
});