import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/LoginPage";
import { InventoryPage } from "../../../pages/InventoryPage";
import { SauceUser, PASSWORD } from "../../../utils/TestData";

test.describe("Login Page", () => {
	let loginPage: LoginPage;
	let inventoryPage: InventoryPage;

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page);
		inventoryPage = new InventoryPage(page);
		loginPage.goto();
	});

	test("valid credentails and redirect to inventory page", async ({ page }) => {
		loginPage.login(SauceUser.STANDARD, PASSWORD);

		await expect(page).toHaveURL("/inventory.html");
		await inventoryPage.assertIsOnInventoryPage();
	});

	test("locked out user sees error message", async () => {
		loginPage.login(SauceUser.LOCKED_OUT, PASSWORD);

		await loginPage.isErrorMessageVisible();
		expect(await loginPage.getErrorMessage()).toContain(
			"Epic sadface: Sorry, this user has been locked out.",
		);
	});

	test("wrong password shows error message", async () => {
		loginPage.login(SauceUser.STANDARD, "wrong_password");

		await loginPage.isErrorMessageVisible();
		expect(await loginPage.getErrorMessage()).toContain(
			"Username and password do not match",
		);
	});

	test("empty credentials shows error message", async () => {
		loginPage.login("", "");

		await loginPage.isErrorMessageVisible();
		expect(await loginPage.getErrorMessage()).toContain("Username is required");
	});

	test("successful login and logout", async ({ page }) => {
		loginPage.login(SauceUser.STANDARD, PASSWORD);

		await expect(page).toHaveURL("/inventory.html");

		await inventoryPage.assertIsOnInventoryPage();

		inventoryPage.logout();

		await expect(page).toHaveURL("/");
		await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
	});
});
