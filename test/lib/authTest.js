const assert = require("assert");
const should = require('should');

const Auth = require("../../src/auth");
const objects = require("../../src/objects");
const settings = require("./../testsSettings");

const baseUrl     = settings.baseUrl;

describe('Chino Auth API', function () {
  this.slow(300);
  // change timeout for slow network
  this.timeout(5000);

  let auth;
  // save tokens for later
  let accessToken = "";
  let refreshToken = "";

  before(function () {
    const data = settings.data();

    appId = data.appId;
    appKey = data.appKey;

    auth = new Auth(baseUrl, appId, appKey);
  })

  /* login */
  it("Test the login feature: should return an Auth object",
      function () {
        return auth.login("theLoginUser", "This1CouldBe_a_StrongPassword!")
            .then((result) => {
                accessToken = result.access_token;
                result.should.be.an.instanceOf(objects.Auth);
                refreshToken = result.refresh_token;
                Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* login with code */
  it.skip("Test the login with code feature: should return an Auth object",
      function () {
        return auth.loginWithCode("<insertARealCode>", "127.0.0.1")
            .then((result) => {
              result.should.be.an.instanceOf(objects.Auth);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* refresh token */
  it("Test the refresh token feature: should return an Auth object",
      function () {
        return auth.refreshToken(refreshToken)
            .then((result) => {
              accessToken = result.access_token;
              result.should.be.an.instanceOf(objects.Auth);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* logout */
  it("Test the logout feature: should return a Success object",
      function () {
        return auth.logout(accessToken)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);
            })
      }
  );

  /* =================================== */
  /* Test what happen in wrong situation */

  // describe("Test error situations:", function () {
  //   it("Missing credentials should makes Auth object throw", function () {
  //     assert.throws(function () {
  //       let wrongAuth = new Auth("", "", "");
  //     }, objects.ChinoException);
  //   });
  //   it("Undefined credentials should makes Auth object throw", function () {
  //     assert.throws(function () {
  //       let wrongAuth = new Auth("", undefined, undefined);
  //     }, objects.ChinoException);
  //   });
  //   it("Null credentials should makes Auth object throw", function () {
  //     assert.throws(function () {
  //       let wrongAuth = new Auth("", "test", null);
  //     }, objects.ChinoException);
  //   });
  //   it("Wrong credentials for login should throw a ChinoException object", function () {
  //         return auth.login("hello", "thisIsAPassword")
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException);
  //               error.result_code.should.be.equal(400)
  //             })
  //       });
  //   it("Wrong code for login with code should throw a ChinoException object",function () {
  //         return auth.loginWithCode("<insertARealCode>", "127.0.0.1")
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException);
  //               error.result_code.should.be.equal(401)
  //             })
  //       });
  //   it("Wrong access token provided for refreshToken should throw a ChinoException object", function () {
  //         return auth.refreshToken("notAAccessToken")
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException);
  //               error.result_code.should.be.equal(400)
  //             })
  //       });
  //   it("Empty access token provided for refreshToken should throw a ChinoException object", function () {
  //         return auth.refreshToken("")
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException);
  //               error.result_code.should.be.equal(400)
  //             })
  //       });
  //   it("Null access token provided for refreshToken should throw a ChinoException object", function () {
  //         return auth.refreshToken(null)
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException);
  //               error.result_code.should.be.equal(400)
  //             })
  //       });
  //   it("Undefined access token provided for refreshToken should throw a ChinoException object", function () {
  //         return auth.refreshToken(undefined)
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException);
  //               error.result_code.should.be.equal(400)
  //             })
  //       });
  //   it("Wrong access token provided for logout should return Success object anyway", function () {
  //         return auth.logout("notAAccessToken")
  //             .then((result) => {
  //               result.should.be.an.instanceOf(objects.Success);
  //             })
  //       });
  //   it("Null access token provided for logout should throw a ChinoException object", function () {
  //         return auth.logout(null)
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException);
  //               error.result_code.should.be.equal(400)
  //             })
  //       });
  // });
});