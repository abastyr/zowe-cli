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

(async () => {
    const cmdOutput = spawnSync("lerna list --json --loglevel silent", { shell: true }).stdout.toString();
    const packageJson = require(path.resolve("package.json"));

    for (const pkgInfo of JSON.parse(cmdOutput)) {
        const subPkgJson = require(path.resolve(pkgInfo.location, "package.json"));
        const subPkgDeps = subPkgJson.dependencies || {};

        for (const pkgName in (packageJson.dependencies || {})) {
            if (!packageJson.dependencies[pkgName].startsWith("file:") && subPkgDeps[pkgName] != null) {
                const depDir = path.resolve(pkgInfo.location, nodeModulesDir, pkgName);
                const depParentDir = path.dirname(depDir);
                if (!fs.existsSync(depParentDir)) {
                    fs.mkdirSync(depParentDir, { recursive: true });
                }
                if (!fs.existsSync(depDir)) {
                    fs.symlinkSync(path.resolve(nodeModulesDir, pkgName), depDir, "junction");
                }
            }
        }

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
