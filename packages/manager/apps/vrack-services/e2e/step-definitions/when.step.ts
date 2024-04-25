import { When } from '@cucumber/cucumber';
import { ICustomWorld } from '@playwright-helpers';
import { expect } from '@playwright/test';
import { vrackList } from '../../mock/vrack/vrack';
import { setupNetwork, getUrl } from '../utils';
import { ConfigParams } from '../../mock/handlers';
import {
  associateVrackButtonLabel,
  modalConfirmVrackAssociationButtonLabel,
  modalDeleteInputLabel,
} from '../../src/public/translations/vrack-services/listing/Messages_fr_FR.json';
import { orderButtonLabel } from '../../src/public/translations/vrack-services/onboarding/Messages_fr_FR.json';
import {
  modalCancelButtonLabel,
  modalConfirmVrackButtonLabel,
  modalNoVrackButtonLabel,
} from '../../src/public/translations/vrack-services/create/Messages_fr_FR.json';
import { vrackActionDissociate } from '../../src/public/translations/vrack-services/dashboard/Messages_fr_FR.json';
import {
  modalConfirmButton,
  modalCancelButton,
  modalDeleteButton,
} from '../../src/public/translations/vrack-services/Messages_fr_FR.json';
import {
  subnetNamePlaceholder,
  cidrPlaceholder,
  serviceRangePlaceholder,
  createSubnetButtonLabel,
  vlanSelectVlanOptionLabel,
  vlanNumberLabel,
  modalDeleteInputLabel as subnetsDeleteInputLabel,
} from '../../src/public/translations/vrack-services/subnets/Messages_fr_FR.json';
import {
  createEndpointButtonLabel,
  serviceNamePlaceholder,
  subnetPlaceholder,
  modalDeleteInputLabel as endpointsDeleteInputLabel,
} from '../../src/public/translations/vrack-services/endpoints/Messages_fr_FR.json';

When('User clicks on the vRack Services configuration button', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupNetwork(this);
  await this.page.goto(this.testContext.initialUrl || getUrl('root'), {
    waitUntil: 'load',
  });
  await this.page.locator('osds-button', { hasText: orderButtonLabel }).click();
});

When('User orders a vRack Services', async function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.deliveringVrackServicesOrders = true;
  await setupNetwork(this);
  await this.page.goto(this.testContext.initialUrl || getUrl('root'), {
    waitUntil: 'load',
  });
});

When(
  'User fills the configuration form and clicks the submit button',
  async function(this: ICustomWorld<ConfigParams>) {
    await setupNetwork(this);
    await this.page.goto(this.testContext.initialUrl || getUrl('root'), {
      waitUntil: 'load',
    });
    await this.page
      ?.locator(`osds-radio[id="${this.testContext.data.selectedRegion}"]`)
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
  await setupNetwork(this);
  await this.page.goto(this.testContext.initialUrl || getUrl('root'), {
    waitUntil: 'load',
  });

  const index = this.testContext.data.vsIndex || 0;

  const editButton = await this.page
    .locator('osds-button', {
      has: this.page.locator('osds-icon[name="pen"]'),
    })
    .nth(index);

  await expect(editButton).toBeVisible();

  await editButton.click();

  const input = await this.page.locator('input').nth(index);

  await expect(input).toBeVisible();

  await input.fill('test');
  await input.press('Enter');
});

When('User clicks on the link to associate a vRack', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupNetwork(this);
  await this.page.goto(this.testContext.initialUrl || getUrl('root'), {
    waitUntil: 'load',
  });

  const associateButton = await this.page
    .locator('osds-button', {
      hasText: associateVrackButtonLabel,
    })
    .nth(0);

  await expect(associateButton).toBeVisible();

  await associateButton.click();
});

When(
  'User selects a vRack in the association list and submits the form',
  async function(this: ICustomWorld<ConfigParams>) {
    await this.page.locator('osds-select').click();
    await this.page.getByText(vrackList[0]).click();

    await this.page.getByText(modalConfirmVrackAssociationButtonLabel).click();
  },
);

When('User click on the private network action menu button', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupNetwork(this);

  const { selectedVrackServices } = this.testContext.data;

  await this.page.waitForURL(
    getUrl('overview', { id: selectedVrackServices.id }),
    {
      waitUntil: 'load',
    },
  );

  if (await this.page.getByTestId('action-menu-icon').count()) {
    await this.page.getByTestId('action-menu-icon').click();
  }
});

