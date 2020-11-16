/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

// Create symlinks needed for development of subpackages in this monorepo:
// (1) Symlinks to root-level dependencies used by subpackages
// (2) Symlinks to binaries of root-level dev dependencies
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const symlinkBinary = require("@lerna/symlink-binary");

process.chdir(__dirname + "/..");
const nodeModulesDir = "node_modules";
if (!fs.existsSync(nodeModulesDir)) {
    process.exit();
}

/**
 * Creates a sequence of symlinks that allow monorepo subpackages to share
 * common dependencies and the CLI to be globally installed from source.
 *   `packages/<pkgName>/node_modules/<depName>`
 *    -> `packages/cli/node_modules/<depName>`
 *    -> `packages/node_modules/<depName>`
 * @param {*} pkgDeps Dependency list from package.json of a dependency
 * @param {*} subPkgLocation Relative path of monorepo subpackage
 */
function symlinkDependencies(pkgDeps, subPkgLocation) {
    for (const pkgName in (pkgDeps || {})) {
        if (!pkgDeps[pkgName].startsWith("file:")) {
            const depDir = path.resolve("packages/cli", nodeModulesDir, pkgName);
            const depParentDir = path.dirname(depDir);
            if (!fs.existsSync(depParentDir)) {
                fs.mkdirSync(depParentDir, { recursive: true });
            }
            if (!fs.existsSync(depDir)) {
                fs.symlinkSync(path.resolve(nodeModulesDir, pkgName), depDir, "junction");
            }
            const depDir2 = path.resolve(subPkgLocation, nodeModulesDir, pkgName);
            const depParentDir2 = path.dirname(depDir2);
            if (!fs.existsSync(depParentDir2)) {
                fs.mkdirSync(depParentDir2, { recursive: true });
            }
            if (!fs.existsSync(depDir2)) {
                fs.symlinkSync(depDir, depDir2, "junction");
            }
            const depPkgJson = require(path.resolve(nodeModulesDir, pkgName, "package.json"));
            symlinkDependencies(depPkgJson.dependencies, subPkgLocation);
        }
    }
}

(async () => {
    const cmdOutput = spawnSync("lerna list --json --loglevel silent", { shell: true }).stdout.toString();
    const packageJson = require(path.resolve("package.json"));

    for (const pkgInfo of JSON.parse(cmdOutput)) {
        const subPkgJson = require(path.resolve(pkgInfo.location, "package.json"));
        symlinkDependencies(subPkgJson.dependencies, pkgInfo.location);

        for (const pkgName in (packageJson.devDependencies || {})) {
            if (!packageJson.devDependencies[pkgName].startsWith("file:")) {
                await symlinkBinary(path.resolve(nodeModulesDir, pkgName), path.resolve(pkgInfo.location));
            }
        }
    }
})().catch((error) => {
    console.error(error);
    process.exit(1);
})
