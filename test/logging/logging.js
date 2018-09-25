const assert = require("assert");
const util = require("../../");

describe("Logging", function() {
    describe("#getLogger()", function() {
        it("should be able to retrieve a proper Logger instance", () => {
            assert.notStrictEqual(util.Logging.getLogger("default"), null);
            assert.notStrictEqual(util.Logging.getLogger("default"), undefined);
        });
    });
});
