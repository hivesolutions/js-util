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
    describe("#format()", function() {
        it("should properly format a string", () => {
            assert.equal("{0} {1}".format("Hello", "World"), "Hello World");
            assert.equal(String.format("{0} {1}", "Hello", "World"), "Hello World");
        });
    });
    describe("#formatOptions()", function() {
        it("should properly format a string with options", () => {
            assert.equal("{hello} {world}".formatOptions({
                hello: "Hello",
                world: "World"
            }), "Hello World");
            assert.equal(String.formatOptions("{hello} {world}", {
                hello: "Hello",
                world: "World"
            }), "Hello World");
        });
    });
});
