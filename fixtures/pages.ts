import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { test as base } from "@playwright/test";

type PageFixtures = {
	loginPage: LoginPage;
	inventoryPage: InventoryPage;
	cartPage: CartPage;
};

export const test = base.extend<PageFixtures>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},
	inventoryPage: async ({ page }, use) => {
		await use(new InventoryPage(page));
	},
	cartPage: async ({ page }, use) => {
		await use(new CartPage(page));
	},
});
