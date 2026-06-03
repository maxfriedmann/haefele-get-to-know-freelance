import { expect, test } from "@playwright/test";

// Copy as defined in src/app/i18n/de.json (the default language).
const TEXT = {
	articleNumber: "Artikelnummer",
	relatedProducts: "Verwandte Produkte",
	productNotFound: "Produkt nicht gefunden",
};

// Product 1 from public/products.json.
const PRODUCT_1_TITLE = "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops";

test.describe("product detail page", () => {
	test("renders the selected product's details", async ({ page }) => {
		await page.goto("/products/1");

		await expect(
			page.getByRole("heading", { name: PRODUCT_1_TITLE }),
		).toBeVisible();
		await expect(page.getByText(`${TEXT.articleNumber}: 1`)).toBeVisible();
		// The main add-to-cart button comes before the related-products grid.
		await expect(page.getByTestId("add-to-cart-button").first()).toBeVisible();
	});

	test("shows a related products section", async ({ page }) => {
		await page.goto("/products/1");

		await expect(
			page.getByRole("heading", { name: TEXT.relatedProducts }),
		).toBeVisible();
		// Related products render as product cards (same category, excluding self).
		const related = page.locator('[data-testid^="product-card-"]');
		expect(await related.count()).toBeGreaterThan(0);
		await expect(page.getByTestId("product-card-1")).toHaveCount(0);
	});

	test("adding to the cart updates the nav cart badge", async ({ page }) => {
		await page.goto("/products/1");

		await page.getByTestId("add-to-cart-button").first().click();

		await expect(page.getByRole("link", { name: "Warenkorb" })).toContainText(
			"1",
		);
	});

	test("the back button returns to the products list", async ({ page }) => {
		await page.goto("/products/1");

		await page.getByRole("button", { name: "Back to Products" }).click();

		await expect(page).toHaveURL(/\/products$/);
	});

	test("shows a not-found message for an unknown product id", async ({
		page,
	}) => {
		await page.goto("/products/999999");

		await expect(page.getByText(TEXT.productNotFound)).toBeVisible();
	});
});
