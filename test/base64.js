var assert = require("assert");
var base = require("../lib/encoding/base64");

describe("Base64", function() {
    describe("#encode()", function() {
        it("should do simple things", () => {
            assert.equal(Base64.encode("hello world"), "aGVsbG8gd29ybGQ=");
        });
    });
});
