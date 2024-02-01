import { When } from '@cucumber/cucumber';
import { ICustomWorld } from '@playwright-helpers/custom-world';
import { vrackList } from '../../mock/vrack/vrack';
import { ConfigParams, setupPlaywrightHandlers } from '../../mock/handlers';
import {
  associateVrackButtonLabel,
  modalCreateNewVrackButtonLabel,
  modalVrackAssociationDescription,
} from '../../src/public/translations/vrack-services/listing/Messages_fr_FR.json';
import { orderButtonLabel } from '../../src/public/translations/vrack-services/onboarding/Messages_fr_FR.json';
import {
  modalCancelButtonLabel,
  modalConfirmVrackButtonLabel,
  modalNoVrackButtonLabel,
} from '../../src/public/translations/vrack-services/create/Messages_fr_FR.json';
import { urls, sleep } from '../utils';
import { displayNameInputName } from '../../src/pages/create/constants';

When('User navigates to vRack Services Listing page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.nbVs = this.handlersConfig.nbVs ?? 5;
  this.testContext.initialUrl = urls.listing;
  await setupPlaywrightHandlers(this);
  await this.page.goto(urls.listing, { waitUntil: 'load' });
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
      ?.locator(
        `osds-radio[id="${this.testContext.inputTexts.selectedRegion}"]`,
      )
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
  const input = await this.page.locator('input').all();
  await input[0].fill('test');
  await input[0].press('Enter');
});

When('User click on the link to associate a vRack', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupPlaywrightHandlers(this);
  await this.page.goto(this.testContext.initialUrl || urls.app, {
    waitUntil: 'load',
  });
  const buttonList = await this.page
    .locator('osds-button', {
      hasText: associateVrackButtonLabel,
    })
    .all();

  await sleep();
  console.log({ buttonList });
  const button = buttonList.length > 1 ? buttonList[1] : buttonList[0];
  await button.click();
});

When(
  'User selects a vRack in the association list and submits the form',
  async function(this: ICustomWorld<ConfigParams>) {
    const associationModal = await this.page.locator('osds-modal', {
      hasText: modalVrackAssociationDescription,
    });
    const select = await associationModal.locator('osds-select');
    await select.selectOption(vrackList[0]);
    const submitButton = await associationModal.locator('osds-button', {
      hasText: modalCreateNewVrackButtonLabel,
    });
    await submitButton.click();
  },
);
