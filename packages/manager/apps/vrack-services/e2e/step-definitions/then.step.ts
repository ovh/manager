import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '@playwright-helpers';
import { sleep } from '../../../../../../playwright-helpers';
import { modalDescriptionLine1 } from '../../src/public/translations/vrack-services/create/Messages_fr_FR.json';
import {
  createVrackServicesButtonLabel,
  emptyDataGridMessage,
  modalVrackAssociationDescription,
  modalVrackCreationDescriptionLine1,
  modalCreateNewVrackButtonLabel,
  associateVrackButtonLabel,
} from '../../src/public/translations/vrack-services/listing/Messages_fr_FR.json';
import {
  deliveringVrackMessage,
  deliveringVrackServicesMessage,
} from '../../src/public/translations/vrack-services/Messages_fr_FR.json';
import { getUrl } from '../utils';
import { ConfigParams } from '../../mock/handlers';
import vsMocks from '../../mock/vrack-services/get-vrack-services.json';
import {
  guide1Title,
  guide2Title,
} from '../../src/public/translations/vrack-services/onboarding/Messages_fr_FR.json';
import {
  onboardingDescription,
  betaSubnetLimitMessage,
} from '../../src/public/translations/vrack-services/subnets/Messages_fr_FR.json';
import { vrackActionDissociate } from '../../src/public/translations/vrack-services/dashboard/Messages_fr_FR.json';

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
    await this.page.waitForURL(getUrl('listing'), { waitUntil: 'load' });
  } else {
    expect(this.page.url()).toBe(getUrl('createVrackServices'));
  }
});

Then('User sees {word} error message', async function(
  this: ICustomWorld<ConfigParams>,
  anyErrorMessage: 'an' | 'no',
) {
  const error = await this.page.locator('osds-message', {
    hasText: new RegExp(
      this.testContext.errorMessage?.replace(/{{[a-zA-Z]+}}/gm, '.*'),
    ),
  });
  if (anyErrorMessage === 'an') {
    await expect(error).toBeVisible({ timeout: 300000 });
  }
});

Then('User gets redirected to Onboarding page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await this.page.waitForURL(getUrl('onboarding'), { waitUntil: 'load' });
});
Then('User sees {int} guides on vRack Services', async function(
  this: ICustomWorld,
  guideNumber: number,
) {
  const guideList = await Promise.all(
    [guide1Title, guide2Title].map((guideTitle) =>
      this.page.locator('div', {
        hasText: guideTitle,
      }),
    ),
  );
  expect(guideList).toHaveLength(guideNumber);
});

Then('User navigates to Configuration page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await this.page.waitForURL(getUrl('createVrackServices'), {
    waitUntil: 'load',
  });
});

Then('User navigates to Listing page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await this.page.waitForURL(getUrl('listing'), {
    waitUntil: 'load',
  });
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
    const vsDisplayName = await this.page.locator('osds-datagrid', {
      hasText: vsMocks[0].currentState.displayName,
    });
    await expect(vsDisplayName).toBeVisible();
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
    hasText: modalVrackCreationDescriptionLine1,
  });
  await expect(modalDescription).toBeVisible();
});

Then(
  'User sees {word} information message about the order status of his vRack',
  async function(this: ICustomWorld<ConfigParams>, anyMessage: 'an' | 'no') {
    await sleep(1000);

    const messageList = await this.page
      .getByText(new RegExp(deliveringVrackMessage.replace(/{{date}}.*/, '.*')))
      .all();

    if (anyMessage === 'an') {
      await expect(messageList.length).toBeGreaterThan(0);
    } else {
      await expect(messageList.length).toBe(0);
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
  if (buttonState === 'disabled') {
    await expect(button).toHaveAttribute('disabled', '');
  } else {
    await expect(button).not.toHaveAttribute('disabled', '');
  }
});

Then(
  'User sees the edit and associate a vRack buttons as {word}',
  async function(
    this: ICustomWorld<ConfigParams>,
    buttonState: 'disabled' | 'enabled',
  ) {
    await sleep(1000);

    const associateButtonList = await this.page
      .getByText(associateVrackButtonLabel)
      .all();
    const editButtonList = await this.page
      .locator('osds-button', {
        has: this.page.locator('osds-icon[name="pen"]'),
      })
      .all();

    const buttons =
      associateButtonList.length > 1
        ? {
            associateButton:
              associateButtonList[this.testContext.data.vsIndex || 0],
            editButton: editButtonList[this.testContext.data.vsIndex || 0],
          }
        : {
            associateButton: associateButtonList[0],
            editButton: editButtonList[0],
          };

    if (buttonState === 'disabled') {
      await expect(buttons.associateButton).toHaveAttribute('disabled', '');
      await expect(buttons.editButton).toHaveAttribute('disabled', '');
    } else {
      await expect(buttons.associateButton).not.toHaveAttribute('disabled', '');
      await expect(buttons.editButton).not.toHaveAttribute('disabled', '');
    }
  },
);

Then('User sees the subnet {word} page', async function(
  this: ICustomWorld<ConfigParams>,
  page: 'Listing' | 'Onboarding',
) {
  await sleep(1000);

  if (page === 'Onboarding') {
    const description = await this.page.getByText(onboardingDescription);
    expect(description).toBeVisible();
  } else {
    const listing = await this.page.locator('osds-datagrid');
    expect(listing).toBeVisible();
  }
});

Then('User {string} the action menu with button dissociate', async function(
  this: ICustomWorld<ConfigParams>,
  seeActionMenu: 'see' | "doesn't see",
) {
  await sleep(1000);
  const actionMenu = this.page.getByTestId('action-menu-icon');
  if (seeActionMenu === 'see') {
    expect(actionMenu).toBeInViewport();
  } else {
    expect(actionMenu).not.toBeInViewport();
  }
});

Then('User sees button dissociate', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await sleep(1000);
  const dissociateButton = this.page.getByText('vrackActionDissociate');
  if (await this.page.getByTestId('action-menu-icon').count()) {
    expect(dissociateButton).toBeVisible();
  } else {
    expect(dissociateButton).not.toBeVisible();
  }
});
