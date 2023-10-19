import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

/** @type {import("eslint").Linter.FlatConfig[]} */
const config = [
	{
		files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
		settings: {
			react: {
				version: "detect",
			},
		},
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
		plugins: {
			react: react,
			"react-hooks": reactHooks,
		},
		rules: {
			...react.configs.recommended.rules,
			...react.configs["jsx-runtime"].rules,
			...reactHooks.configs.recommended.rules,
		},
	},
];

export default config;
