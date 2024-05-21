import { test, expect } from '@playwright/test';
import '@playwright-helpers/login';
import * as translationsError from '../public/translations/pci-rancher/dashboard/Messages_fr_FR.json';

test('should display Error component if fetch fails', async ({ page }) => {
  await page.route('*/**/2api/hub/catalog', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });
  await page.reload();
  await page.goto(
    'http://localhost:9000/#/pci/projects/039db9ba696a4072a33074fa63ffa831/rancher/222ce105-a3f7-44c4-a7d3-dbb5983c045d',
  );

  await page.waitForSelector('.manager-error-page');

  await expect(page.locator('osds-text')).toContainText(
    translationsError.allowedIps,
  );

  await expect(
    page.locator('.manager-error-page osds-message'),
  ).toHaveAttribute('type', 'error');

  await expect(page.locator('osds-button:nth-child(1)')).toContainText(
    translationsError.consumption,
  );

  await expect(page.locator('osds-button:nth-child(2)')).toContainText(
    translationsError.consumption,
  );
});
