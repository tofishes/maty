module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "airbnb-base",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        },
        "ecmaVersion": 2017,
        "sourceType": "module"
    },
    "plugins": [
        // "react",
        // "vue"
    ],
    "globals": {
    },
    "rules": {
        "no-param-reassign": ["error", { "props": false }],
        "quote-props": ["error", "consistent"],
        "comma-dangle": 0,
        "import/no-unresolved": 0,
        "arrow-parens": ["error", "as-needed"],
        "no-bitwise": ["error", { "allow": ["~"] }]
    }
};