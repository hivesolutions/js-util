const assert = require("assert");
const util = require("../../");

describe("Cookie", function() {
    describe("#load()", function() {
        it("should do simple things", () => {
            const cookie = new util.Cookie("hello");
            const result = cookie.load("hello=world");
            assert.strictEqual(result, true);
            assert.strictEqual(cookie.name, "hello");
            assert.strictEqual(cookie.value, "world");
        });
    });
});
