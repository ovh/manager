import { test, expect, Page, ElementHandle } from '@playwright/test';
import '@playwright-helpers/login';
import * as translation from '../src/public/translations/catalog/Messages_en_GB.json';
import * as filterTranslation from '../src/public/translations/catalog/filters/Messages_en_GB.json';
import * as searchTranslation from '../src/public/translations/catalog/search/Messages_en_GB.json';

const clickCheckboxByName = async (page: Page, name: string): Promise<void> => {
  const checkboxes = await page.$$('osds-checkbox');

  const targetCheckbox = await Promise.all(
    checkboxes.map(async (checkbox: ElementHandle) => {
      const checkboxName = await checkbox.evaluate((el: Element) =>
        el.getAttribute('name'),
      );
      return checkboxName === name ? checkbox : null;
    }),
  ).then((results) => results.find(Boolean));

  if (targetCheckbox) {
    await targetCheckbox.click();
  } else {
    // eslint-disable-next-line no-console
    console.warn(`Checkbox with name "${name}" not found.`);
  }
};

const waitForProducts = async (
  page: Page,
  expectedProductCount: number,
): Promise<ElementHandle[]> => {
  await page.waitForFunction(
    ({ selector, expectedCount }) =>
      document.querySelectorAll(selector).length === expectedCount,
    { selector: 'osds-tile', expectedCount: expectedProductCount },
  );
  return page.$$('osds-tile');
};

const validateProductCategories = async (
  products: ElementHandle[],
  expectedCategories: string[],
): Promise<void> => {
  const checks = products.map(async (product, index) => {
    const tileTypeElement = await product.$$('osds-text');
    expect(await tileTypeElement[0].textContent()).toBe(
      expectedCategories[index],
    );
  });

  await Promise.all(checks);
};

test('should filter results based on Bare Metal Cloud universe', async ({
  page,
}) => {
  await page
    .getByText(searchTranslation.manager_catalog_search_filter_button)
    .click();
  await clickCheckboxByName(page, 'checkbox-universe-Bare_Metal_Cloud');
  await page
    .getByText(filterTranslation.manager_catalog_filters_button_apply)
    .click();
  const products = await waitForProducts(page, 5);
  await validateProductCategories(products, [
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
  await clickCheckboxByName(page, 'checkbox-universe-Bare_Metal_Cloud');
  await page
    .getByText(filterTranslation.manager_catalog_filters_button_apply)
    .click();

  await waitForProducts(page, 5);
  await page
    .getByText(searchTranslation.manager_catalog_search_filter_button)
    .click();

  const links = await page.$$('osds-link');
  const resetFilterLink = links[0];
  if (resetFilterLink) await resetFilterLink.click();

  await waitForProducts(page, 41);
});

// Scenario: No results after filtering
test('should show "No results found" when filters match no products', async ({
  page,
}) => {
  await page
    .getByText(searchTranslation.manager_catalog_search_filter_button)
    .click();
  await clickCheckboxByName(page, 'checkbox-universe-Bare_Metal_Cloud');
  await clickCheckboxByName(page, 'checkbox-category-AI_&_machine_learning');
  await page
    .getByText(filterTranslation.manager_catalog_filters_button_apply)
    .click();

  await waitForProducts(page, 0);

  await page.waitForSelector('osds-text.text-center');

  const elements = await page.$$('osds-text.text-center');
  expect(await elements[0].textContent()).toBe(translation.no_result);
});

test('should display chips when filter is enabled', async ({ page }) => {
  await page
    .getByText(searchTranslation.manager_catalog_search_filter_button)
    .click();
  await clickCheckboxByName(page, 'checkbox-universe-Bare_Metal_Cloud');
  await page
    .getByText(filterTranslation.manager_catalog_filters_button_apply)
    .click();

  await waitForProducts(page, 5);
  const elements = await page.$$('osds-chip');

  expect(await elements[0].textContent()).toBe('Bare Metal Cloud');
});

test('should clear all filters when chip is remove', async ({ page }) => {
  await page
    .getByText(searchTranslation.manager_catalog_search_filter_button)
    .click();
  await clickCheckboxByName(page, 'checkbox-universe-Bare_Metal_Cloud');
  await page
    .getByText(filterTranslation.manager_catalog_filters_button_apply)
    .click();

  await waitForProducts(page, 5);

  const element = page.locator('osds-chip osds-icon');
  if (element) await element.click();

  await waitForProducts(page, 41);
});
