var assert = require("assert");
var base64 = require("../lib/encoding/base64");

describe("Base64", function() {
    describe("#encode()", function() {
        it("should do simple things", () => {
            assert.equal(base64.Base64.encode("hello world"), "aGVsbG8gd29ybGQ=");
        });
    });
    describe("#decode()", function() {
        it("should do simple things", () => {
            assert.equal(base64.Base64.decode("aGVsbG8gd29ybGQ="), "hello world");
        });
    });
});
