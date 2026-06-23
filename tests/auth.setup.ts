import { test as setup } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { SauceUser, PASSWORD } from "../utils/testData";

const authFile = ".auth/user.json";

setup("authenticate as standard user", async ({ page }) => {
	const loginPage = new LoginPage(page);

	await loginPage.goto();
	await loginPage.login(SauceUser.STANDARD, PASSWORD);
	await page.waitForURL("/inventory.html");

	await page.context().storageState({ path: authFile });
});
