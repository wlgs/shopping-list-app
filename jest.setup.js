import "@testing-library/jest-dom";

const testCache = (func) => func;

jest.mock("react", () => {
    const originalModule = jest.requireActual("react");
    return {
        ...originalModule,
        cache: testCache,
    };
});
