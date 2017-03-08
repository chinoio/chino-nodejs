/*                     *\
*        TEST OF        *
*   CHINO NODE JS SDK   *
\*                     */

const assert = require("assert");

// get SDK needed libraries
const Call = require("../src/apiCall");
const objects = require("../src/objects");
const Users = require("../src/users");

// get test libraries

const credentials = {
  baseUrl : "https://api.dev.chino.io/v1",
  customerId  : process.env.CHINO_ID,  // insert here your Chino Customer ID
  customerKey : process.env.CHINO_KEY // insert here your Chino Customer KEY
}

/* Set up the environment for next tests. Need:
  - a repository
  - a schema
  - at least 5 documents
  - a user_schema
  - at least 5 users
  - a group
  - a collection
  - an application
* */

// choose number of users and documents to create
const elements = 7;

//resources ids
let repoId = "";
let schemaId = "";
let docIds = [];
let collId = "";

let usrSchemaId = "";
let usrIds = [];
let groupId = "";

let appId = "";
let appSecret = "";

const apiCall =
    new Call(credentials.baseUrl, credentials.customerId, credentials.customerKey);

let result1 = require("./prepare")(apiCall);
console.log("Res1: " + JSON.stringify(result1));

describe("CHINO Node JS SDK test", function () {
  this.timeout(10000);

  console.log("nribn8vg");


  /* =========== TESTS =========== */
  // describe("Start testing...", function () {
  //   // test base classes that don't require to connect to CHINO APIs
  //   // require("./lib/baseClassTest")(credentials);
  //   // require("./lib/objectsTest")(credentials, objects);
  //   // // test class on which is based all other libs
  //   // require("./lib/callsTest")(credentials, objects, Call);
  //
  //   // test SDK libraries
  //   assert(usrSchemaId !== "");
  //   require("./lib/usersTest")(credentials, objects, Users, {usrSchemaId, elements});
  //   // require("./lib/userSchemasTest");
  //   // require("./lib/groupsTest");
  //   // require("./lib/applicationsTest");
  //   // require("./lib/repositoriesTest");
  //   // require("./lib/schemasTest");
  //   // require("./lib/documentsTest");
  //   // require("./lib/collectionsTest");
  //   // require("./lib/searchTest");
  // })
  //
  // /* ============================= */
  //
  //
});