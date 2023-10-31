// eslint-disable-next-line import/no-extraneous-dependencies
import { Given, When, Then, Before } from '@cucumber/cucumber';
import { ICustomWorld } from '../../../../../../../playwright-helpers/custom-world';
import { config } from '../../../../../../../playwright-helpers/config';
import { setupPlaywrightHandlers } from '../../../mock/handlers';
import { displayNameInputName } from './constants';
// import { expect } from '@playwright/test';

let displayName: string;
let selectedZone: string;
let vrackOrder: boolean;
let vrackServicesOrder: boolean;

Before(function(this: ICustomWorld) {
  displayName = '';
  selectedZone = '';
  vrackOrder = false;
  vrackServicesOrder = false;
});

Given(
  'User wants to create a vRack Services with name {string} and zone {word}',
  async function(this: ICustomWorld, name: string, zone: string) {
    await this.page?.goto(new URL('/#/create', config.appUrl).href);
    displayName = name;
    selectedZone = zone;
  },
);

Given('The order service for vRack Services is {word}', function(
  this: ICustomWorld,
  okOrKo: string,
) {
  vrackServicesOrder = okOrKo === 'OK';
});

Given('The order service for vRack is {word}', async function(
  this: ICustomWorld,
  okOrKo: string,
) {
  vrackOrder = okOrKo === 'OK';
  await setupPlaywrightHandlers(this.context, { nbVs: 2 });
});

When('User fill the form and click the submit button', async function(
  this: ICustomWorld,
) {
  await this.page
    ?.locator(`input[name="${displayNameInputName}"]`)
    .fill(displayName);
  await this.page?.locator(`osds-radio[id="${selectedZone}"]`).click();
  await this.page?.locator('button[type="submit"]').click();
});

Then(
  'A modal appear to ask if the user wants to create a new vRack',
  function() {
    console.log('test modal appearance');
  },
);

When('User {word}', function(this: ICustomWorld, acceptOrDeny: string) {
  console.log({ acceptOrDeny });
});

Then('User {string} on the Listing page', function(
  this: ICustomWorld,
  returnsListing: string,
) {
  console.log({ returnsListing });
});

Then('User sees {string} message for vRack Services', function(
  this: ICustomWorld,
  successOrError: string,
) {
  //   const plusButton = await page.locator('[data-testid="increase"]');
  //   await expect(plusButton).toBeVisible();
  //   const counterText = await page.locator('[data-testid="counter-text"]');
  //   await expect(counterText).toHaveText('Count: 1');
  console.log({ successOrError });
});

Then('User sees {string} message for vRack', function(
  this: ICustomWorld,
  successOrErrorOrNo: string,
) {
  //   const plusButton = await page.locator('[data-testid="increase"]');
  //   await expect(plusButton).toBeVisible();
  //   const counterText = await page.locator('[data-testid="counter-text"]');
  //   await expect(counterText).toHaveText('Count: 1');
  console.log({ successOrErrorOrNo });
});

Then('User sees {word} new line in the list of vRack Services', function(
  this: ICustomWorld,
  addedLine: string,
) {
  //   const plusButton = await page.locator('[data-testid="increase"]');
  //   await expect(plusButton).toBeVisible();
  //   await plusButton.click();
  console.log({ addedLine });
});
