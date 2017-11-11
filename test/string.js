var assert = require("assert");
require("../");

describe("String", function() {
    describe("#capitalize()", function() {
        it("should do simple things", () => {
            assert.equal("hello".capitalize(), "Hello");
        });
    });
    describe("#decapitalize()", function() {
        it("should do simple things", () => {
            assert.equal("Hello".decapitalize(), "hello");
        });
    });
});