When(
  'User click on dissociate in action menu of private network',
  async function(this: ICustomWorld<ConfigParams>) {
    await setupNetwork(this);
    const button = await this.page.getByText(vrackActionDissociate, {
      exact: true,
    });

    await expect(button).toBeVisible();

    await button.click();
  },
);

When('User {word} modal', async function(
  this: ICustomWorld<ConfigParams>,
  acceptOrCancel: 'accept' | 'cancel',
) {
  await setupNetwork(this);

  const labelToButton = {
    accept: modalConfirmButton,
    cancel: modalCancelButton,
  };
  const buttonLabel = labelToButton[acceptOrCancel];
  const button = await this.page.getByText(buttonLabel, { exact: true });

  await expect(button).toBeVisible();

  await button.click();
});

When('User fills the subnet form and clicks the submit button', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupNetwork(this);

  await this.page.goto(this.testContext.initialUrl, {
    waitUntil: 'load',
  });

  await this.page
    .getByRole('textbox', { name: subnetNamePlaceholder })
    .fill(this.testContext.data.name);
  await this.page
    .getByRole('textbox', { name: cidrPlaceholder })
    .fill(this.testContext.data.cidr);
  await this.page
    .getByRole('textbox', { name: serviceRangePlaceholder })
    .fill(this.testContext.data.serviceRange);

  if (this.testContext.data.vlan) {
    await this.page
      .locator('osds-radio-button', { hasText: vlanSelectVlanOptionLabel })
      .click();

    const vlanInput = await this.page
      .locator('osds-form-field', { hasText: vlanNumberLabel })
      .locator('input');

    await expect(vlanInput).toBeVisible();

    await vlanInput.fill(this.testContext.data.vlan);
  }

  await this.page
    .locator('osds-button', { hasText: createSubnetButtonLabel })
    .click();
});

When(
  'User fills the endpoints form and clicks the submit button',
  async function(this: ICustomWorld<ConfigParams>) {
    await setupNetwork(this);

    await this.page.goto(this.testContext.initialUrl, {
      waitUntil: 'load',
    });

    const select = await this.page.locator('osds-select', {
      hasText: serviceNamePlaceholder,
    });

    await expect(select).toBeVisible();

    select.click();
    await this.page.getByText('My-mongodb').click();

    await this.page
      .locator('osds-select', { hasText: subnetPlaceholder })
      .click();
    await this.page.getByText('My.Subnet').click();

    await this.page
      .locator('osds-button', { hasText: createEndpointButtonLabel })
      .click();
  },
);

When('User updates the display name of a subnet', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const editButton = await this.page
    .locator('osds-button', {
      has: this.page.locator('osds-icon[name="pen"]'),
    })
    .nth(0);

  await expect(editButton).toBeVisible();

  await editButton.click();

  const input = await this.page.locator('input').nth(0);

  await expect(input).toBeVisible();

  await input.fill('test');
  await input.press('Enter');
});

When('User clicks on the trash icon', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const deleteButton = await this.page
    .locator('osds-button', {
      has: this.page.locator('osds-icon[name="trash"]'),
    })
    .nth(0);

  await expect(deleteButton).toBeVisible();

  await deleteButton.click();
});

When('User fills the vRack Services delete form', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const input = await this.page
    .locator('osds-form-field', {
      hasText: modalDeleteInputLabel,
    })
    .locator('input');

  await expect(input).toBeVisible();

  await input.fill('TERMINATE');

  await this.page
    .locator('osds-button', { hasText: modalDeleteButton })
    .click();
});

When('User fills the {word} delete form', async function(
  this: ICustomWorld<ConfigParams>,
  tab: 'subnets' | 'endpoints',
) {
  const input = await this.page
    .locator('osds-form-field', {
      hasText:
        tab === 'subnets' ? subnetsDeleteInputLabel : endpointsDeleteInputLabel,
    })
    .locator('input');

  await expect(input).toBeVisible();

  await input.fill('TERMINATE');

  await this.page
    .locator('osds-button', { hasText: modalDeleteButton })
    .click();
});
