var assert = require("assert");
var util = require("../../");

describe("Json", function() {
    describe("#toString()", function() {
        it("should do simple things", () => {
            assert.equal(util.Json.toString({
                hello: "world"
            }), "{\"hello\":\"world\"}");
        });
    });
});
