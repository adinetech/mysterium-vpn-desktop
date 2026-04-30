const https = require("https");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const VENDOR_PACKAGE_JSON = path.join(__dirname, "../vendor/node-js/package.json");
const VENDOR_DIR = path.join(__dirname, "../vendor/node-js");

console.log("Fetching latest release from mysteriumnetwork/node...");

const options = {
    hostname: "api.github.com",
    path: "/repos/mysteriumnetwork/node/releases/latest",
    headers: {
        "User-Agent": "Mysterium-Community-Fork",
    },
};

https.get(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
        data += chunk;
    });

    res.on("end", () => {
        if (res.statusCode !== 200) {
            console.error(`Failed to fetch latest release. HTTP Status: ${res.statusCode}`);
            process.exit(1);
        }

        try {
            const release = JSON.parse(data);
            const latestVersion = release.tag_name.replace(/^v/, ""); // Remove 'v' if present
            
            console.log(`Latest node binary version is: ${latestVersion}`);
            
            // Read vendor package.json
            const pkgData = JSON.parse(fs.readFileSync(VENDOR_PACKAGE_JSON, "utf8"));
            const currentVersion = pkgData.version;
            
            if (currentVersion === latestVersion) {
                console.log("Already up to date. No action needed.");
                return;
            }

            console.log(`Upgrading from ${currentVersion} to ${latestVersion}...`);
            
            // Update version in vendor/node-js/package.json
            pkgData.version = latestVersion;
            fs.writeFileSync(VENDOR_PACKAGE_JSON, JSON.stringify(pkgData, null, 2) + "\n");
            
            console.log("Building vendor/node-js wrapper...");
            
            // Run build inside vendor directory
            execSync("npm run build", { cwd: VENDOR_DIR, stdio: "inherit" });
            
            console.log(`\n✅ Successfully upgraded core node binary to ${latestVersion}!`);
            console.log("The next time you build or install the app, it will download the new binaries.");
            
        } catch (err) {
            console.error("Error parsing release data or updating package.json:", err);
            process.exit(1);
        }
    });
}).on("error", (err) => {
    console.error("Error connecting to GitHub API:", err);
    process.exit(1);
});
