// testing libraries
const assert = require("assert");
const should = require('should');
// Chino library
const ChinoAPIBase = require("../../src/chinoBase");

module.exports = function ({baseUrl, customerId, customerKey}) {
    describe('Chino API Base class', function() {

      it("Test Chino API Base class: should return corresponding object",
          function (done) {
            const baseClass = new ChinoAPIBase(baseUrl, customerId, customerKey);

            baseClass.should.be.an.instanceOf(ChinoAPIBase);
            Object.keys(baseClass).length.should.be.above(0);
            should.equal(baseClass._customerKey, undefined);
            should.equal(baseClass.call.baseUrl, baseUrl);
            should.equal(baseClass.call.id, undefined);
            should.equal(baseClass.call.secret, undefined);

            done();
          }
      );
    })
}