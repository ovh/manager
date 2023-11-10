// eslint-disable-next-line import/no-extraneous-dependencies
import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../../../../../../../playwright-helpers/custom-world';
import { config } from '../../../../../../../playwright-helpers/config';
import { setupPlaywrightHandlers } from '../../../mock/handlers';
import { displayNameInputName } from './constants';
import {
  modalCancelButtonLabel,
  modalConfirmVrackButtonLabel,
  modalDescriptionLine1,
  modalNoVrackButtonLabel,
  creationServiceError,
} from '../../public/translations/vrack-services/create/Messages_fr_FR.json';

const createPageUrl = `${config.appUrl}#/create`;
const listingPageUrl = `${config.appUrl}#/`;

let displayName: string;
let selectedZone: string;
let vrackServicesOrderKo: boolean;

Before(function(this: ICustomWorld) {
  displayName = '';
  selectedZone = '';
  vrackServicesOrderKo = false;
});

Given(
  'User wants to create a vRack Services with name {string} and zone {word}',
  async function(this: ICustomWorld, name: string, zone: string) {
    await this.page?.goto(createPageUrl, { waitUntil: 'load' });
    displayName = name;
    selectedZone = zone;
  },
);

Given('The order service for vRack Services is {word}', function(
  this: ICustomWorld,
  okOrKo: string,
) {
  vrackServicesOrderKo = okOrKo === 'KO';
});

Given('The order service for vRack is {word}', async function(
  this: ICustomWorld,
  okOrKo: string,
) {
  await setupPlaywrightHandlers(this.context, {
    nbVs: 2,
    vrackOrderKo: okOrKo === 'KO',
    vrackServicesOrderKo,
  });
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
  async function(this: ICustomWorld) {
    const modalDescriptionLine = await this.page?.locator('osds-text', {
      hasText: modalDescriptionLine1,
    });
    expect(modalDescriptionLine).toBeVisible();
  },
);

When('User {word}', async function(
  this: ICustomWorld,
  acceptOrDenyOrCancel: 'accepts' | 'denies' | 'cancel',
) {
  const labelToButton = {
    accepts: modalConfirmVrackButtonLabel,
    denies: modalNoVrackButtonLabel,
    cancel: modalCancelButtonLabel,
  };
  const buttonLabel = labelToButton[acceptOrDenyOrCancel];
  const button = await this.page.locator('osds-button', {
    hasText: buttonLabel,
  });
  await button.click();
});

Then('User {string} on the Listing page', async function(
  this: ICustomWorld,
  returnsListing: 'returns' | "doesn't return",
) {
  if (returnsListing === 'returns') {
    await this.page.waitForURL(listingPageUrl, { waitUntil: 'load' });
  } else {
    expect(this.page.url()).toBe(createPageUrl);
  }
});

Then('User sees {word} error message', async function(
  this: ICustomWorld,
  anyErrorMessage: 'an' | 'no',
) {
  const error = await this.page.locator('osds-message', {
    hasText: creationServiceError,
  });
  if (anyErrorMessage === 'an') {
    await expect(error).toBeVisible();
  }
});
