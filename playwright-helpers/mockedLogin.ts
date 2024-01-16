import { Page, test } from '@playwright/test';
import user from './mocks/user';

export async function mockedLogin(page: Page): Promise<void> {
  await page.route('**/engine/2api/configuration?app=shell', (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify(user),
    }),
  );
}

type UseFunction = (page: Page) => Promise<void>;

export async function setupPage({ page }: { page: Page }, use: UseFunction) {
  await mockedLogin(page);
  await use(page);
}

test.use({ page: setupPage });
