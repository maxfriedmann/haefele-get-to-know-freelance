import { expect, type Page, test } from "@playwright/test";

// Nav labels as defined in src/app/i18n/{en,de}.json.
const NAV = {
	en: { home: "Home", products: "Products", cart: "Cart" },
	de: { home: "Startseite", products: "Produkte", cart: "Warenkorb" },
};

async function selectLanguage(page: Page, code: "en" | "de") {
	await page.getByTestId("language-trigger").click();
	await page.getByTestId(`language-option-${code}`).click();
}

test.describe("language chooser", () => {
	test("defaults to German", async ({ page }) => {
		await page.goto("/");

		await expect(page.getByRole("link", { name: NAV.de.home })).toBeVisible();
		await expect(page.getByTestId("language-trigger")).toContainText("de");
	});

	test("switches the nav labels to English", async ({ page }) => {
		await page.goto("/");
		await selectLanguage(page, "en");

		await expect(page.getByRole("link", { name: NAV.en.home })).toBeVisible();
		await expect(
			page.getByRole("link", { name: NAV.en.products }),
		).toBeVisible();
		await expect(page.getByRole("link", { name: NAV.en.cart })).toBeVisible();
		// German labels are gone.
		await expect(page.getByRole("link", { name: NAV.de.home })).toHaveCount(0);
	});

	test("closes the dropdown after selecting", async ({ page }) => {
		await page.goto("/");
		await selectLanguage(page, "en");

		// The menu items are only interactable while the dropdown is open.
		await expect(page.getByTestId("language-option-de")).toBeHidden();
	});

	test("persists the choice across reloads via localStorage", async ({
		page,
	}) => {
		await page.goto("/");
		await selectLanguage(page, "en");

		await expect
			.poll(() => page.evaluate(() => localStorage.getItem("language")))
			.toBe("en");

		await page.reload();

		// Restored from localStorage on load — no need to reselect.
		await expect(page.getByRole("link", { name: NAV.en.home })).toBeVisible();
		await expect(page.getByTestId("language-trigger")).toContainText("en");
	});
});
