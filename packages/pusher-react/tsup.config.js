import { defineConfig } from "tsup";

export default defineConfig(({ watch }) => ({
	entry: ["src/*.ts"],
	format: ["cjs", "esm"],
	target: ["es2020", "node16"],
	outDir: "dist",
	dts: true,
	sourcemap: false,
	clean: !watch,
}));
