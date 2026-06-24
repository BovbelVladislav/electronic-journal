// jest.config.js
const { createDefaultPreset } = require("ts-jest");
const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/tests/**/*.spec.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    ...tsJestTransformCfg,
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleDirectories: ["node_modules", "src"]
};
