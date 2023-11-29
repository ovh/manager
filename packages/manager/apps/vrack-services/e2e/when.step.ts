import { When } from '@cucumber/cucumber';
import { ICustomWorld } from '../../../../../playwright-helpers/custom-world';
import { vrackList } from '../mock/vrack/vrack';
import { ConfigParams, setupPlaywrightHandlers } from '../mock/handlers';
import { associateVrackButtonLabel } from '../src/public/translations/vrack-services/listing/Messages_fr_FR.json';
import { orderButtonLabel } from '../src/public/translations/vrack-services/onboarding/Messages_fr_FR.json';
import {
  modalCancelButtonLabel,
  modalConfirmVrackButtonLabel,
  modalNoVrackButtonLabel,
} from '../src/public/translations/vrack-services/create/Messages_fr_FR.json';
import { urls } from './constants';
import { displayNameInputName } from '../src/pages/create/constants';

When('User navigates to vRack Services Listing page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.nbVs = this.handlersConfig.nbVs ?? 5;
  this.testContext.initialUrl = urls.listing;
  await setupPlaywrightHandlers(this);
  await this.page.waitForURL(urls.listing, { waitUntil: 'load' });
});

When('User clicks on the vRack Services configuration button', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupPlaywrightHandlers(this);
  await this.page.goto(this.testContext.initialUrl || urls.app, {
    waitUntil: 'load',
  });
  await this.page.locator('osds-button', { hasText: orderButtonLabel }).click();
});

When(
  'User fills the configuration form and click the submit button',
  async function(this: ICustomWorld<ConfigParams>) {
    await setupPlaywrightHandlers(this);
    await this.page.goto(this.testContext.initialUrl || urls.app, {
      waitUntil: 'load',
    });
    await this.page
      ?.locator(`input[name="${displayNameInputName}"]`)
      .fill(this.testContext.inputTexts.displayName);
    await this.page
      ?.locator(`osds-radio[id="${this.testContext.inputTexts.selectedZone}"]`)
      .click();
    await this.page?.locator('button[type="submit"]').click();
  },
);

When('User {word}', async function(
  this: ICustomWorld<ConfigParams>,
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

When('User edits the vRack Services name', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupPlaywrightHandlers(this);
  await this.page.goto(this.testContext.initialUrl || urls.app, {
    waitUntil: 'load',
  });
  const editButton = await this.page.locator('osds-button', {
    has: this.page.locator('osds-icon[name="pen"]'),
  });
  await editButton.click();
  const input = await this.page.locator('input');
  await input.fill('test');
  await input.press('Enter');
});

When('User click on the link to associate a vRack', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupPlaywrightHandlers(this);
  await this.page.goto(this.testContext.initialUrl || urls.app, {
    waitUntil: 'load',
  });
  const button = await this.page.locator('osds-button', {
    hasText: associateVrackButtonLabel,
  });
  await button.click();
});

When(
  'User selects a vRack in the association list and submits the form',
  async function(this: ICustomWorld<ConfigParams>) {
    const select = await this.page.locator('osds-select');
    await select.selectOption(vrackList[0]);
    const submitButton = await this.page.locator('osds-button', {
      hasText: associateVrackButtonLabel,
    });
    await submitButton.click();
  },
);
