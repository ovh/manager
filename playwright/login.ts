import { test, TestFixture, Page } from '@playwright/test';
import * as config from './config.json';

export async function login(page): Promise<void> {
  await page.goto(config.appUrl);
  await page.fill('input#account', config.accountLogin);
  await page.locator('button#login-submit').click();
  await page.fill('input#userNameInput', config.email);
  await page.fill('input#passwordInput', config.password);
  await page.locator('#submitButton').click();
}

export async function logout(page): Promise<void> {
  return page.goto(config.ovhLogout);
}

const setupPage: TestFixture<{ page: Page }> = async ({ page }, use) => {
  await login(page);
  await page.waitForTimeout(2000); // for the tests when we need to do goto

  await use(page);

  await logout(page);
};

test.use({ page: setupPage });
