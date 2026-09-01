import fs from "node:fs";

const pem = fs.readFileSync("./craftpr.2026-08-31.private-key.pem", "utf8");

const envValue = pem.replace(/\r?\n/g, "\\n").replace(/"/g, '\\"');

console.log(`GITHUB_SECRET_KEY="${envValue}"`);
