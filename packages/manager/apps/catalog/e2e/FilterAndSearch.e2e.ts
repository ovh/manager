import { test, expect, ElementHandle } from '@playwright/test';
import '@playwright-helpers/mockedLogin';
import config from '@playwright-helpers/config';
import catalog from './mocks/catalog';
import * as translation from '../src/public/translations/catalog/Messages_en_GB.json';
import * as filterTranslation from '../src/public/translations/catalog/filters/Messages_en_GB.json';
import * as searchTranslation from '../src/public/translations/catalog/search/Messages_en_GB.json';

const validateProductCategories = async (
  products: ElementHandle[],
  expectedCategories: string[],
): Promise<void> => {
  const checks = products.map(async (product, index) => {
    const tileTypeElement = await product.$('.tile-type');
    expect(tileTypeElement).toBeTruthy();

    const tileTypeText = await tileTypeElement?.textContent();
    expect(tileTypeText?.trim()).toBe(expectedCategories[index]);

    expect(await product.$('.tile-title')).toBeTruthy();
  });

  await Promise.all(checks);
};

test.beforeEach(async ({ page }) => {
  await page.route('**/engine/2api/catalog', (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify(catalog),
    }),
  );
  await page.goto(config.appUrl);
  await page.waitForTimeout(2000);
});

test('should filter results based on Bare Metal Cloud universe', async ({
  page,
}) => {
  await page
    .getByText(searchTranslation.manager_catalog_search_filter_button)
    .click();
  const checkboxes = page.locator('osds-checkbox-button');
  await checkboxes.getByText('Bare Metal Cloud').click();
  await page
    .getByText(filterTranslation.manager_catalog_filters_button_apply)
    .click();

  await expect(
    page
      .locator('osds-text')
      .filter({ hasText: 'Product catalogue' })
      .filter({ hasText: '5' }),
  ).toBeVisible();

  await validateProductCategories(await page.$$('msc-tile'), [
    'Dedicated Servers',
    'Virtual Private Servers',
    'Managed Bare Metal',
    'Storage and Backup',
    'Storage and Backup',
  ]);
});

test('should clear all filters when Clear All button is clicked', async ({
  page,
}) => {
  await page
    .getByText(searchTranslation.manager_catalog_search_filter_button)
    .click();
  const checkboxes = page.locator('osds-checkbox-button');
  await checkboxes.getByText('Bare Metal Cloud').click();
  await page
    .getByText(filterTranslation.manager_catalog_filters_button_apply)
    .click();

  await expect(
    page
      .locator('osds-text')
      .filter({ hasText: 'Product catalogue' })
      .filter({ hasText: '5' }),
  ).toBeVisible();

  await page
    .getByText(searchTranslation.manager_catalog_search_filter_button)
    .click();

  await page.getByText('Clear all').click();

  await expect(
    page
      .locator('osds-text')
      .filter({ hasText: 'Product catalogue' })
      .filter({ hasText: '41' }),
  ).toBeVisible();
});

// Scenario: No results after filtering
test('should show "No results found" when filters match no products', async ({
  page,
}) => {
  await page
    .getByText(searchTranslation.manager_catalog_search_filter_button)
    .click();
  const checkboxes = page.locator('osds-checkbox-button');
  await checkboxes.getByText('Bare Metal Cloud').click();
  await checkboxes.getByText('AI & machine learning').click();
  await page
    .getByText(filterTranslation.manager_catalog_filters_button_apply)
    .click();

  await expect(
    page
      .locator('osds-text')
      .filter({ hasText: 'Product catalogue' })
      .filter({ hasText: '0' }),
  ).toBeVisible();

  await page.waitForSelector('osds-text.text-center');

  const elements = await page.$$('osds-text.text-center');
  expect(await elements[0].textContent()).toBe(translation.no_result);
});

test('should display chips when filter is enabled', async ({ page }) => {
  await page
    .getByText(searchTranslation.manager_catalog_search_filter_button)
    .click();
  const checkboxes = page.locator('osds-checkbox-button');
  await checkboxes.getByText('Bare Metal Cloud').click();
  await page
    .getByText(filterTranslation.manager_catalog_filters_button_apply)
    .click();

  await expect(
    page
      .locator('osds-text')
      .filter({ hasText: 'Product catalogue' })
      .filter({ hasText: '5' }),
  ).toBeVisible();
  await expect(page.locator('osds-chip')).toHaveText('Bare Metal Cloud');
});

test('should clear all filters when chip is remove', async ({ page }) => {
  await page
    .getByText(searchTranslation.manager_catalog_search_filter_button)
    .click();
  const checkboxes = page.locator('osds-checkbox-button');
  await checkboxes.getByText('Bare Metal Cloud').click();
  await page
    .getByText(filterTranslation.manager_catalog_filters_button_apply)
    .click();

  await expect(
    page
      .locator('osds-text')
      .filter({ hasText: 'Product catalogue' })
      .filter({ hasText: '5' }),
  ).toBeVisible();

  const chip = await page
    .locator('osds-chip')
    .filter({ hasText: 'Bare Metal Cloud' });
  await chip.locator('osds-icon').click();

  await expect(
    page
      .locator('osds-text')
      .filter({ hasText: 'Product catalogue' })
      .filter({ hasText: '41' }),
  ).toBeVisible();
});
