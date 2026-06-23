import { test, expect } from "../../../fixtures";
import { SauceUser, PASSWORD } from "../../../utils/testData";

test.describe("Login Page", () => {
	test.beforeEach(async ({ loginPage }) => {
		await loginPage.goto();
	});

	test("valid credentials and redirect to inventory page @smoke", async ({
		page,
		inventoryPage,
		loginPage,
	}) => {
		await loginPage.login(SauceUser.STANDARD, PASSWORD);

		await expect(page).toHaveURL("/inventory.html");
		await inventoryPage.assertIsOnInventoryPage();
	});

	test("locked out user sees error message @regression", async ({
		loginPage,
	}) => {
		await loginPage.login(SauceUser.LOCKED_OUT, PASSWORD);

		await loginPage.assertErrorMessageIsVisible();
		expect(await loginPage.getErrorMessage()).toContain(
			"Epic sadface: Sorry, this user has been locked out.",
		);
	});

	test("wrong password shows error message @regression", async ({
		loginPage,
	}) => {
		await loginPage.login(SauceUser.STANDARD, "wrong_password");

		await loginPage.assertErrorMessageIsVisible();
		expect(await loginPage.getErrorMessage()).toContain(
			"Username and password do not match",
		);
	});

	test("empty credentials shows error message @regression", async ({
		loginPage,
	}) => {
		await loginPage.login("", "");

		await loginPage.assertErrorMessageIsVisible();
		expect(await loginPage.getErrorMessage()).toContain("Username is required");
	});

	test("successful login and logout @regression", async ({
		page,
		loginPage,
		inventoryPage,
	}) => {
		await loginPage.login(SauceUser.STANDARD, PASSWORD);

		await expect(page).toHaveURL("/inventory.html");

		await inventoryPage.assertIsOnInventoryPage();

		await inventoryPage.logout();

		await expect(page).toHaveURL("/");
		await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
	});
});
