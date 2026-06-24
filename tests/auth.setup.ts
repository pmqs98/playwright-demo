import { test as setup } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { SauceUser, PASSWORD } from "../utils/testData";

setup("authenticate as standard user", async ({ page }, testInfo) => {
	const project = testInfo.project.name;
	let authFile: string;
	if (project.includes("chromium")) {
		authFile = ".auth/chromium-user.json";
	} else if (project.includes("firefox")) {
		authFile = ".auth/firefox-user.json";
	} else if (project.includes("webkit")) {
		authFile = ".auth/webkit-user.json";
	} else {
		throw new Error(`No auth file mapping defined for project: ${project}`);
	}

	const loginPage = new LoginPage(page);

	await loginPage.goto();
	await loginPage.login(SauceUser.STANDARD, PASSWORD);
	await page.waitForURL("/inventory.html");

	await page.context().storageState({ path: authFile });
});
