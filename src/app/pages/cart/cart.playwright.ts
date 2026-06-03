import { expect, type Page, test } from "@playwright/test";

// Product 1 from public/products.json (product data is language-independent).
const PRODUCT_1_TITLE = "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops";

// The cart lives in the in-memory NgRx store (no persistence), so a full page
// reload would reset it. We add a product through the UI and then reach the cart
// via the nav link, which is a client-side navigation that keeps the store.
async function addProductOneAndOpenCart(page: Page) {
	await page.goto("/products");
	await page
		.getByTestId("product-card-1")
		.getByTestId("add-to-cart-button")
		.click();
	// nav-cart is rendered in both the desktop and mobile menus; .first() is the
	// desktop one (visible at the test viewport).
	await page.getByTestId("nav-cart").first().click();
	await expect(page).toHaveURL(/\/cart$/);
}

test.describe("cart page", () => {
	test("shows the empty state with a continue-shopping link", async ({
		page,
	}) => {
		await page.goto("/cart");

		await expect(page.getByTestId("cart-empty")).toBeVisible();

		await page.getByTestId("continue-shopping").click();
		await expect(page).toHaveURL(/\/products$/);
	});

	test("lists a product added from the catalogue", async ({ page }) => {
		await addProductOneAndOpenCart(page);

		await expect(
			page.getByRole("link", { name: PRODUCT_1_TITLE }),
		).toBeVisible();
		await expect(page.getByTestId("cart-qty")).toHaveText("1");
	});

	test("increments the quantity with the + control", async ({ page }) => {
		await addProductOneAndOpenCart(page);

		await page.getByTestId("cart-qty-increase").click();

		await expect(page.getByTestId("cart-qty")).toHaveText("2");
	});

	test("removes a line item", async ({ page }) => {
		await addProductOneAndOpenCart(page);

		await page.getByTestId("cart-remove").click();

		await expect(page.getByTestId("cart-empty")).toBeVisible();
	});

	test("clears the whole cart", async ({ page }) => {
		await addProductOneAndOpenCart(page);

		await page.getByTestId("cart-clear").click();

		await expect(page.getByTestId("cart-empty")).toBeVisible();
	});

	test("checks out and shows the order confirmation", async ({ page }) => {
		await addProductOneAndOpenCart(page);

		// Checkout POSTs to the upstream cart API; mock it so the test is
		// deterministic and offline (see core/constants.ts CART_API_BASE).
		await page.route("https://fakestoreapi.com/carts", (route) =>
			route.fulfill({
				json: { id: 42, userId: 1, date: "", products: [] },
			}),
		);

		await page.getByTestId("cart-checkout").click();

		await expect(page.getByTestId("cart-confirmation")).toContainText("#42");
	});
});
