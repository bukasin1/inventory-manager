module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 30000,
  globalSetup: "<rootDir>/src/tests/jest.setup.ts",
  setupFilesAfterEnv: ["<rootDir>/src/tests/test.setup.ts"],
};
