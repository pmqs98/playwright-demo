import { test, expect } from "../../../fixtures";

test.describe("Cart", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/inventory.html");
	});

	test("add items to cart and verify cart count @smoke", async ({
		inventoryPage,
	}) => {
		const itemsToAdd = ["Sauce Labs Backpack", "Sauce Labs Bike Light"];

		for (const item of itemsToAdd) {
			await inventoryPage.addItemToCartByName(item);
		}

		const cartCount = await inventoryPage.getCartItemCount();
		expect(cartCount).toBe(itemsToAdd.length);
	});

	test("remove items from cart and verify cart count @regression", async ({
		inventoryPage,
		cartPage,
	}) => {
		await inventoryPage.addItemToCartByName("Sauce Labs Backpack");
		expect(await inventoryPage.getCartItemCount()).toBe(1);

		await inventoryPage.gotoCart();
		await cartPage.removeItemByName("Sauce Labs Backpack");
		expect(await cartPage.getItemCount()).toBe(0);
	});

	test("sort items in inventory from A to Z and verify order @regression", async ({
		inventoryPage,
	}) => {
		await inventoryPage.sortItems("az");
		const productNamesAZ = await inventoryPage.getProductNames();

		const sortedAZ = [...productNamesAZ].sort();
		expect(productNamesAZ).toEqual(sortedAZ);
	});

	test("sort items in inventory from Z to A and verify order @regression", async ({
		inventoryPage,
	}) => {
		await inventoryPage.sortItems("za");
		const productNamesZA = await inventoryPage.getProductNames();

		const sortedZA = [...productNamesZA].sort().reverse();
		expect(productNamesZA).toEqual(sortedZA);
	});

	test("sort items in inventory from low to high and verify order @regression", async ({
		inventoryPage,
	}) => {
		await inventoryPage.sortItems("lohi");
		const productPrices = await inventoryPage.getProductPrices();

		const sortedPrices = [...productPrices].sort(
			(a, b) => parseFloat(a.replace("$", "")) - parseFloat(b.replace("$", "")),
		);
		expect(productPrices).toEqual(sortedPrices);
	});

	test("sort items in inventory from high to low and verify order @regression", async ({
		inventoryPage,
	}) => {
		await inventoryPage.sortItems("hilo");
		const productPrices = await inventoryPage.getProductPrices();

		const sortedPrices = [...productPrices].sort(
			(a, b) => parseFloat(b.replace("$", "")) - parseFloat(a.replace("$", "")),
		);
		expect(productPrices).toEqual(sortedPrices);
	});
});
