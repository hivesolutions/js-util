module.exports = {
    "extends": "standard",
    "plugins": ["mocha"],
    "rules": {
        "indent": ["warn", 4, {
            SwitchCase: 1
        }],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "space-before-function-paren": ["error", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
        }],
        "linebreak-style": ["error", "windows"],
        "mocha/no-exclusive-tests": "error",
        "no-use-before-define": "off",
        "brace-style": "off",
        "operator-linebreak": "off",
        "standard/no-callback-literal": "off",
        "standard/computed-property-even-spacing": "off"
    },
    "env": {
        "browser": true,
        "jasmine": true
    }
};
