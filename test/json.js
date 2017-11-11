var assert = require("assert");
var json = require("../lib/encoding/json");

describe("Json", function() {
    describe("#toString()", function() {
        it("should do simple things", () => {
            assert.equal(json.Json.toString({
                hello: "world"
            }), "{\"hello\":\"world\"}");
        });
    });
});
