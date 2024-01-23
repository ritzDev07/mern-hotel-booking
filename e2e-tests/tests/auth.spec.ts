import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/";

test('Should allow the user to sign in', async ({ page }) => {
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

test("Should allow user to register", async ({ page }) => {
	await page.goto(UI_URL);

	await page.getByRole("link", { name: "Sign in" }).click();
	await page.getByRole("link", { name: "Create an Account" }).click();

	await expect(page.getByRole("heading", { name: "Create an Account" })).toBeVisible();

	await page.locator("input[name=firstName]").fill("test firstname");
	await page.locator("input[name=lastName]").fill("test lastname");
	await page.locator("input[name=email]").fill("test1@email.com");
	await page.locator("input[name=password]").fill("test1234");
	await page.locator("input[name=confirmPassword]").fill("test1234");

	await page.getByRole("button", { name: "Create Account" }).click();
	
	await expect(page.getByText("Registration succesful!")).toBeVisible();
	await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
	await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});
