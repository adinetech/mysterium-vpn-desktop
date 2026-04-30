"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeVersion = exports.mysteriumSupervisorBin = exports.mysteriumNodeBin = exports.platformToOS = exports.repositories = exports.downloads = void 0;
/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const path_1 = __importDefault(require("path"));
const semver_1 = __importDefault(require("semver"));
const package_json_1 = __importDefault(require("../package.json"));
exports.downloads = [
    { os: "mac", arch: "x64", filename: "myst_darwin_amd64.tar.gz" },
    { os: "mac", arch: "arm64", filename: "myst_darwin_arm64.tar.gz" },
    { os: "linux", arch: "x64", filename: "myst_linux_amd64.tar.gz" },
    { os: "linux", arch: "arm", filename: "myst_linux_arm.tar.gz" },
    { os: "win", arch: "x64", filename: "myst_windows_amd64.zip" },
];
exports.repositories = {
    snapshot: (version, filename) => `https://github.com/mysteriumnetwork/node-builds/releases/latest/download/${filename}`,
    release: (version, filename) => `https://github.com/mysteriumnetwork/node/releases/download/${version}/${filename}`,
};
const parentDir = () => path_1.default.resolve(__dirname, "..");
const platformToOS = (platform) => {
    switch (platform) {
        case "win32":
            return "win";
        case "darwin":
            return "mac";
        case "linux":
            return "linux";
        default:
            throw new Error(`Unsupported platform: ${platform}. Supported values: win32, darwin, linux.`);
    }
};
exports.platformToOS = platformToOS;
const mysteriumNodeBin = (platform, arch) => {
    const os = (0, exports.platformToOS)(platform);
    const executablePath = os === "win" ? "myst.exe" : "myst";
    return path_1.default.join(parentDir(), "bin", os, arch, executablePath);
};
exports.mysteriumNodeBin = mysteriumNodeBin;
const mysteriumSupervisorBin = (platform, arch) => {
    const os = (0, exports.platformToOS)(platform);
    const executablePath = os === "win" ? "myst_supervisor.exe" : "myst_supervisor";
    return path_1.default.join(parentDir(), "bin", os, arch, executablePath);
};
exports.mysteriumSupervisorBin = mysteriumSupervisorBin;
const nodeVersion = () => semver_1.default.coerce(package_json_1.default.version).version;
exports.nodeVersion = nodeVersion;
