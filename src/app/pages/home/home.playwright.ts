import { expect, test } from "@playwright/test";

// Product cards render with data-testid="product-card-<id>" (product-card.component.html).
const productCards = '[data-testid^="product-card-"]';

test.describe("home page", () => {
	test("renders the welcome header and top rated section", async ({ page }) => {
		await page.goto("/");

		await expect(page.getByTestId("page-title")).toBeVisible();
		await expect(page.getByTestId("top-rated-title")).toBeVisible();
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

	test("the call-to-action navigates to the products page", async ({
		page,
	}) => {
		await page.goto("/");

		await page.getByTestId("all-products-link").click();

		await expect(page).toHaveURL(/\/products$/);
		await expect(page.getByTestId("page-title")).toBeVisible();
	});

	test("a product card navigates to its detail page", async ({ page }) => {
		await page.goto("/");

		await page.locator(productCards).first().click();

		await expect(page).toHaveURL(/\/products\/\d+$/);
	});
});
