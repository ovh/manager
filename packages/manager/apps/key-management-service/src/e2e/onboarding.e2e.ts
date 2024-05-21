import { expect, test } from '@playwright/test';
import '@playwright-helpers/login';
import config from '@playwright-helpers/config';

test('Onboarding page should be present', async ({ page }) => {
  const onboardingPath = '/#/onboarding';
  const absoluteUrl = new URL(onboardingPath, config.appUrl).href;
  await page.goto(absoluteUrl);
  await expect(page.locator('h1')).toContainText('Onboarding page');
});
