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

// Ensure that packages/cli/lib/main.js exists for monorepo postinstall
const fs = require("fs");

const libDir = __dirname + "/../lib";
if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir);
}

const mainJs = libDir + "/main.js";
if (!fs.existsSync(mainJs)) {
    fs.writeFileSync(mainJs, "");
}
