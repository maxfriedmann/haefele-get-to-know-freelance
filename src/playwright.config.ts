import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:4200";

const { CI } = process.env;

export default defineConfig({
	testDir: "./app",
	testMatch: "**/*.playwright.ts",
	fullyParallel: true,
	forbidOnly: !!CI,
	retries: CI ? 2 : 0,
	reporter: "html",
	use: {
		baseURL,
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	// Reuse a dev server already listening on 4200; otherwise start one.
	webServer: {
		command: "npm start",
		port: 4200,
		reuseExistingServer: true,
		timeout: 120_000,
	},
});
