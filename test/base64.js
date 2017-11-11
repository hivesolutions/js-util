var assert = require("assert");
var util = require("../");

describe("Base64", function() {
    describe("#encode()", function() {
        it("should do simple things", () => {
            assert.equal(util.Base64.encode("hello world"), "aGVsbG8gd29ybGQ=");
        });
    });
    describe("#decode()", function() {
        it("should do simple things", () => {
            assert.equal(util.Base64.decode("aGVsbG8gd29ybGQ="), "hello world");
        });
    });
});
