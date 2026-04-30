"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const path_1 = __importDefault(require("path"));
const fs_1 = __importStar(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const extract_zip_1 = __importDefault(require("extract-zip"));
const targz_1 = __importDefault(require("targz"));
const semver_1 = __importDefault(require("semver"));
const package_json_1 = __importDefault(require("../package.json"));
const index_1 = require("./index");
const unpack = function (filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const destDir = path_1.default.resolve(path_1.default.dirname(filename));
        if (filename.endsWith(".zip")) {
            return (0, extract_zip_1.default)(filename, { dir: destDir });
        }
        return new Promise((resolve, reject) => {
            targz_1.default.decompress({
                src: filename,
                dest: destDir,
            }, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(null);
                }
            });
        });
    });
};
function postinstall() {
    return __awaiter(this, void 0, void 0, function* () {
        const packageVersion = package_json_1.default.version;
        const repository = packageVersion === "0.0.0-snapshot.1" ? index_1.repositories.snapshot : index_1.repositories.release;
        const nodeVersion = semver_1.default.coerce(packageVersion).version;
        console.log(`Downloading Mysterium Node (${repository == index_1.repositories.release ? nodeVersion : "snapshot"})`);
        for (const download of index_1.downloads) {
            const url = repository(nodeVersion, download.filename);
            const res = yield (0, node_fetch_1.default)(url);
            if (res.status == 404) {
                console.error("File not found");
                continue;
            }
            const destDir = path_1.default.join("bin", download.os, download.arch);
            (0, fs_1.mkdirSync)(destDir, { recursive: true });
            const destPath = path_1.default.join(destDir, download.filename);
            console.log(`Downloading: ${destPath}`);
            const filename = yield new Promise((resolve, reject) => {
                const dest = fs_1.default.createWriteStream(destPath);
                res.body.pipe(dest);
                res.body.on("end", () => resolve(destPath));
                dest.on("error", reject);
            });
            yield unpack(filename);
            fs_1.default.unlinkSync(filename);
        }
    });
}
postinstall();
