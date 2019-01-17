// testing libraries
const assert = require("assert");
const should = require('should');

const Call = require("../../src/apiCall");
const settings = require("./../testsSettings");
const CONT_TYPES = require("../../src/callTypes.js");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

// utils functions
function s200(res) {
  return res["result_code"].should.be.equal(200);
}
function e400(res, caller="not specified") {
    try {
        return res["result_code"].should.be.equal(400);
    } catch (e) {
        console.log(res);
        throw e;
    }
}
function e401(err, caller="not specified") {
    try {
        return err["result_code"].should.be.equal(401);
    } catch (e) {
        console.log(err);
        throw e;
    }
}
function e404(err, caller="not specified") {
    try {
        return err["result_code"].should.be.equal(404);
    } catch (e) {
        console.log(err);
        throw e;
    }
}

describe('Chino API Call', function () {
  this.slow(300);
  this.timeout(5000);
  let repId = "";

  // keep track of ids to delete them later
  let ushId = "";
  let usrId = "";

  // application credentials
  let appId;
  let appKey;

  /* ==================================== */
  before("Set up resources to test the lib", function () {
    // here we are assuming things work (otherwise we need an environment already set up)
    const apiCall = new Call(baseUrl, customerId, customerKey);

    const userSchema = {
      description: "Test User Schema",
      structure: {
        fields: [
          {
            type: "integer",
            name: "user"
          }
        ]
      }
    };
    const user = {
      username: "aUser",
      password: "aPassword",
      attributes: {
        user: 1
      },
      is_active: true
    };
    const app = {
      name: "App for testing",
      grant_type: "password",
    };

    return apiCall.post("/user_schemas", userSchema)
        .then((res) => {
          ushId = res.data.user_schema.user_schema_id;

          if (ushId) {
            return apiCall.post(`/user_schemas/${ushId}/users`, user)
                .then((res) => {
                  usrId = res.data.user.user_id;

                  return apiCall.post("/auth/applications", app)
                      .then((res) => {
                        appId = res.data.application.app_id;
                        appKey = res.data.application.app_secret;
                      })
                      .catch((err) => console.log("No application created"));
                })
                .catch((err) => console.log("No user inserted"));
          }
        })
        .catch((err) => console.log("No user schema created"));
  });

  // test each method with a specific result
  describe('GET', function () {
    it('Correct call: should return 200', function () {
      let apiCall = new Call(baseUrl, customerId, customerKey);

      return apiCall.get("/collections").then(s200);
    });

    it('Wrong auth: should return 401', function () {
      let apiCall = new Call(baseUrl, customerId, "");

      return apiCall.get("/collections").catch(e401);
    });
  });

  describe('POST', function () {
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

      it('Wrong auth: should return 401', function () {
        let apiCall = new Call(baseUrl, customerId, "");

        return apiCall.post("/repositories").catch(e401);
      });

      it('Wrong body: should return 400', function () {
        let apiCall = new Call(baseUrl, customerId, customerKey);

        return apiCall.post("/user_schemas", data).catch(e400);
      });
    });

    describe("Multipart/form-data calls", function () {
      // forms for authentication
      let form = {
        grant_type: "password",
        username: "aUser",
        password: "aPassword"
      };

      it('Auth with password: should return 200', function () {
        let authCall = new Call(baseUrl, appId, appKey);
        return authCall.post("/auth/token/", form, CONT_TYPES.FORM_DATA).then(s200);
      });

      it('Auth with wrong password: should return 400', function () {
        // change password to test wrong auth
        form.password = "wrongPassword";

        let authCall = new Call(baseUrl, appId, appKey);
        return authCall.post("/auth/token/", form, CONT_TYPES.FORM_DATA).catch(e400);
      });
    });
  });

  describe("PUT", function () {
    // right auth
    const user = {
      username: "aUser",
      password: "aPassword2",
      attributes: {
        user: 5
      },
      is_active: true
    };

    it('Corret call: should return 200', function () {
      let apiCall = new Call(baseUrl, customerId, customerKey);

      if (usrId) {
        return apiCall.put(`/users/${usrId}`, user)
            .then(s200)
            .catch(e400);
      }
    });

    it('Wrong auth: should return 401', function () {
      let apiCall = new Call(baseUrl, customerId, "");

      if (usrId) {
        return apiCall.put(`/users/${usrId}`, user)
            .catch(e401)
      }
    });
  });

  describe("PATCH", function () {
    // right auth
    const user = {
      attributes: {
        user: 3
      }
    };

    it('Correct call: should return 200', function () {
      let apiCall = new Call(baseUrl, customerId, customerKey);

      if (usrId) {
        return apiCall.patch(`/users/${usrId}`, user)
            .then(s200)
            .catch(e400);
      }
    });

    it('Wrong auth: should return 401', function () {
      let apiCall = new Call(baseUrl, customerId, "");

      if (usrId) {
        return apiCall.patch(`/users/${usrId}`, user)
            .catch(e401);
      }
    });
  });

  describe("DELETE", function () {
    // right auth
    it('Correct call: should return 200', function () {
      let apiCall = new Call(baseUrl, customerId, customerKey);

      if (repId) {
        return apiCall.del(`/repositories/${repId}?force=true`)
            .then(s200)
            .catch(e404);
      }
    });

    it('Wrong auth: should return 401', function () {
      let apiCall = new Call(baseUrl, customerId, "");

      if (repId) {
        return apiCall.del(`/repositories/${repId}?force=true`)
            .catch(e401);
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

    return sleep(500).then(() => {
      if (ushId !== "" && usrId !== "") {
        return apiCall.del(`/user_schemas/${ushId}?force=true`)
            .then(res => {
              return apiCall.del(`/auth/applications/${appId}`)
                  .then( /* Removal of resources with success */ )
                  .catch(err => { console.log(`Error removing application`) })
            })
            .catch(err => { console.log(`Error removing test resources`) });
      }
    });
  })
});