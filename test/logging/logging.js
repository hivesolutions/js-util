var assert = require("assert");
var util = require("../../");

describe("Logging", function() {
    describe("#getLogger()", function() {
        it("should be able to retrieve a proper Logger instance", () => {
            assert.notEqual(util.Logging.getLogger("default"), null);
            assert.notEqual(util.Logging.getLogger("default"), undefined);
        });
    });
});
