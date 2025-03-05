module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 30000,
  setupFiles: ["<rootDir>/src/tests/jest.setup.ts"],
};
