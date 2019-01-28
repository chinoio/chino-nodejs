const assert = require("assert");
const should = require('should');

const objects = require("../../src/objects");
const settings = require("./../testsSettings");
const UserSchemas = require("../../src/userSchemas");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

describe('Chino UserSchemas API', function() {
  this.slow(300);
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
            });
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
              result.should.be.an.instanceOf(objects.ChinoList);
              result.count.should.be.above(0);
              result.total_count.should.be.above(0);
              result.list.forEach((userSchema) => {
                userSchema.should.be.an.instanceOf(objects.UserSchema);
              });
              // one inserted now and one already online
              result.list.length.should.equal(2);
            });
      }
  );
  /* update */
  it("Test the update of user information: should return a User Schema object",
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
                name : "int_field"
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

  /* =================================== */
  /* Test what happen in wrong situation */
  // describe("Test error situations:", function () {
  //   it("should throw a ChinoException error while creating user schema, because user schema data are incorrect",
  //       function () {
  //         const userSchema = {
  //           description: "User schema test"
  //         };
  //
  //         return usCaller.create(userSchema)
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException)
  //               error.result_code.should.be.equal(400)
  //             })
  //       }
  //   );
  //   it("should throw a ChinoException error while getting user schema details, because user schema id doesn't exist",
  //       function () {
  //         return usCaller.details(null)
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException)
  //               error.result_code.should.be.equal(404)
  //             })
  //       }
  //   );
  //   it("should throw a ChinoException error while listing user schemas, because offset and limit parameters are wrong",
  //       function () {
  //         return usCaller.list(-1, -4)
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException)
  //               error.result_code.should.be.equal(400)
  //             })
  //       }
  //   );
  //   it("should throw a ChinoException error while updating user schema details, because user schema id doesn't exist",
  //       function () {
  //         const newUS = {
  //           description: "User schema test edited",
  //           structure: {
  //             fields: [
  //               {
  //                 type : "string",
  //                 name : "job"
  //               },
  //               {
  //                 type : "integer",
  //                 name : 3
  //               },
  //               {
  //                 type : "date",
  //                 name : "application",
  //                 indexed : true
  //               }
  //             ]
  //           }
  //         };
  //
  //         return usCaller.update("", newUS)
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException)
  //               error.result_code.should.be.equal(404)
  //             })
  //       }
  //   );
  //   it("should throw a ChinoException error while deleting user schema details, because user schema id doesn't exist", // TODO fails
  //       function (done) {
  //         return usCaller.delete(usrSchemaID, true)
  //             .then((res) => {
  //                 throw new Error("This promise shouldn't be fulfilled!");
  //             })
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException);
  //               error.result_code.should.be.equal(404);
  //               done();
  //             });
  //       }
  //   );
  // });
});