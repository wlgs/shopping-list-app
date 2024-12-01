import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    dir: "./",
});

// Add any custom config to be passed to Jest
const config = {
    coverageProvider: "v8",
    testEnvironment: "jsdom",
    modulePathIgnorePatterns: ["<rootDir>/e2e/"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
