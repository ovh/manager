import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld, sleep } from '../../../../../../playwright-helpers';
import { ConfigParams, getUrl, setupNetwork } from '../utils';
import { title } from '../../src/public/translations/catalog/Messages_fr_FR.json';
import {
  manager_error_page_title,
  manager_error_page_action_home_label,
  manager_error_page_action_reload_label,
} from '../../src/public/translations/catalog/error/Messages_fr_FR.json';

Given('The service to fetch the catalog is {word}', function(
  this: ICustomWorld<ConfigParams>,
  apiState: 'OK' | 'KO',
) {
  this.handlersConfig.isKo = apiState === 'KO';
});

When('User navigates to catalog', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupNetwork(this);
  await this.page.goto(this.testContext.initialUrl || getUrl('root'), {
    waitUntil: 'load',
  });
});

Then('User {string} the list of products', async function(
  this: ICustomWorld<ConfigParams>,
  see: 'sees' | "doesn't see",
) {
  if (see === 'sees') {
    await sleep(1000);

    const titleElement = await this.page.locator('osds-text', {
      hasText: title,
    });
    await expect(titleElement).toBeVisible();

    const products = await this.page.locator('osds-tile').all();
    await expect(products).toHaveLength(40);
  }
});

Then('User sees {word} error', async function(
  this: ICustomWorld<ConfigParams>,
  anyError: 'an' | 'no',
) {
  if (anyError === 'an') {
    await expect(this.page.getByText(manager_error_page_title)).toBeVisible();

    await expect(
      this.page.getByText(manager_error_page_action_home_label),
    ).toBeVisible();

    await expect(
      this.page.getByText(manager_error_page_action_reload_label),
    ).toBeVisible();
  }
});
