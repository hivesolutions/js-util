var assert = require("assert");
require("../../");

describe("String", function() {
    describe("#capitalize()", function() {
        it("should be able to capitalize a simple string", () => {
            assert.equal("hello".capitalize(), "Hello");
        });
    });
    describe("#decapitalize()", function() {
        it("should decapitalize a simple string", () => {
            assert.equal("Hello".decapitalize(), "hello");
        });
    });
});
