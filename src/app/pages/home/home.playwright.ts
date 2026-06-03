import { expect, test } from "@playwright/test";

// Copy as defined in src/app/i18n/de.json (the default language).
const TEXT = {
	title: "Willkommen im Häfele Shop",
	topRated: "Produkte mit guter Bewertung",
	allProducts: "Zeige alle Produkte",
};

// Product cards render with data-testid="product-card-<id>" (product-card.component.html).
const productCards = '[data-testid^="product-card-"]';

test.describe("home page", () => {
	test("renders the welcome header and top rated section", async ({ page }) => {
		await page.goto("/");

		await expect(
			page.getByRole("heading", { level: 1, name: TEXT.title }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: TEXT.topRated }),
		).toBeVisible();
	});

	test("shows top rated product cards once the store has loaded", async ({
		page,
	}) => {
		await page.goto("/");

		// store-loading swaps the spinner for the grid; auto-waiting on the first
		// card covers that transition.
		await expect(page.locator(productCards).first()).toBeVisible();
		expect(await page.locator(productCards).count()).toBeGreaterThan(0);
	});

	test("the call-to-action navigates to the products page", async ({ page }) => {
		await page.goto("/");

		await page.getByRole("button", { name: TEXT.allProducts }).click();

		await expect(page).toHaveURL(/\/products$/);
		await expect(
			page.getByRole("heading", { name: "Unsere Produkte" }),
		).toBeVisible();
	});

	test("a product card navigates to its detail page", async ({ page }) => {
		await page.goto("/");

		const firstCard = page.locator(productCards).first();
		await firstCard.click();

		await expect(page).toHaveURL(/\/products\/\d+$/);
	});
});
