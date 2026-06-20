import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/LoginPage";
import { SauceUser, PASSWORD } from "../../../utils/testData";

test.describe("Visual regression", () => {
	test("inventory page matches baseline screenshot", async ({ page }) => {
		const loginPage = new LoginPage(page);

		await loginPage.goto();
		await loginPage.login(SauceUser.STANDARD, PASSWORD);

		await expect(page).toHaveScreenshot("inventory-page.png", {
			maxDiffPixelRatio: 0.01,
		});
	});
});
