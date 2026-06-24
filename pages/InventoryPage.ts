import { Page, Locator, expect } from "@playwright/test";

export type SortOption = "az" | "za" | "lohi" | "hilo";

export class InventoryPage {
	private readonly inventoryContainer: Locator;
	private readonly cartIcon: Locator;
	private readonly openMenuIcon: Locator;
	private readonly closeMenuIcon: Locator;
	private readonly sortSelect: Locator;
	private readonly logoutLink: Locator;

	constructor(private page: Page) {
		this.inventoryContainer = page.locator('[data-test="inventory-container"]');
		this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
		this.openMenuIcon = page.getByRole("button", { name: "Open Menu" });
		this.closeMenuIcon = page.getByRole("button", { name: "Close Menu" });
		this.sortSelect = page.locator('[data-test="product-sort-container"]');
		this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
	}

	private getItemLocatorByName(itemName: string): Locator {
		return this.page
			.locator('[data-test="inventory-item"]')
			.filter({ hasText: itemName });
	}

	async assertIsOnInventoryPage(): Promise<void> {
		await this.inventoryContainer.waitFor({ state: "visible" });
	}

	async sortItems(option: SortOption): Promise<void> {
		await this.sortSelect.selectOption(option);
	}

	async addItemToCartByName(itemName: string): Promise<void> {
		const itemLocator = this.getItemLocatorByName(itemName);
		const addToCartButton = itemLocator.getByRole("button", {
			name: "Add to cart",
		});

		await addToCartButton.click();
	}

	async getCartItemCount(): Promise<number> {
		const countText = await this.cartIcon.innerText();
		return parseInt(countText);
	}

	async getProductNames(): Promise<string[]> {
		const names = this.page.locator('[data-test="inventory-item-name"]');
		return await names.allInnerTexts();
	}

	async getProductPrices(): Promise<string[]> {
		const prices = this.page.locator('[data-test="inventory-item-price"]');
		return await prices.allInnerTexts();
	}

	async gotoCart(): Promise<void> {
		await this.cartIcon.click();
	}

	async openMenu(): Promise<void> {
		await this.openMenuIcon.click();
		await expect(this.logoutLink).toBeVisible();
	}

	async closeMenu(): Promise<void> {
		await this.closeMenuIcon.click();
		await expect(this.logoutLink).not.toBeVisible();
	}

	async logout(): Promise<void> {
		await this.openMenu();
		await this.logoutLink.click();
	}
}
