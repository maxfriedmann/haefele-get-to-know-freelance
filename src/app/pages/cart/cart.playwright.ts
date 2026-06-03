import { expect, type Page, test } from "@playwright/test";

// Copy as defined in src/app/i18n/en.json.
const TEXT = {
	empty: "Your cart is empty.",
	continueShopping: "Continue shopping",
	clear: "Clear cart",
	checkout: "Checkout",
	orderPlaced: "Order placed! Cart created",
};

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
	await page.getByRole("link", { name: "Cart" }).click();
	await expect(page).toHaveURL(/\/cart$/);
}

test.describe("cart page", () => {
	test("shows the empty state with a continue-shopping link", async ({
		page,
	}) => {
		await page.goto("/cart");

		await expect(page.getByText(TEXT.empty)).toBeVisible();

		await page.getByRole("link", { name: TEXT.continueShopping }).click();
		await expect(page).toHaveURL(/\/products$/);
	});

	test("lists a product added from the catalogue", async ({ page }) => {
		await addProductOneAndOpenCart(page);

		await expect(
			page.getByRole("link", { name: PRODUCT_1_TITLE }),
		).toBeVisible();
		await expect(page.locator(".join span")).toHaveText("1");
	});

	test("increments the quantity with the + control", async ({ page }) => {
		await addProductOneAndOpenCart(page);

		// The quantity stepper is a daisyUI join: [−] [qty] [+].
		await page.locator(".join").getByRole("button").last().click();

		await expect(page.locator(".join span")).toHaveText("2");
	});

	test("removes a line item", async ({ page }) => {
		await addProductOneAndOpenCart(page);

		await page.getByRole("button", { name: "Remove" }).click();

		await expect(page.getByText(TEXT.empty)).toBeVisible();
	});

	test("clears the whole cart", async ({ page }) => {
		await addProductOneAndOpenCart(page);

		await page.getByRole("button", { name: TEXT.clear }).click();

		await expect(page.getByText(TEXT.empty)).toBeVisible();
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

		await page.getByRole("button", { name: TEXT.checkout }).click();

		await expect(page.getByText(`${TEXT.orderPlaced} (#42)`)).toBeVisible();
	});
});
