import globals from "globals";
import pluginJs from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import promisePlugin from "eslint-plugin-promise";
import securityPlugin from "eslint-plugin-security";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

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
    // TypeScript configuration
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: "./tsconfig.json",
                ecmaVersion: "latest",
                sourceType: "module",
            }
        },
        plugins: {
            "@typescript-eslint": typescriptPlugin
        },
        rules: {
            ...typescriptPlugin.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            // Deshabilitar reglas JS que TypeScript ya maneja
            "no-unused-vars": "off",
            // Deshabilitar errores de importación no resuelta para alias
            "import/no-unresolved": "off"
        },
        settings: {
            // Configuración para resolver importaciones
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.json"
                }
            }
        }
    },
    {
        ignores: ["node_modules/", "eslint.config.js", "public/static/js/*.js", "build/"],
    }
];
