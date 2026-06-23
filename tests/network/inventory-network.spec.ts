import { test } from "../../fixtures";
import { SauceUser, PASSWORD } from "../../utils/testData";

test.describe("Inventory Page - network resilience", () => {
	test("inventory page handles broken product images gracefully @regression", async ({
		page,
		loginPage,
		inventoryPage,
	}) => {
		await page.goto("/inventory.html");
		await page.route("**/*.{png,jpg,jpeg}", (route) => route.abort());

		await loginPage.login(SauceUser.STANDARD, PASSWORD);
		await inventoryPage.assertIsOnInventoryPage();
	});
});
