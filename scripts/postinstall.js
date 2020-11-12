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

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const symlinkBinary = require("@lerna/symlink-binary");

process.chdir(__dirname + "/..");

const nodeModulesDir = "node_modules";
if (!fs.existsSync(nodeModulesDir)) {
    process.exit();
}

const packageJson = require(path.resolve("package.json"));
if (packageJson.devDependencies == null) {
    process.exit();
}

for (const pkgDir of glob.sync("packages/*")) {
    for (const pkgName in packageJson.devDependencies) {
        if (!packageJson.devDependencies[pkgName].startsWith("file:")) {
            symlinkBinary(path.resolve(nodeModulesDir, pkgName),
                path.resolve(pkgDir));
        }
    }
}
