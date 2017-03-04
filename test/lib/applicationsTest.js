/**
 * Created by daniele on 03/03/17.
 */

const assert = require("assert");
const should = require('should');

const objects = require("./src/objects");
const credentials = require("./testsSettings");
const Applications = require("./src/applications");

const baseUrl     = credentials.baseUrl;
const customerId  = credentials.customerId;
const customerKey = credentials.customerKey;

describe('Chino Applications API', function() {
  // change timeout for slow network
  this.timeout(5000);

  let appCaller = new Applications(baseUrl, customerId, customerKey);
  // keep track of ids to delete them later
  let appId1 = "";
  let appId2 = "";

  /* create */
  it("Test the creation of a application 1 with password auth: should return an Application object",
      function () {
        let app = {
          name: "Password app test",
          grant_type: "password",
        };

        return appCaller.create(app)
            .then((result) => {
              appId1 = result.app_id;
              result.should.be.an.instanceOf(objects.Application);
              Object.keys(result).length.should.be.above(0);
            });
      }
  );
  it("Test the creation of a application 2 with auth-code auth: should return an Application object",
      function () {
        let app = {
          name: "Authorization code app test",
          grant_type: "authorization-code",
          redirect_url: "http://127.0.0.1/"
        }

        return appCaller.create(app)
            .then((result) => {
              appId2 = result.app_id;
              result.should.be.an.instanceOf(objects.Application);
              Object.keys(result).length.should.be.above(0);
            });
      }
  );
  /* details */
  it("Test the retrieving of application 1 information: should return an Application object",
      function () {
        assert(appId1 !== "", "Application undefined");
        return appCaller.details(appId1)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Application);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  it("Test the retrieving of application 2 information: should return an Application object",
      function () {
        assert(appId2 !== "", "Application undefined");
        return appCaller.details(appId2)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Application);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* list */
  it("Test the listing of applications: should return a list of Application",
      function () {
        return appCaller.list()
            .then((result) => {
              result.should.be.an.instanceOf(Array);
              result.forEach((app) => {
                app.should.be.an.instanceOf(objects.Application);
              });
              // in this case we have inserted 2 app so it should have only 2
              result.length.should.equal(2);
            });
      }
  );
  /* update */
  // NOTE: the following 2 test doesn't work at the moment (04/03/2017),
  // because server doesn't update the application information
  it("Test the update of application information: should return an Application object",
      function () {
        let appUpdate = {
          name: "Application 1 was updated",
          grant_type: "password",
        };

        assert(appId1 !== "", "Application undefined");
        return appCaller.update(appId1, appUpdate)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Application);
              Object.keys(result).length.should.be.above(0);
              result.app_name.should.be.equal("Application 1 was updated");
            })
      }
  );

  it("Test the update of application information: should return an Application object",
      function () {
        let appUpdate = {
          name: "Application 2 was updated",
          grant_type: "authorization-code",
          redirect_url: "http://127.0.1.1/"
        }

        assert(appId2 !== "", "Application undefined");
        return appCaller.update(appId2, appUpdate)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Application);
              Object.keys(result).length.should.be.above(0);
              result.app_name.should.be.equal("Application 2 was updated");
            })
      }
  );

  /* delete */
  it("Test the deletion of a application: should return a success message",
      function () {
        assert(appId1 !== "", "Application undefined");
        return appCaller.delete(appId1, true)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);
              result.result_code.should.be.equal(200);
            })
      }
  );
  it("Test the deletion of a application: should return a success message",
      function () {
        assert(appId2 !== "", "Application undefined");
        return appCaller.delete(appId2, true)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);
              result.result_code.should.be.equal(200);
            })
      }
  );
});