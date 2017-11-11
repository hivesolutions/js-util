var assert = require("assert");
var util = require("../");

describe("Number", function() {
    describe("#formatMoney()", function() {
        it("should do simple things", () => {
            assert.equal(12.23.formatMoney(), "12.23");
            assert.equal(12.23.formatMoney(1), "12.2");
            assert.equal(12.23.formatMoney(1, ","), "12,2");
            assert.equal(1200.23.formatMoney(2, ",", "."), "1.200,23");
            assert.equal((-1200.23).formatMoney(2, ",", "."), "-1.200,23");
        });
        it("should do currency", () => {
            assert.equal(12.23.formatMoney(2, ".", ",", "USD"), "12.23 USD");
            assert.equal(12.23.formatMoney(2, ".", ",", "USD", true), "$ 12.23");
            assert.equal(12.23.formatMoney(1, ",", ".", "USD", true), "$ 12,2");
        });
    });
});
