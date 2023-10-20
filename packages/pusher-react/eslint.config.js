import base from "@vivid-web/eslint-config/base";
import react from "@vivid-web/eslint-config/react";

/** @type {import("eslint").Linter.FlatConfig[]} */
const config = [
	...base,
	...react,
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			parserOptions: {
				project: "./tsconfig.base.json",
			},
		},
	},
	{
		ignores: [".turbo", "node_modules", "dist"],
	},
];

export default config;
