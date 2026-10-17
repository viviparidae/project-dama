#!/usr/bin/env node
/**
 * Translation coverage checker for DAMA project.
 * Verifies that all Japanese translation keys exist in English locale files.
 */
const fs = require("fs");
const path = require("path");

const jaPath = path.join(__dirname, "../public/locales/ja");
const enPath = path.join(__dirname, "../public/locales/en");

function getKeys(obj, prefix = "") {
  return Object.keys(obj).reduce((acc, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      return acc.concat(getKeys(obj[key], prefixedKey));
    }
    return acc.concat(prefixedKey);
  }, []);
}

function loadJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function checkCoverage() {
  const jaFiles = fs.readdirSync(jaPath);
  const enFiles = fs.readdirSync(enPath);

  let missingKeys = [];

  jaFiles.forEach((file) => {
    if (!enFiles.includes(file)) {
      console.error(`Missing English file: ${file}`);
      process.exit(1);
    }

    const jaObj = loadJsonFile(path.join(jaPath, file));
    const enObj = loadJsonFile(path.join(enPath, file));

    const jaKeys = getKeys(jaObj);
    const enKeys = getKeys(enObj);

    const missing = jaKeys.filter((key) => !enKeys.includes(key));
    if (missing.length > 0) {
      missingKeys.push(...missing.map((key) => `${file}:${key}`));
    }
  });

  if (missingKeys.length > 0) {
    console.error("Missing Japanese translations:");
    missingKeys.forEach((key) => console.error(`  - ${key}`));
    process.exit(1);
  }

  console.log("All Japanese translations present");
}

checkCoverage();