import { $ } from "execa";
import { promises as fs } from "fs";
import * as path from "path";

/**
 * @return {Promise<string>}
 */
const getCurrentBranch = async () => {
	const { stdout } = await $`git branch --show-current`;

	return stdout;
};

/**
 * @return {Promise<string[]>}
 */
const getChangedFiles = async () => {
	const { stdout } = await $`git diff --name-only HEAD~1`;

	return stdout.split("\n");
};

/**
 * @param {string} file
 * @return {Promise<string>}
 */
const getChangesFromFile = async (file) => {
	const { stdout: changes } = await $`git show ${file}`;

	return changes;
};

/**
 * @return {Promise<string>}
 */
const getChangesetFileName = async () => {
	const { stdout: shortHash } = await $`git rev-parse --short HEAD`;

	return path.join(".changeset", `renovate-${shortHash.trim()}.md`);
};

/**
 * @param {Promise<string[]>} accumulator
 * @param {string} file
 * @return {Promise<string[]>}
 */
const toPublicPackageNames = async (accumulator, file) => {
	const packageList = await accumulator;

	const data = JSON.parse(await fs.readFile(file, "utf8"));

	if (!data.private) {
		packageList.push(data.name);
	}

	return packageList;
};

/**
 * @param {Promise<[string, string][]>} acc
 * @param {string} file
 * @return {Promise<[string, string][]>}
 */
const toPackageBump = async (acc, file) => {
	const items = await acc;

	const changes = await getChangesFromFile(file);

	const entries = changes
		.split("\n")
		.filter((change) => change.match(/^\+\s/))
		.map((change) => {
			const [pkg, bump] = change.match(/"(.*?)"/g);

			return [pkg, bump];
		})
		.concat(items);

	return [...new Set(entries)];
};

/**
 * @param {string} fileName
 * @param {[string, string][]} packageBumps
 * @param {string[]} packages
 * @return {Promise<void>}
 */
const createChangeset = async (fileName, packageBumps, packages) => {
	const message = packageBumps.reduce((accumulator, [pkg, bump]) => {
		const newLine = `Updated dependency \`${pkg}\` to \`${bump}\`.\n`;

		return `${accumulator}${newLine}`;
	}, "");

	const pkgs = packages.map((pkg) => `'${pkg}': patch`).join("\n");
	const body = `---\n${pkgs}\n---\n\n${message.trim()}\n`;

	await fs.writeFile(fileName, body);
};

/**
 * @param {string} file
 * @return {boolean}
 */
const isChangesetFile = (file) => file.startsWith(".changeset");

/**
 * @param {string} file
 * @return {boolean}
 */
const isPackageJsonFile = (file) => {
	return file !== "package.json" && file.includes("package.json");
};

const run = async () => {
	const currentBranch = await getCurrentBranch();

	if (!currentBranch.startsWith("renovate/")) {
		console.log("Not a renovate branch, skipping");

		return;
	}

	const allFiles = await getChangedFiles();

	if (allFiles.find(isChangesetFile)) {
		console.log("Changeset already exists, skipping");

		return;
	}

	const packageFiles = allFiles.filter(isPackageJsonFile);
	const packageNames = await packageFiles.reduce(
		toPublicPackageNames,
		Promise.resolve([]),
	);

	if (!packageNames.length) {
		console.log("No package.json changes to published packages, skipping");

		return;
	}

	const packageBumps = await packageFiles.reduce(
		toPackageBump,
		Promise.resolve([]),
	);

	const changeSetFileName = await getChangesetFileName();

	await createChangeset(changeSetFileName, packageBumps, packageNames);

	await $`git add ${changeSetFileName}`;
	await $`git commit -C HEAD --amend --no-edit`;
	await $`git push --force`;
};

await run();
