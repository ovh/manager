// eslint-disable-next-line import/no-extraneous-dependencies
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '@playwright-helpers/custom-world';
import { modalDescriptionLine1 } from '../src/public/translations/vrack-services/create/Messages_fr_FR.json';
import {
  createVrackServicesButtonLabel,
  deliveringVrackServicesMessage,
  emptyDataGridMessage,
  deliveringVrackMessage,
  modalVrackAssociationDescription,
  modalVrackCreationDescription,
  modalCreateNewVrackButtonLabel,
  associateVrackButtonLabel,
} from '../src/public/translations/vrack-services/listing/Messages_fr_FR.json';
import { urls } from './constants';
import { ConfigParams } from '../mock/handlers';

Then('User sees the create a vRack Services button {word}', async function(
  this: ICustomWorld<ConfigParams>,
  buttonState: 'enabled' | 'disabled',
) {
  const button = await this.page.locator('osds-button', {
    hasText: createVrackServicesButtonLabel,
  });
  if (buttonState === 'enabled') {
    await expect(button).not.toHaveAttribute('disabled', '');
  } else {
    await expect(button).toHaveAttribute('disabled', '');
  }
});

Then(
  'A modal appear to ask if the user wants to create a new vRack',
  async function(this: ICustomWorld<ConfigParams>) {
    const modalDescriptionLine = await this.page?.locator('osds-text', {
      hasText: modalDescriptionLine1,
    });
    expect(modalDescriptionLine).toBeVisible();
  },
);

Then('User {string} on the Listing page', async function(
  this: ICustomWorld<ConfigParams>,
  returnsListing: 'returns' | "doesn't return",
) {
  if (returnsListing === 'returns') {
    await this.page.waitForURL(urls.listing, { waitUntil: 'load' });
  } else {
    expect(this.page.url()).toBe(urls.create);
  }
});

Then('User sees {word} error message', async function(
  this: ICustomWorld<ConfigParams>,
  anyErrorMessage: 'an' | 'no',
) {
  const error = await this.page.locator('osds-message', {
    hasText: new RegExp(this.testContext.errorMessage),
  });
  if (anyErrorMessage === 'an') {
    await expect(error).toBeVisible({ timeout: 300000 });
  }
});

Then('User gets redirected to Onboarding page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await this.page.waitForURL(urls.onboarding, { waitUntil: 'load' });
});
Then('User sees {int} guides on vRack Services', async function(
  this: ICustomWorld,
  guideNumber: number,
) {
  const guideList = await this.page.locator('msc-tile').all();
  expect(guideList).toHaveLength(guideNumber);
});

Then('User navigates to Configuration page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await this.page.waitForURL(urls.create, { waitUntil: 'load' });
});

Then(
  'User sees an information message about the order status of his vRack Services',
  async function(this: ICustomWorld<ConfigParams>) {
    const message = await this.page.locator('osds-message', {
      hasText: new RegExp(
        deliveringVrackServicesMessage.replace(/{{date}}.*/, '.*'),
      ),
    });
    await expect(message).toBeVisible();
  },
);
Then('User sees an empty listing page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const message = await this.page.locator('osds-datagrid', {
    hasText: emptyDataGridMessage,
  });
  await expect(message).toBeVisible();
});

Then(
  'User sees a data grid containing his vRack Services information',
  async function(this: ICustomWorld<ConfigParams>) {
    const datagrid = await this.page.locator('osds-datagrid');
    await expect(datagrid).toBeVisible();
  },
);

Then('User sees a modal to select an eligible vRack', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const modalDescription = await this.page.locator('osds-modal', {
    hasText: modalVrackAssociationDescription,
  });
  await expect(modalDescription).toBeVisible();
});

Then('User sees a modal to create a new vRack', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const modalDescription = await this.page.locator('osds-modal', {
    hasText: modalVrackCreationDescription,
  });
  await expect(modalDescription).toBeVisible();
});

Then(
  'User sees {word} information message about the order status of his vRack',
  async function(this: ICustomWorld<ConfigParams>, anyMessage: 'an' | 'no') {
    const message = await this.page.locator('osds-message', {
      hasText: new RegExp(deliveringVrackMessage.replace(/{date}.*/, '.*')),
    });
    if (anyMessage === 'an') {
      await expect(message).toBeVisible();
    } else {
      await expect(message).not.toBeVisible();
    }
  },
);

Then('The button to create a vRack is {word}', async function(
  this: ICustomWorld<ConfigParams>,
  buttonState: 'disabled' | 'enabled',
) {
  const button = await this.page.locator('osds-button', {
    hasText: modalCreateNewVrackButtonLabel,
  });
  if (buttonState === 'enabled') {
    await expect(button).not.toHaveAttribute('disabled', '');
  } else {
    await expect(button).toHaveAttribute('disabled', '');
  }
});

Then(
  'User sees the edit and associate a vRack buttons as disabled',
  async function(this: ICustomWorld<ConfigParams>) {
    const associateButton = await this.page.locator('osds-button', {
      hasText: associateVrackButtonLabel,
    });
    const editButton = await this.page.locator('osds-button', {
      has: this.page.locator('osds-icon[name="pen"]'),
    });
    await expect(associateButton).toHaveAttribute('disabled', '');
    await expect(editButton).toHaveAttribute('disabled', '');
  },
);
