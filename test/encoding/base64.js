const assert = require("assert");
const util = require("../../");

describe("Base64", function() {
    describe("#encode()", function() {
        it("should be able to base64 encode a string", () => {
            assert.strictEqual(
                util.Base64.encode("hello world"),
                "aGVsbG8gd29ybGQ="
            );
        });
    });
    describe("#decode()", function() {
        it("should be able to decode base64", () => {
            assert.strictEqual(
                util.Base64.decode("aGVsbG8gd29ybGQ="),
                "hello world"
            );
        });
    });
});
