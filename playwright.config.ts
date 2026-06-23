import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		baseURL: "https://www.saucedemo.com",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "setup",
			testMatch: /auth\.setup\.ts/,
		},
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				storageState: ".auth/user.json",
			},
			dependencies: ["setup"],
			testMatch: /tests\/ui\/.*\.spec\.ts/,
			testIgnore: /tests\/ui\/auth\/.*/,
		},
		{
			name: "chromium-unauthenticated",
			use: { ...devices["Desktop Chrome"] },
			testMatch: /tests\/ui\/auth\/.*\.spec\.ts/,
		},
		{
			name: "api",
			testMatch: /tests\/api\/.*\.spec\.ts/,
		},
	],
});
