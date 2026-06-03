import { expect, type Page, test } from "@playwright/test";

// The sort control is a daisyUI focus-based dropdown: clicking an option races
// with the trigger losing focus, so the option's (click) handler is sometimes
// swallowed. Retry the open->select until the trigger label reflects the choice.
async function selectSort(page: Page, optionName: string) {
	const trigger = page.getByRole("button", { name: /Sortieren nach/ });
	await expect(async () => {
		await trigger.click();
		await page.getByRole("button", { name: optionName }).click();
		await expect(trigger).toContainText(optionName, { timeout: 1000 });
	}).toPass();
}

// Copy as defined in src/app/i18n/de.json (the default language).
const TEXT = {
	title: "Unsere Produkte",
	searchPlaceholder: "Produkt Liste durchsuchen...",
	noProductsFound: "Keine Produkte gefunden",
};

// public/products.json is a fixed fixture of 20 products served from this app's
// own origin, so the rendered card count is deterministic.
const TOTAL_PRODUCTS = 20;

const productCards = '[data-testid^="product-card-"]';

test.describe("products page", () => {
	test("renders the header and the full product grid", async ({ page }) => {
		await page.goto("/products");

		await expect(
			page.getByRole("heading", { level: 1, name: TEXT.title }),
		).toBeVisible();
		await expect(page.locator(productCards)).toHaveCount(TOTAL_PRODUCTS);
	});

	test("filters the grid by the search term", async ({ page }) => {
		await page.goto("/products");
		await expect(page.locator(productCards)).toHaveCount(TOTAL_PRODUCTS);

		// "Fjallraven" is unique to product 1 in the fixture.
		await page.getByPlaceholder(TEXT.searchPlaceholder).fill("Fjallraven");

		await expect(page.locator(productCards)).toHaveCount(1);
		await expect(page.getByTestId("product-card-1")).toBeVisible();
	});

	test("shows an empty state when nothing matches the search", async ({
		page,
	}) => {
		await page.goto("/products");

		await page.getByPlaceholder(TEXT.searchPlaceholder).fill("zzzzznomatch");

		await expect(page.locator(productCards)).toHaveCount(0);
		await expect(page.getByText(TEXT.noProductsFound)).toBeVisible();
	});

	test("sorts the grid alphabetically (Name A–Z)", async ({ page }) => {
		await page.goto("/products");
		await expect(page.locator(productCards)).toHaveCount(TOTAL_PRODUCTS);

		await selectSort(page, "Name (A–Z)");

		const titles = await page.locator(".card-title").allInnerTexts();
		const sorted = [...titles].sort((a, b) => a.localeCompare(b));
		expect(titles).toEqual(sorted);
	});

	test("a product card navigates to its detail page", async ({ page }) => {
		await page.goto("/products");

		await page.getByTestId("product-card-1").click();

		await expect(page).toHaveURL(/\/products\/1$/);
	});
});
