import { $ } from "execa";
import { promises as fs } from "fs";
import * as path from "path";

const getCurrentBranch = async () => {
	const { stdout } = await $`git branch --show-current`;

	return stdout;
};

const getChangedFiles = async () => {
	const { stdout } = await $`git diff --name-only HEAD~1`;

	return stdout.split("\n");
};

const getChangesetFileName = async () => {
	const { stdout: shortHash } = await $`git rev-parse --short HEAD`;

	return path.join(".changeset", `renovate-${shortHash.trim()}.md`);
};

const toPublicPackageNames = async (accumulator, file) => {
	const packageList = await accumulator;

	const data = JSON.parse(await fs.readFile(file, "utf8"));

	if (!data.private) {
		packageList.push(data.name);
	}

	return packageList;
};

const getBumps = async (files) => {
	const bumps = new Map();

	for (const file of files) {
		const { stdout: changes } = await $`git show ${file}`;

		for (const change of changes.split("\n")) {
			// Check if change starts with a plus sign and a white space
			if (!change.match(/^\+\s/)) {
				continue;
			}

			const [packageName, version] = change.match(/"(.*?)"/g);
			bumps.set(packageName.replace(/"/g, ""), version.replace(/"/g, ""));
		}
	}

	return bumps;
};

const createChangeset = async (fileName, packageBumps, packages) => {
	const message = [...packageBumps].reduce((accumulator, [pkg, bump]) => {
		const newLine = `Updated dependency \`${pkg}\` to \`${bump}\`.\n`;

		return `${accumulator}${newLine}`;
	}, "");

	const pkgs = packages.map((pkg) => `'${pkg}': patch`).join("\n");
	const body = `---\n${pkgs}\n---\n\n${message.trim()}\n`;

	await fs.writeFile(fileName, body);
};

const isChangesetFile = (file) => file.startsWith(".changeset");

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

	const changeSetFileName = await getChangesetFileName();

	const packageBumps = await getBumps(packageFiles);
	await createChangeset(
		changeSetFileName,
		packageBumps.entries(),
		packageNames,
	);

	await $`git add ${changeSetFileName}`;
	await $`git commit -C HEAD --amend --no-edit`;
	await $`git push --force`;
};

await run();
