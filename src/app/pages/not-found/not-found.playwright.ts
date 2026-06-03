import { expect, test } from "@playwright/test";

// Copy as defined in src/app/i18n/en.json.
const TEXT = {
	title: "Page not found",
	subTitle:
		"Sorry, the page you are looking for doesn't exist or has been moved.",
	backHome: "Back to home",
	browseProducts: "Browse products",
};

test.describe("not found page", () => {
	test("renders for an unknown route (wildcard match)", async ({ page }) => {
		await page.goto("/this-route-does-not-exist");

		await expect(
			page.getByRole("heading", { level: 1, name: TEXT.title }),
		).toBeVisible();
		await expect(page.getByText(TEXT.subTitle)).toBeVisible();
	});

	test("returns a real 404 status on the SSR response", async ({ page }) => {
		// NotFoundComponent sets RESPONSE_INIT.status = 404 during SSR so crawlers
		// see the page for what it is.
		const response = await page.goto("/definitely/not/here");

		expect(response?.status()).toBe(404);
	});

	test("links back to the home page", async ({ page }) => {
		await page.goto("/nope");

		await page.getByRole("link", { name: TEXT.backHome }).click();

		await expect(page).toHaveURL(/\/$/);
		await expect(
			page.getByRole("heading", { name: "Welcome to the Häfele shop" }),
		).toBeVisible();
	});

	test("links to the products page", async ({ page }) => {
		await page.goto("/nope");

		await page.getByRole("link", { name: TEXT.browseProducts }).click();

		await expect(page).toHaveURL(/\/products$/);
		await expect(
			page.getByRole("heading", { name: "Our Products" }),
		).toBeVisible();
	});
});
