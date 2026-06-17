import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
	private readonly usernameInput: Locator;
	private readonly passwordInput: Locator;
	private readonly errorMessage: Locator;
	private readonly loginButton: Locator;

	constructor(private page: Page) {
		this.usernameInput = page.locator('[data-test="username"]');
		this.passwordInput = page.locator('[data-test="password"]');
		this.errorMessage = page.locator('[data-test="error"]');
		this.loginButton = page.locator('[data-test="login-button"]');
	}

	async goto(): Promise<void> {
		await this.page.goto("/");
	}

	async login(username: string, password: string): Promise<void> {
		await this.usernameInput.fill(username);
		await this.passwordInput.fill(password);
		await this.loginButton.click();
	}

	async getErrorMessage(): Promise<string> {
		return await this.errorMessage.innerText();
	}

	async assertErrorMessageIsVisible(): Promise<void> {
		await expect(this.errorMessage).toBeVisible();
	}
}
