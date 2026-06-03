import { expect, type Page, test } from "@playwright/test";

// The sort control is a daisyUI focus-based dropdown: clicking an option races
// with the trigger losing focus, so the option's (click) handler is sometimes
// swallowed. Retry the open->select until the trigger label reflects the choice.
// `label` is locale-invariant for the cases we assert (e.g. "Name (A–Z)").
async function selectSort(page: Page, value: string, label: string) {
	const trigger = page.getByTestId("sort-trigger");
	await expect(async () => {
		await trigger.click();
		await page.getByTestId(`sort-option-${value}`).click();
		await expect(trigger).toContainText(label, { timeout: 1000 });
	}).toPass();
}

// public/products.json is a fixed fixture of 20 products served from this app's
// own origin, so the rendered card count is deterministic.
const TOTAL_PRODUCTS = 20;

const productCards = '[data-testid^="product-card-"]';

test.describe("products page", () => {
	test("renders the header and the full product grid", async ({ page }) => {
		await page.goto("/products");

		await expect(page.getByTestId("page-title")).toBeVisible();
		await expect(page.locator(productCards)).toHaveCount(TOTAL_PRODUCTS);
	});

	test("filters the grid by the search term", async ({ page }) => {
		await page.goto("/products");
		await expect(page.locator(productCards)).toHaveCount(TOTAL_PRODUCTS);

		// "Fjallraven" is unique to product 1 in the fixture.
		await page.getByTestId("product-search").fill("Fjallraven");

		await expect(page.locator(productCards)).toHaveCount(1);
		await expect(page.getByTestId("product-card-1")).toBeVisible();
	});

	test("shows an empty state when nothing matches the search", async ({
		page,
	}) => {
		await page.goto("/products");

		await page.getByTestId("product-search").fill("zzzzznomatch");

		await expect(page.locator(productCards)).toHaveCount(0);
		await expect(page.getByTestId("no-products")).toBeVisible();
	});

	test("sorts the grid alphabetically (Name A–Z)", async ({ page }) => {
		await page.goto("/products");
		await expect(page.locator(productCards)).toHaveCount(TOTAL_PRODUCTS);

		await selectSort(page, "titleAsc", "Name (A–Z)");

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
