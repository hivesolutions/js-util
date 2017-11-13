var assert = require("assert");
var util = require("../../");

describe("Base64", function() {
    describe("#encode()", function() {
        it("should be able to base64 encode a string", () => {
            assert.equal(util.Base64.encode("hello world"), "aGVsbG8gd29ybGQ=");
        });
    });
    describe("#decode()", function() {
        it("should be able to decode base64", () => {
            assert.equal(util.Base64.decode("aGVsbG8gd29ybGQ="), "hello world");
        });
    });
});
