/* eslint-disable no-await-in-loop */
import { ICustomWorld } from '@playwright-helpers';
import { ConfigParams } from './network';
import { manager_catalog_search_filter_button } from '../../src/public/translations/catalog/search/Messages_fr_FR.json';

export const selectFilters = async (ctx: ICustomWorld<ConfigParams>) => {
  const filters = ctx.testContext.data.filters as string[];

  await ctx.page.getByText(manager_catalog_search_filter_button).click();

  const checkboxes = await ctx.page.locator('osds-checkbox').all();

  // eslint-disable-next-line no-restricted-syntax
  for (const checkbox of checkboxes) {
    const checkboxName = await checkbox.evaluate((el: Element) =>
      el.getAttribute('name'),
    );
    if (filters.some((name) => checkboxName.includes(name))) {
      await checkbox.click();
    }
  }
};
