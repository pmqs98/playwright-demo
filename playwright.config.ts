import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [["html"], ["allure-playwright"]],
	use: {
		baseURL: "https://www.saucedemo.com",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "setup-chromium",
			use: { ...devices["Desktop Chrome"] },
			testMatch: /auth\.setup\.ts/,
		},
		{
			name: "setup-firefox",
			use: { ...devices["Desktop Firefox"] },
			testMatch: /auth\.setup\.ts/,
		},
		{
			name: "setup-webkit",
			use: { ...devices["Desktop Safari"] },
			testMatch: /auth\.setup\.ts/,
		},
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				storageState: ".auth/chromium-user.json",
			},
			dependencies: ["setup-chromium"],
			testMatch: /tests\/ui\/.*\.spec\.ts/,
			testIgnore: /tests\/ui\/auth\/.*/,
		},
		{
			name: "firefox",
			use: {
				...devices["Desktop Firefox"],
				storageState: ".auth/firefox-user.json",
			},
			dependencies: ["setup-firefox"],
			testMatch: /tests\/ui\/.*\.spec\.ts/,
			testIgnore: /tests\/ui\/auth\/.*/,
		},
		{
			name: "webkit",
			use: {
				...devices["Desktop Safari"],
				storageState: ".auth/webkit-user.json",
			},
			dependencies: ["setup-webkit"],
			testMatch: /tests\/ui\/.*\.spec\.ts/,
			testIgnore: /tests\/ui\/auth\/.*/,
		},
		{
			name: "chromium-unauthenticated",
			use: { ...devices["Desktop Chrome"] },
			testMatch: /tests\/ui\/auth\/.*\.spec\.ts/,
		},
		{
			name: "firefox-unauthenticated",
			use: {
				...devices["Desktop Firefox"],
			},
			testMatch: /tests\/ui\/auth\/.*\.spec\.ts/,
		},
		{
			name: "webkit-unauthenticated",
			use: {
				...devices["Desktop Safari"],
			},
			testMatch: /tests\/ui\/auth\/.*\.spec\.ts/,
		},
		{
			name: "api",
			testMatch: /tests\/api\/.*\.spec\.ts/,
		},
		{
			name: "mobile-chrome",
			use: { ...devices["Pixel 5"], storageState: ".auth/chromium-user.json" },
			dependencies: ["setup-chromium"],
			testMatch: /tests\/ui\/.*\.spec\.ts/,
			testIgnore: /tests\/ui\/auth\/.*/,
		},
		{
			name: "mobile-safari",
			use: { ...devices["iPhone 13"], storageState: ".auth/webkit-user.json" },
			dependencies: ["setup-webkit"],
			testMatch: /tests\/ui\/.*\.spec\.ts/,
			testIgnore: /tests\/ui\/auth\/.*/,
		},
	],
});
