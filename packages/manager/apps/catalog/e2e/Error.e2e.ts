import { test, expect } from '@playwright/test';
import '@playwright-helpers/login';
import * as translationsError from '../src/public/translations/catalog/error/Messages_fr_FR.json';

test('should display Error component if fetch fails', async ({ page }) => {
  await page.route('*/**/2api/hub/catalog', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });
  await page.reload();

  await page.waitForSelector('.manager-error-page');

  await expect(page.locator('osds-text')).toContainText(
    translationsError.manager_error_page_title,
  );

  await expect(
    page.locator('.manager-error-page osds-message'),
  ).toHaveAttribute('type', 'error');

  await expect(page.locator('osds-button:nth-child(1)')).toContainText(
    translationsError.manager_error_page_action_home_label,
  );

  await expect(page.locator('osds-button:nth-child(2)')).toContainText(
    translationsError.manager_error_page_action_reload_label,
  );
});
