import { test, expect } from '@playwright/test';
import '@playwright-helpers/login';

test('Navigates to a dashboard page', async ({ page }) => {
  await page.click(':nth-child(1) > a');
  await expect(page.locator('h1')).toContainText('Zimbra');
});
