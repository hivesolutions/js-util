const assert = require("assert");
const util = require("../../");

describe("Cookie", function() {
    describe("#load()", function() {
        it("should do simple things", () => {
            const cookie = new util.Cookie("hello");
            const result = cookie.load("hello=world");
            assert.equal(result, true);
            assert.equal(cookie.name, "hello");
            assert.equal(cookie.value, "world");
        });
    });
});
