const assert = require("assert");
const should = require('should');

const objects = require("../../src/objects");
const settings = require("./../testsSettings");
const Applications = require("../../src/applications");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

describe('Chino Applications API', function() {
  this.slow(300);
  // change timeout for slow network
  this.timeout(5000);

  let appCaller = new Applications(baseUrl, customerId, customerKey);
  let wrongCaller = new Applications(baseUrl, "", "");

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
              result.should.be.an.instanceOf(objects.ChinoList);
              result.count.should.be.above(0);
              result.total_count.should.be.above(0);
              result.list.forEach((app) => {
                app.should.be.an.instanceOf(objects.Application);
              });
              // these app plus the one already inserted
              result.list.length.should.equal(3);
            });
      }
  );
  /* update */
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
                console.log("Deleted 1!")
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
                console.log("Deleted 2!")
              result.should.be.an.instanceOf(objects.Success);
              result.result_code.should.be.equal(200);
            })
      }
  );

  /* =================================== */
  /* Test what happen in wrong situation */
  describe("Test error situations:", function () {
    it("Missing credentials creating app caller, therefore should throws a ChinoException",
        function () {
          let app = {
            name: "Password app test",
            grant_type: "password",
          };

          return wrongCaller.create(app)
              .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
              .catch((error) => {
                error.should.be.instanceOf(objects.ChinoException)
                error.result_code.should.be.equal(401)
              });
        }
    );
    it("Creation should throws a ChinoException due wrong data",
        function () {
          let app = {
            name: "Authorization code app test"
          }

          return appCaller.create(app)
              .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
              .catch((error) => {
                error.should.be.instanceOf(objects.ChinoException)
                error.result_code.should.be.equal(400)
              });
        }
    );

    it("Details should throws a ChinoException because application was deleted",
        function () {
          return appCaller.details(appId1)
              .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
              .catch((error) => {
                error.should.be.instanceOf(objects.ChinoException)
                error.result_code.should.be.equal(404)
              });
        }
    );

    it("Listing should throws a ChinoException because application was deleted",
        function () {
          return appCaller.list(-1)
              .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
              .catch((error) => {
                error.should.be.instanceOf(objects.ChinoException)
                error.result_code.should.be.equal(400)
              });
        }
    );

  // describe("Test error situations:", function () {
  //   it("Missing credentials creating app caller, therefore should throws a ChinoException",
  //       function () {
  //         let app = {
  //           name: "Password app test",
  //           grant_type: "password",
  //         };
  //
  //         return wrongCaller.create(app)
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException)
  //               error.result_code.should.be.equal(401)
  //             });
  //       }
  //   );
  //   it("Creation should throws a ChinoException due wrong data",
  //       function () {
  //         let app = {
  //           name: "Authorization code app test"
  //         }
  //
  //         return appCaller.create(app)
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException)
  //               error.result_code.should.be.equal(400)
  //             });
  //       }
  //   );
  //
  //   it("Details should throws a ChinoException because application was deleted",
  //       function () {
  //         return appCaller.details(appId1)
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException)
  //               error.result_code.should.be.equal(404)
  //             });
  //       }
  //   );
  //
  //   it("Listing should throws a ChinoException because application was deleted",
  //       function () {
  //         return appCaller.list(-1)
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException)
  //               error.result_code.should.be.equal(400)
  //             });
  //       }
  //   );
  //
  //   it("Update should throws a ChinoException because application was deleted",
  //       function () {
  //         let appUpdate = {
  //           name: "Application 1 was updated",
  //           grant_type: "password",
  //         };
  //
  //         return appCaller.update(appId1, appUpdate)
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException)
  //               error.result_code.should.be.equal(404)
  //             });
  //       }
  //   );
  //
  //   it("Deletion should throws a ChinoException because application was already deleted",
  //       function () {
  //         return appCaller.delete(appId2, true)
  //             .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
  //             .catch((error) => {
  //               error.should.be.instanceOf(objects.ChinoException)
  //               error.result_code.should.be.equal(404)
  //             });
  //       }
  //   );
  // });
});