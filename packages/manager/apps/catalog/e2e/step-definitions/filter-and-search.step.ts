import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../../../../../../playwright-helpers';
import { no_result } from '../../src/public/translations/catalog/Messages_fr_FR.json';
import {
  manager_catalog_filters_button_apply,
  manager_catalog_filters_reset,
} from '../../src/public/translations/catalog/filters/Messages_fr_FR.json';
import { manager_catalog_search_filter_button } from '../../src/public/translations/catalog/search/Messages_fr_FR.json';
import { ConfigParams, selectFilters, setupE2eCatalogApp } from '../utils';

Given('User wants to filter products by universes {string}', function(
  this: ICustomWorld<ConfigParams>,
  universes: string,
) {
  this.testContext.data.filters = universes
    .split(',')
    .map((universe) => universe.replace(/\s/gm, '_'));
});

Given('User filtered the products with an universe', async function(
  this: ICustomWorld<ConfigParams>,
) {
  this.testContext.data.filters = ['Bare_Metal_Cloud'];

  await setupE2eCatalogApp(this);
  await selectFilters(this);
  await this.page.getByText(manager_catalog_filters_button_apply).click();
});

When('User selects the universes in the filters', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupE2eCatalogApp(this);
  await selectFilters(this);
});

When('User apply the search', async function(this: ICustomWorld<ConfigParams>) {
  await this.page.getByText(manager_catalog_filters_button_apply).click();
});

When('User clicks on the Clear All button', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await this.page.getByText(manager_catalog_search_filter_button).click();
  await this.page.getByText(manager_catalog_filters_reset).click();
});

When('User click on the remove button of a filter', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await this.page.locator('osds-chip osds-icon').click();
});

Then('User sees {int} products corresponding to the universe', async function(
  this: ICustomWorld<ConfigParams>,
  nbProducts,
) {
  const nb = await this.page.locator('osds-tile').count();
  await expect(nb).toBe(nbProducts);

  if (nb === 0) {
    const noResultText = await this.page.getByText(no_result);
    await expect(noResultText).toBeVisible();
  }
});

Then('The corresponding chip is removed', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const nbChips = await this.page.locator('osds-chip').count();
  await expect(nbChips).toBe(0);
});

Then('User sees all the products of the catalog', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const nb = await this.page.locator('osds-tile').count();
  await expect(nb).toBe(40);
});
