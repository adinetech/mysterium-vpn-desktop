/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
export declare type OS = "win" | "mac" | "linux";
export declare type Arch = "x64" | "arm" | "arm64" | string;
export declare type DownloadDescriptor = {
    os: OS;
    arch: Arch;
    filename: string;
};
export declare const downloads: DownloadDescriptor[];
export declare type Repository = (version: string, filename: string) => string;
export declare const repositories: {
    [key: string]: Repository;
};
export declare const platformToOS: (platform: NodeJS.Platform) => OS;
export declare const mysteriumNodeBin: (platform: NodeJS.Platform, arch: Arch) => string;
export declare const mysteriumSupervisorBin: (platform: NodeJS.Platform, arch: Arch) => string;
export declare const nodeVersion: () => string;
