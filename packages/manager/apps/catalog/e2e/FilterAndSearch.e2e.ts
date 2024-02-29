import { test, expect, Page, ElementHandle } from '@playwright/test';
import '@playwright-helpers/login';
import * as translation from '../src/public/translations/catalog/Messages_en_GB.json';

const clickButtonByName = async (page: Page, name: string): Promise<void> => {
  const buttons = await page.$$('osds-button');

  const targetButton = await Promise.all(
    buttons.map(async (button: ElementHandle) => {
      const buttonName = await button.evaluate((el: Element) =>
        el.getAttribute('name'),
      );
      return buttonName === name ? button : null;
    }),
  ).then((results) => results.find(Boolean));

  if (targetButton) {
    await targetButton.click();
  }
};

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
    { selector: 'card', expectedCount: expectedProductCount },
  );
  return page.$$('');
};

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

test('should filter results based on Bare Metal Cloud universe', async ({
  page,
}) => {
  await clickButtonByName(page, 'filterButton');
  await clickCheckboxByName(page, 'checkbox-universe-BareMetalCloud');
  await clickButtonByName(page, 'applyFilterButton');

  const products = await waitForProducts(page, 5);
  await validateProductCategories(products, [
    'Dedicated Servers',
    'Virtual Private Servers',
    'Managed Bare Metal',
    'Storage and Backup (BMC)',
    'Storage and Backup (BMC)',
  ]);
});

test('should clear all filters when Clear All button is clicked', async ({
  page,
}) => {
  await clickButtonByName(page, 'filterButton');
  await clickCheckboxByName(page, 'checkbox-universe-BareMetalCloud');
  await clickButtonByName(page, 'applyFilterButton');

  await waitForProducts(page, 5);

  await clickButtonByName(page, 'filterButton');

  const links = await page.$$('osds-link');
  const resetFilterLink = links[0];
  if (resetFilterLink) await resetFilterLink.click();

  await waitForProducts(page, 40);
});

// Scenario: No results after filtering
test('should show "No results found" when filters match no products', async ({
  page,
}) => {
  await clickButtonByName(page, 'filterButton');
  await clickCheckboxByName(page, 'checkbox-universe-BareMetalCloud');
  await clickCheckboxByName(page, 'checkbox-category-AI&machinelearning');
  await clickButtonByName(page, 'applyFilterButton');

  await waitForProducts(page, 0);

  await page.waitForSelector('osds-text.text-center');

  const elements = await page.$$('osds-text.text-center');
  expect(await elements[0].textContent()).toBe(translation.no_result);
});

test('should display chips when filter is enabled', async ({ page }) => {
  await clickButtonByName(page, 'filterButton');
  await clickCheckboxByName(page, 'checkbox-universe-BareMetalCloud');
  await clickButtonByName(page, 'applyFilterButton');

  await waitForProducts(page, 5);
  const elements = await page.$$('osds-chip');

  expect(await elements[0].textContent()).toBe('Bare Metal Cloud');
});

test('should clear all filters when chip is remove', async ({ page }) => {
  await clickButtonByName(page, 'filterButton');
  await clickCheckboxByName(page, 'checkbox-universe-BareMetalCloud');
  await clickButtonByName(page, 'applyFilterButton');

  await waitForProducts(page, 5);

  const elements = await page.$$('osds-chip');
  const chipBareMetalCloud = elements[0];
  if (chipBareMetalCloud) await chipBareMetalCloud.click();

  await waitForProducts(page, 40);
});
