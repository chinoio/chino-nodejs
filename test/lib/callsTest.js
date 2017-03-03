/**
 * Created by daniele on 23/02/17.
 */

const assert = require("assert");
const should = require('should');

const credentials = require("./testCredentials");
const Call = require("./src/apiCall.js");

const baseUrl     = "https://api.test.chino.io/v1";
const customerId  = credentials.customerId;
const customerKey = credentials.customerKey;

const appId = process.env.APP_ID;     // insert here your Chino Application ID
const appKey = process.env.APP_KEY;   // insert here your Chino Application KEY

// utils functions
function s200(res) {
  return res["result_code"].should.be.equal(200);
}
function e400(res) {
  return res["result_code"].should.be.equal(400);
}
function e401(err) {
  return err["result_code"].should.be.equal(401);
}
function e404(err) {
  return err["result_code"].should.be.equal(404);
}

describe('Chino API Call', function() {
  this.timeout(5000);
  let repId = "";

  // keep track of ids to delete them later
  let ushId = "";
  let usrId = "";

  /* ==================================== */
  before("Create user schema and insert user", function () {
    let apiCall = new Call(baseUrl, customerId, customerKey);
    let userSchema = {
      description: "Test User Schema",
      structure: {
        fields: [
          {
            type : "integer",
            name : "user"
          }
        ]
      }
    };
    let user = {
      username: "aUser",
      password: "aPassword",
      attributes: {
        user: 1
      },
      is_active: true
    };

    return apiCall.post("/user_schemas", userSchema)
        .then((res) => {
          ushId = res.data.user_schema.user_schema_id;

          if (ushId) {
            apiCall.post(`/user_schemas/${ushId}/users`, user)
              .then((res) => { usrId = res.data.user.user_id; })
              .catch((err) => console.log("No user inserted"));
          }
        })
        .catch((err) => console.log("No user schema created"));
  });
  /* ==================================== */

  // test each method with a specific result
  describe('GET', function() {
    it('Correct call: should return 200', function() {
      let apiCall = new Call(baseUrl, customerId, customerKey);

      return apiCall.get("/collections").then(s200);
    });

    it('Wrong auth: should return 401', function() {
      let apiCall = new Call(baseUrl, customerId, "");

      return apiCall.get("/collections").catch(e401);
    });
  });

  describe('POST', function() {
    describe("JSON calls", function () {
      let data = {description: "This is a test repo"};

      it('Correct call: should return 200', function () {
        let apiCall = new Call(baseUrl, customerId, customerKey);
        return apiCall.post("/repositories", data)
            .then(res => {
              res["result_code"].should.be.equal(200);
              // keep track of repId to remove it later
              repId = res.data.repository.repository_id;
            });
      });

      it('Wrong auth: should return 401', function() {
        let apiCall = new Call(baseUrl, customerId, "");

        return apiCall.post("/repositories").catch(e401);
      });

      it('Wrong body: should return 400', function() {
        let apiCall = new Call(baseUrl, customerId, customerKey);

        return apiCall.post("/user_schemas", data).catch(e400);
      });
    });

    describe("Multipart/form-data calls", function () {
      // forms for authentication
      let form1 = {
        grant_type : "password",
        username : "aUser",
        password : "aPassword"
      };

      // NEED A CODE TO BE USED
      // let form2 = {
      //   grant_type : "authorization_code",
      //   code : "",
      //   redirect_url : "example.com/redirect",
      //   client_id : appId2,
      //   client_secret : appKey2,
      //   scope : "read write"
      // };
      
      // let form3 = {
      //   grant_type : "refresh_token",
      //   refresh_token : "",
      //   client_id: appId2,
      //   client_key : appKey2
      // }

      it('Auth with password: should return 200', function () {
        let apiCall = new Call(baseUrl, appId, appKey);
        return apiCall.post("/auth/token/", form1, apiCall.TYPES.FORM_DATA).then(s200);
      });

      it('Wrong auth with password: should return 401', function () {
        // change password to test wrong auth
        form1.password = "wrongPassword";

        let apiCall = new Call(baseUrl, appId, appKey);
        return apiCall.post("/auth/token/", form1, apiCall.TYPES.FORM_DATA).catch(e401);
      });

      // NEED A CODE TO BE USED
      it.skip('Auth with auth_code: should return 200', function () {
        let apiCall = new Call(baseUrl, appId, appKey);
        return apiCall.post("/auth/token/", form2, apiCall.TYPES.FORM_DATA).then(s200);
      });

      it.skip('Refresh token: should return 200', function () {
        let apiCall = new Call(baseUrl, appId, appKey);
        return apiCall.post("/auth/token/", form3, apiCall.TYPES.FORM_DATA).then(s200);
      });
    });
  });

  describe("PUT", function () {
    // right auth
    it('Corret call: should return 200', function() {
      let apiCall = new Call(baseUrl, customerId, customerKey);

      let user = {
        username: "aUser",
        password: "aPassword2",
        attributes: {
          user: 5
        },
        is_active: true
      };

      if (usrId) {
        return apiCall.put(`/users/${usrId}`, user)
            .then(s200)
            .catch(e400);
      }
    });
  });

  describe("PATCH", function () {
    // right auth
    it('Correct call: should return 200', function() {
      let apiCall = new Call(baseUrl, customerId, customerKey);

      let user = {
        attributes: {
          user: 3
        }
      };

      if (usrId) {
        return apiCall.patch(`/users/${usrId}`, user)
            .then(s200)
            .catch(e400);
      }
    });
  });

  describe("DELETE", function () {
    // right auth
    it('Correct call: should return 200', function() {
      let apiCall = new Call(baseUrl, customerId, customerKey);

      if (repId) {
        return apiCall.del(`/repositories/${repId}?force=true`)
            .then(s200)
            .catch(e404);
      }
    });
  });

  /* ==================================== */
  after("Remove stub user schema and inserted user", function () {
    // be sure to have enough time
    this.timeout(10000);

    function sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    let apiCall = new Call(baseUrl, customerId, customerKey);

    return sleep(1000).then(() => {
      if (ushId !== "" && usrId !== "") {
        return apiCall.del(`/user_schemas/${ushId}?force=true`)
            .then(res => { /*console.log("Removed stub stuff")*/ })
            .catch(err => { console.log(`Error removing test resources`) });
      }
    });
  })
});