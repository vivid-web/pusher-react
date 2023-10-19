import { defineConfig } from "tsup";

export default defineConfig(({ watch }) => ({
	clean: !watch,
	dts: true,
	entry: ["src/*.ts"],
	format: ["cjs", "esm"],
	outDir: "dist",
	sourcemap: false,
	target: ["es2020", "node16"],
}));
