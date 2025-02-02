import globals from "globals";
import pluginJs from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import promisePlugin from "eslint-plugin-promise";
import securityPlugin from "eslint-plugin-security";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2024
            },
            parserOptions: {
                sourceType: "module",
                ecmaVersion: "latest"
            }
        }
    },
    pluginJs.configs.recommended,
    importPlugin.flatConfigs.recommended,
    promisePlugin.configs['flat/recommended'],
    securityPlugin.configs.recommended,
    prettierConfig,
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            "no-console": "off",
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "import/order": ["error", { "newlines-between": "always" }],
            "import/namespace": "off",
            "promise/no-return-wrap": "error",
            "security/detect-object-injection": "off",
        },
    },
    {
        ignores: ["node_modules/", "eslint.config.js", "public/static/js/*.js"],
    }
];
