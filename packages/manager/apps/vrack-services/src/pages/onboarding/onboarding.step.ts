// eslint-disable-next-line import/no-extraneous-dependencies
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../../../../../../../playwright-helpers/custom-world';
import { config } from '../../../../../../../playwright-helpers/config';
import { setupPlaywrightHandlers } from '../../../mock/handlers';
import { orderButtonLabel } from '../../public/translations/vrack-services/onboarding/Messages_fr_FR.json';

const onboardingPageUrl = `${config.appUrl}#/onboarding`;
const createPageUrl = `${config.appUrl}#/create`;

Given('User does not have any vRack Services', async function(
  this: ICustomWorld,
) {
  await setupPlaywrightHandlers(this.context, { nbVs: 0 });
});

When('User navigates to vRack Services Listing page', async function(
  this: ICustomWorld,
) {
  await this.page.goto(config.appUrl);
});

Then('User gets redirected to Onboarding page', async function(
  this: ICustomWorld,
) {
  await this.page.waitForURL(onboardingPageUrl, { waitUntil: 'load' });
});
Then('User sees {int} guides on vRack Services', async function(
  this: ICustomWorld,
  guideNumber: number,
) {
  const guideList = await this.page.locator('msc-tile').all();
  expect(guideList).toHaveLength(guideNumber);
});

Given('User is on the Onboarding page', async function(this: ICustomWorld) {
  await setupPlaywrightHandlers(this.context, { nbVs: 1 });
  await this.page.goto(onboardingPageUrl, { waitUntil: 'load' });
});

When('User clicks on the vRack Services configuration button', async function(
  this: ICustomWorld,
) {
  await this.page.locator('osds-button', { hasText: orderButtonLabel }).click();
});

Then('User navigates to Configuration page', async function(
  this: ICustomWorld,
) {
  await this.page.waitForURL(createPageUrl, { waitUntil: 'load' });
});
