import { Page, Locator } from "@playwright/test";

export class CartPage {
	private readonly cartItems: Locator;
	private readonly checkoutButton: Locator;
	private readonly continueShoppingButton: Locator;

	constructor(private page: Page) {
		this.cartItems = page.locator('[data-test="inventory-item"]');
		this.checkoutButton = page.locator('[data-test="checkout"]');
		this.continueShoppingButton = page.locator(
			'[data-test="continue-shopping"]',
		);
	}

	async goto(): Promise<void> {
		await this.page.goto("/cart.html");
	}

	async getItemCount(): Promise<number> {
		return await this.cartItems.count();
	}

	async getCartItems(): Promise<string[]> {
		return await this.cartItems
			.locator('[data-test="inventory-item-name"]')
			.allInnerTexts();
	}

	async removeItemByName(itemName: string): Promise<void> {
		const itemLocator = this.cartItems.filter({ hasText: itemName });
		const removeButton = itemLocator.getByRole("button", { name: "Remove" });
		await removeButton.click();
	}

	async proceedToCheckout(): Promise<void> {
		await this.checkoutButton.click();
	}

	async continueShopping(): Promise<void> {
		await this.continueShoppingButton.click();
	}
}
