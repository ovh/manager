import { Page, test } from '@playwright/test';
import config from './config';

export async function login(page: Page): Promise<void> {
  await page.goto(config.appUrl);
  await page.fill('input#account', config.accountLogin);
  await page.locator('button#login-submit').click();
  await page.fill('input#userNameInput', config.email);
  await page.fill('input#passwordInput', config.password);
  await page.locator('#submitButton').click();
}

export async function logout(page: Page): Promise<void> {
  await page.goto(config.ovhLogout);
}

type UseFunction = (page: Page) => Promise<void>;

export async function setupPage({ page }: { page: Page }, use: UseFunction) {
  await login(page);
  await page.waitForTimeout(2000); // for the tests when we need to do goto

  await use(page);

  await logout(page);
}

test.use({ page: setupPage });
