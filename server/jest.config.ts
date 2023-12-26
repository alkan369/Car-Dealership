export default {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	testMatch: ["**/*.test.ts", "**/*.test.tsx"],
	globals: {
		"ts-jest": {
			tsconfig: "./tsconfig.json",
		},
	},
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	setupFilesAfterEnv: ["ts-node/register"],
};
