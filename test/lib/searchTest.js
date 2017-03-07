/**
 * Created by daniele on 06/03/17.
 */

const assert = require("assert");
const should = require('should');

const objects = require("../../src/objects");
const credentials = require("./testsSettings");
const RESULT_TYPES = require("../../src/resultTypes");
const Call = require("../../src/apiCall");
const Search = require("../../src/search");

const baseUrl     = credentials.baseUrl;
const customerId  = credentials.customerId;
const customerKey = credentials.customerKey;

describe('Chino Search API', function() {
  // change timeout for slow network
  this.timeout(10000);

  const apiCall = new Call(baseUrl, customerId, customerKey);
  const searchCaller = new Search(baseUrl, customerId, customerKey);
  // keep track of ids to delete them later
  let repoId = "";
  let schemaId = "";
  let documentIds = [];

  let usrSchemaId = "";
  let usrIds = [];

  // wait some time before resolve Promise
  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  // prepare the environment
  before("Set up resources to test the lib", function () {
    /* create user schema and insert a user */
    const repo = {
      description : "Repository for testing Search lib",
    };

    const schema = {
      description: "Schema for testing Search lib",
      structure: {
        fields: [
          {
            name: "info",
            type: "string",
          },
          {
            name: "num",
            type: "integer",
            indexed: true
          },
        ]
      }
    };

    // create an array of 10 element from 1 to 5
    const ids = Array.from(new Array(5), (val,index) => index+1);

    // return a doc Js representation
    let doc = (id) => ({
      content: {
        info : `document test ${id}`,
        num : id
      }
    });

    /* create user schema and insert a user */
    let userSchema = {
      description : "User Schema for testing Search lib",
      structure : {
        fields : [
          {
            type : "integer",
            name : "user",
            indexed: true
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

    // wait to resolve 2 promises
    return Promise.all([
      apiCall.post("/user_schemas", userSchema)
        .then((res) => {
          usrSchemaId = res.data.user_schema.user_schema_id;

          if (usrSchemaId) {
            return Promise.all(ids.map(id => apiCall.post(`/user_schemas/${usrSchemaId}/users`, user(id))))
                .then((res) => {
                  res.forEach(r => { usrIds.push(r.data.user.user_id); });
                })
                .catch((err) => console.log(`Error inserting user\n${JSON.stringify(err)}`));
          }
        })
        .catch((err) => console.log(`${err}\nNo user schema created`)),

      apiCall.post("/repositories", repo)
        .then((res) => {
          repoId = res.data.repository.repository_id;

          if (repoId) {
            return apiCall.post(`/repositories/${repoId}/schemas`, schema)
                .then((res) => {
                  schemaId = res.data.schema.schema_id;

                  if (schemaId) {
                    return Promise.all(ids.map(id => apiCall.post(`/schemas/${schemaId}/documents`, doc(id))))
                        .then((res) => {
                          res.forEach(r => { documentIds.push(r.data.document.document_id); });
                        })
                        .catch((err) => console.log(`Error inserting documents\n${err}`));
                  }
                  else {
                    throw new Error("No schema created");
                  }
                })
                .catch((err) => console.log(`err\nNo schema created`));
          }
        })
        .catch((err) => console.log(`err\nNo repository created`))
    ]).then(() => sleep(1500)); // need to wait, so server is able to
  });

  /* Search Documents */
  describe("Search Documents", function () {
    it("Test the searching of documents from a schema: should return a list of Documents",
        function () {
          const filterValue = 2;

          const params = {
            result_type: RESULT_TYPES.FULL_CONTENT,
            filter_type: "and",
            filter: [
              {
                field: "num",
                type: "lte",
                value: filterValue
              },
            ]
          };

          return searchCaller.documents(schemaId, params)
            .then((result) => {
              // console.log(JSON.stringify(result))
              result.should.be.an.instanceOf(Array);
              result.forEach((doc) => {
                doc.should.be.an.instanceOf(objects.Document);
                doc.schema_id.should.be.eql(schemaId);
                doc.content.num.should.be.belowOrEqual(filterValue);
              });

              result.length.should.equal(filterValue);
            });
        }
    );
  });

  /* Search Users */
  describe("Search Users", function () {
    it("Test the searching of users from a user schema: should return true",
        function () {
          const filterValue = 2;

          const params = {
            result_type: RESULT_TYPES.EXISTS,
            filter_type: "and",
            filter: [
              {
                field: "user",
                type: "lte",
                value: filterValue
              },
            ]
          };

          return searchCaller.users(usrSchemaId, params)
              .then((result) => {
                result.data.exists.should.be.equal(true);
              });
        }
    );
  });

  // clean the environment
  after("Remove test resources", function () {
    // be sure to have enough time
    this.timeout(10000);

    return sleep(1000).then(() => {
      if (schemaId !== "") {
        return Promise.all([
          apiCall.del(`/schemas/${schemaId}?force=true&all_content=true`)
            .then(res => {
              if (repoId !== "") {
                return apiCall.del(`/repositories/${repoId}?force=true`)
                    .then(res => { /*console.log("Removed stub stuff")*/ })
                    .catch(err => { console.log(`Error removing repository resources`) });
              }
            })
            .catch(err => { console.log(`Error removing test resources`) }),
          apiCall.del(`/user_schemas/${usrSchemaId}?force=true`)
        ]);
      }
    });
  });
});