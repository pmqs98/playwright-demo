// tests/ui/network/inventory-network.spec.ts
import { test } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { SauceUser, PASSWORD } from "../../utils/testData";

test.describe("Inventory Page - network resilience", () => {
	let loginPage: LoginPage;
	let inventoryPage: InventoryPage;

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page);
		inventoryPage = new InventoryPage(page);
		await loginPage.goto();
	});

	test("inventory page handles broken product images gracefully", async ({
		page,
	}) => {
		await page.route("**/*.{png,jpg,jpeg}", (route) => route.abort());

		await loginPage.login(SauceUser.STANDARD, PASSWORD);
		await inventoryPage.assertIsOnInventoryPage();
	});
});
