import prettierConfig from "eslint-config-prettier";
import perfectionistNatural from "eslint-plugin-perfectionist/configs/recommended-natural";
import tsParser from "@typescript-eslint/parser";
import ts from "@typescript-eslint/eslint-plugin";
import js from "@eslint/js";
import eslintComments from "eslint-plugin-eslint-comments";
import _import from "eslint-plugin-import";
import globals from "globals";

/** @type {import("eslint").Linter.FlatConfig[]} */
const config = [
	prettierConfig,
	perfectionistNatural,
	{
		plugins: {
			"eslint-comments": eslintComments,
		},
		rules: {
			...eslintComments.configs.recommended.rules,
		},
	},
	{
		files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
		languageOptions: {
			globals: {
				...globals.builtin,
				...globals.es2021,
			},
		},
	},
	{
		files: ["**/*.{js,jsx,mjs}"],
		languageOptions: {
			parser: tsParser,
			sourceType: "module",
			parserOptions: {
				sourceType: "module",
				ecmaVersion: 2020,
			},
		},
		plugins: {
			import: _import,
		},
		settings: {
			// This will do the trick
			"import/parsers": {
				espree: [".js", ".cjs", ".mjs", ".jsx"],
			},
		},
		rules: {
			...js.configs.recommended.rules,
			..._import.configs.recommended.rules,
		},
	},
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			parser: tsParser,
			sourceType: "module",
			parserOptions: {
				ecmaFeatures: {
					modules: true,
				},
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		plugins: {
			import: _import,
			"@typescript-eslint": ts,
		},
		settings: {
			..._import.configs.typescript.settings,
		},
		rules: {
			...js.configs.recommended.rules,
			..._import.configs.typescript.rules,
			...ts.configs["recommended-requiring-type-checking"].rules,
			...ts.configs.strict.rules,
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"no-unused-vars": "off",
		},
	},
];

export default config;
