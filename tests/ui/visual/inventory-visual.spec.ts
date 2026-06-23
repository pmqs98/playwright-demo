import { test, expect } from "../../../fixtures"; // changed from "@playwright/test"

test.describe("Visual regression", () => {
	test("inventory page matches baseline screenshot @regression", async ({
		page,
	}) => {
		await page.goto("/inventory.html");
		await expect(page).toHaveScreenshot("inventory-page.png", {
			maxDiffPixelRatio: 0.01,
		});
	});
});
