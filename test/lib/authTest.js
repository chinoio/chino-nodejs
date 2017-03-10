const assert = require("assert");
const should = require('should');

const Auth = require("../../src/auth");
const objects = require("../../src/objects");
const settings = require("./../testsSettings");

const baseUrl     = settings.baseUrl;

describe('Chino Auth API', function () {
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
});