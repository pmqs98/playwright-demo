import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("valid credentails and redirect to inventory page", async ({ page }) => {
		await page.locator('[data-test="username"]').fill("standard_user");
		await page.locator('[data-test="password"]').fill("secret_sauce");
		await page.locator('[data-test="login-button"]').click();

		await expect(page).toHaveURL("/inventory.html");
		await expect(page.getByText("Products")).toBeVisible();
		await expect(
			page.locator('[data-test="inventory-container"]'),
		).toBeVisible();
	});

	test("invalid credentials and show error message", async ({ page }) => {
		await page.locator('[data-test="username"]').fill("locked_out_user");
		await page.locator('[data-test="password"]').fill("secret_sauce");
		await page.locator('[data-test="login-button"]').click();

		await expect(page.locator('[data-test="error"]')).toContainText(
			"Epic sadface: Sorry, this user has been locked out.",
		);
	});
});
