import { expect, test } from "@playwright/test";

test.describe("not found page", () => {
	test("renders for an unknown route (wildcard match)", async ({ page }) => {
		await page.goto("/this-route-does-not-exist");

		await expect(page.getByTestId("not-found-title")).toBeVisible();
		await expect(page.getByTestId("not-found-subtitle")).toBeVisible();
	});

	test("returns a real 404 status on the SSR response", async ({ page }) => {
		// NotFoundComponent sets RESPONSE_INIT.status = 404 during SSR so crawlers
		// see the page for what it is.
		const response = await page.goto("/definitely/not/here");

		expect(response?.status()).toBe(404);
	});

	test("links back to the home page", async ({ page }) => {
		await page.goto("/nope");

		await page.getByTestId("not-found-home").click();

		await expect(page).toHaveURL(/\/$/);
		await expect(page.getByTestId("page-title")).toBeVisible();
	});

	test("links to the products page", async ({ page }) => {
		await page.goto("/nope");

		await page.getByTestId("not-found-products").click();

		await expect(page).toHaveURL(/\/products$/);
		await expect(page.getByTestId("page-title")).toBeVisible();
	});
});
