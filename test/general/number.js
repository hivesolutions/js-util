const assert = require("assert");
require("../../");

describe("Number", function() {
    describe("#formatMoney()", function() {
        it("should do simple things", () => {
            assert.strictEqual((0.0).formatMoney(), "0.00");
            assert.strictEqual((12.23).formatMoney(), "12.23");
            assert.strictEqual((12.23).formatMoney(1), "12.2");
            assert.strictEqual((12.23).formatMoney(1, ","), "12,2");
            assert.strictEqual((1200.23).formatMoney(2, ",", "."), "1.200,23");
            assert.strictEqual((-1200.23).formatMoney(2, ",", "."), "-1.200,23");
        });
        it("should format currency", () => {
            assert.strictEqual((0.0).formatMoney(2, ".", ",", "USD"), "0.00 USD");
            assert.strictEqual((12.23).formatMoney(2, ".", ",", "USD"), "12.23 USD");
            assert.strictEqual((12.23).formatMoney(2, ".", ",", "USD", true), "$ 12.23");
            assert.strictEqual((12.23).formatMoney(1, ",", ".", "USD", true), "$ 12,2");
        });
        it("should format currency for negative numbers", () => {
            assert.strictEqual((-12.23).formatMoney(2, ".", ",", "USD"), "-12.23 USD");
            assert.strictEqual((-12.23).formatMoney(2, ".", ",", "USD", true), "$ -12.23");
            assert.strictEqual((-12.23).formatMoney(1, ",", ".", "USD", true), "$ -12,2");
        });
        it("should format TWD currency", () => {
            assert.strictEqual((0.0).formatMoney(2, ".", ",", "TWD"), "0.00 TWD");
            assert.strictEqual((12.23).formatMoney(2, ".", ",", "TWD"), "12.23 TWD");
            assert.strictEqual((12.23).formatMoney(1, ",", ".", "TWD", true), "NT$ 12,2");
            assert.strictEqual((12.23).formatMoney(2, ".", ",", "TWD", true), "NT$ 12.23");
        });
    });
});
