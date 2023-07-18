import { Page, Response } from '@playwright/test';
import { config } from './config';

export async function login(page: Page): Promise<void> {
  await page.goto(config.appUrl);
  await page.fill('input#account', config.accountLogin);
  await page.locator('button#login-submit').click();
  await page.fill('input#userNameInput', config.email);
  await page.fill('input#passwordInput', config.password);
  await page.locator('#submitButton').click();
}

export async function logout(page: Page): Promise<Response | null> {
  return page?.goto(config.ovhLogout);
}
