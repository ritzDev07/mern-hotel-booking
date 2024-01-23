import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/";

test('should allow the user to sign in', async ({ page }) => {
	await page.goto(UI_URL);

	//get the sign in button
	await page.getByRole("link", { name: "Sign In" }).click();

	await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

	await page.locator("input[name=email]").fill("admin@test.com");
	await page.locator("input[name=password]").fill("admin1234");

	await page.getByRole("button", { name: "Login" }).click();

	await expect(page.getByText("Sign in Successful")).toBeVisible();
	await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
	await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();

});
