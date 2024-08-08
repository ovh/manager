import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../../../../../../playwright-helpers';
import { ConfigParams, getUrl, setupNetwork } from '../utils';

Given('User has {int} elements in the Listing page', function(
  this: ICustomWorld<ConfigParams>,
  nb: number,
) {
  this.handlersConfig.nb = nb;
});

When('User navigates to Listing page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupNetwork(this);
  await this.page.goto(getUrl('listing'), { waitUntil: 'load' });
});

Then('User gets redirected to Onboarding page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await expect(this.page).toHaveURL(getUrl('onboarding'));
});

Then('User sees {int} guide', async function(
  this: ICustomWorld<ConfigParams>,
  nbGuides: number,
) {
  const guides = await this.page.locator('osds-tile');
  await expect(guides).toHaveCount(nbGuides);
});
