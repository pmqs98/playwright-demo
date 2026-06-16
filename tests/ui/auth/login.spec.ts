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

	test("locked out user sees error message", async ({ page }) => {
		await page.locator('[data-test="username"]').fill("locked_out_user");
		await page.locator('[data-test="password"]').fill("secret_sauce");
		await page.locator('[data-test="login-button"]').click();

		await expect(page.locator('[data-test="error"]')).toContainText(
			"Epic sadface: Sorry, this user has been locked out.",
		);
	});

	test("wrong password shows error message", async ({ page }) => {
		await page.locator('[data-test="username"]').fill("standard_user");
		await page.locator('[data-test="password"]').fill("wrong_password");
		await page.locator('[data-test="login-button"]').click();

		await expect(page.locator('[data-test="error"]')).toContainText(
			"Username and password do not match",
		);
	});

	test("empty credentials shows error message", async ({ page }) => {
		await page.locator('[data-test="login-button"]').click();

		await expect(page.locator("[data-test='error']")).toContainText(
			"Username is required",
		);
	});

	test("successful login and logout", async ({ page }) => {
		await page.locator('[data-test="username"]').fill("standard_user");
		await page.locator('[data-test="password"]').fill("secret_sauce");
		await page.locator('[data-test="login-button"]').click();

		await expect(page).toHaveURL("/inventory.html");
		await expect(page.getByText("Products")).toBeVisible();
		await expect(
			page.locator('[data-test="inventory-container"]'),
		).toBeVisible();

		await page.getByRole("button", { name: "Open Menu" }).click();
		await page.locator('[data-test="logout-sidebar-link"]').click();

		await expect(page).toHaveURL("/");
		await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
	});
});
