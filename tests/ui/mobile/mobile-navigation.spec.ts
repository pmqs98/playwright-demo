import { test } from "../../../fixtures";

test.describe("Mobile navigation", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/inventory.html");
	});

	test("hamburger menu opens and closes correctly @regression", async ({
		inventoryPage,
	}) => {
		await inventoryPage.openMenu();
		await inventoryPage.closeMenu();
	});
});
