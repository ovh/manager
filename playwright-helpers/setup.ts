import { Page, test } from '@playwright/test';
import { login, logout } from './login';

type UseFunction = (page: Page) => Promise<void>;

async function setupPage({ page }: { page: Page }, use: UseFunction) {
  await login(page);
  await page.waitForTimeout(4000); // for the tests when we need to do goto

  await use(page);

  await logout(page);
}

test.use({ page: setupPage });
