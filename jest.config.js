module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: [
    "js",
    "ts",
  ],
  testMatch: [
    "**/(src|tests)/**/*.spec.(js|ts)",
  ],
}
