const base64 = require("./encoding/base64")
const json = require("./encoding/json")
const select = require("./functional/select")
const array = require("./general/array")
const browser = require("./general/browser")
const class_reference = require("./general/class_reference")
const number = require("./general/number")

module.exports = {
    Base64: base64.Base64,
    Json: json.Json,
    Select: select.Select,
    Array: array.Array,
    BrowserDetect: browser.BrowserDetect,
    ClassReference: class_reference.ClassReference,
    Number: number.Number
};
