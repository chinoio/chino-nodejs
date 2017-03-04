/**
 * Created by daniele on 03/03/17.
 */

const assert = require("assert");
const should = require('should');

const credentials = require("./testsSettings");
const ChinoAPIBase = require("./src/chinoBase");

const baseUrl     = credentials.baseUrl;
const customerId  = credentials.customerId;
const customerKey = credentials.customerKey;

describe('Chino API Base class', function() {

  it("Test Chino API Base class: should return corresping object",
      function (done) {
        const baseClass = new ChinoAPIBase(baseUrl, customerId, customerKey);

        baseClass.should.be.an.instanceOf(ChinoAPIBase);
        Object.keys(baseClass).length.should.be.above(0);
        should.equal(baseClass.baseUrl, baseUrl);
        should.equal(baseClass._customerKey, undefined);
        should.equal(baseClass.call.id, undefined);
        should.equal(baseClass.call.secret, undefined);

        done();
      }
  );
});