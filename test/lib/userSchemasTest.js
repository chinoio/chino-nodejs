/**
 * Created by daniele on 02/03/17.
 */

const assert = require("assert");
const should = require('should');

const objects = require("./src/objects");
const credentials = require("./testsSettings");
const UserSchemas = require("./src/userSchemas");

const baseUrl     = credentials.baseUrl;
const customerId  = credentials.customerId;
const customerKey = credentials.customerKey;

describe('Chino User Schemas API', function() {
  // change timeout for slow network
  this.timeout(5000);

  let usCaller = new UserSchemas(baseUrl, customerId, customerKey);
  // keep track of ids for getting details later
  let usrSchemaID = "";

  /* create */
  it("Test the creation of a user schema: should return a User Schema object",
      function () {
        const userSchema = {
          description: "User schema test",
          structure: {
            fields: [
              {
                type : "string",
                name : "job"
              },
              {
                type : "date",
                name : "application",
                indexed : true
              }
            ]
          }
        };

        return usCaller.create(userSchema)
            .then((result) => {
              usrSchemaID = result.user_schema_id;

              result.should.be.an.instanceOf(objects.UserSchema);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* details */
  it("Test the retrieving of user schema information: should return a User Schema object",
      function () {
        return usCaller.details(usrSchemaID)
            .then((result) => {
              result.should.be.an.instanceOf(objects.UserSchema);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* list */
  it("Test the listing of user schemas: should return a list of User Schemas",
      function () {
        return usCaller.list()
            .then((result) => {
              result.should.be.an.instanceOf(Array);
              result.forEach((userSchema) => {
                userSchema.should.be.an.instanceOf(objects.UserSchema);
              });
              // in this case we have inserted 1 user schema
              // so it should have 1 user schema
              result.length.should.equal(1);
            });
      }
  );
  /* update */
  it("Test the update of user information: should return a User object",
      function () {
        const newUS = {
          description: "User schema test edited",
          structure: {
            fields: [
              {
                type : "string",
                name : "job"
              },
              {
                type : "integer",
                name : 3
              },
              {
                type : "date",
                name : "application",
                indexed : true
              }
            ]
          }
        };

        return usCaller.update(usrSchemaID, newUS)
            .then((result) => {
              result.should.be.an.instanceOf(objects.UserSchema);
              Object.keys(result).length.should.be.above(0);
              result.description.should.be.equal("User schema test edited");
            })
      }
  );

  /* delete */
  it("Test the deletion of a user: should return a success message",
      function () {
        assert(usrSchemaID !== "", "Selected user schema doesn't exist.")

        return usCaller.delete(usrSchemaID, true)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);
              result.result_code.should.be.equal(200);
            })
      }
  );
});