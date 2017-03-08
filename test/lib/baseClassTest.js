// testing libraries
const assert = require("assert");
const should = require('should');

const settings = require("./../testsSettings");
// Chino library
const ChinoAPIBase = require("../../src/chinoBase");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

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