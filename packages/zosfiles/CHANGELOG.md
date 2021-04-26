# Change Log

All notable changes to the Zowe z/OS files SDK package will be documented in this file.

## `6.29.0`

- Enhancement: Added a standard data set template with no parameters set.

## `6.28.0`

- Enhancement: Added "Accept-Encoding: gzip" header to all z/OSMF requests

## `6.27.0`

- Enhancement: Added a `like` option to the `zowe zos-files create data-set` command. Use this option to like datasets. Here the arguments were added for the same. [#771](https://github.com/zowe/zowe-cli/issues/771)

## `6.24.4`

- Bugfix: Removed unnecessary dependency on zosuss SDK.

## `6.24.2`

- Revert: Revert changes made in 6.24.1, problem was determined to be bundling pipeline

## `6.24.1`

- Bugfix: Change SDK package structure to allow for backwards compatibility for some projects importing the CLI

## `6.24.0`

- Initial release
