import { When } from '@cucumber/cucumber';
import { ICustomWorld } from '@playwright-helpers';
import { expect } from '@playwright/test';
import { vrackList } from '../../mock/vrack/vrack';
import {
  setupNetwork,
  getUrl,
  clickMenuButton,
  getDashboardEditButton,
} from '../utils';
import { ConfigParams } from '../../mock/handlers';
import listingLabels from '../../src/public/translations/vrack-services/listing/Messages_fr_FR.json';
import { orderButtonLabel } from '../../src/public/translations/vrack-services/onboarding/Messages_fr_FR.json';
import {
  modalCancelButtonLabel,
  modalConfirmVrackButtonLabel,
  modalNoVrackButtonLabel,
} from '../../src/public/translations/vrack-services/create/Messages_fr_FR.json';
import { vrackActionDissociate } from '../../src/public/translations/vrack-services/dashboard/Messages_fr_FR.json';
import generalLabels from '../../src/public/translations/vrack-services/Messages_fr_FR.json';
import subnetsLabels from '../../src/public/translations/vrack-services/subnets/Messages_fr_FR.json';
import endpointsLabels from '../../src/public/translations/vrack-services/endpoints/Messages_fr_FR.json';
import updateNameModalLabels from '../../../../../manager-components/src/components/templates/update-name-modal/translations/Messages_fr_FR.json';
import deleteModalLabels from '../../../../../manager-components/src/components/templates/delete-modal/translations/Messages_fr_FR.json';

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

When('User clicks on the link to associate a vRack', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupNetwork(this);
  await this.page.goto(this.testContext.initialUrl || getUrl('root'), {
    waitUntil: 'load',
  });

  await clickMenuButton({
    ctx: this,
    label: listingLabels.associateVrackButtonLabel,
    menuIndex: this.testContext.data.vsIndex || 0,
  });
});

When(
  'User selects a vRack in the association list and submits the form',
  async function(this: ICustomWorld<ConfigParams>) {
    await this.page.locator('osds-select').click();
    await this.page.getByText(vrackList[0]).click();

    await this.page
      .getByText(listingLabels.modalConfirmVrackAssociationButtonLabel)
      .click();
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
    accept: generalLabels.modalConfirmButton,
    cancel: generalLabels.modalCancelButton,
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
    .getByRole('textbox', { name: subnetsLabels.subnetNamePlaceholder })
    .fill(this.testContext.data.name);
  await this.page
    .getByRole('textbox', { name: subnetsLabels.cidrPlaceholder })
    .fill(this.testContext.data.cidr);
  await this.page
    .getByRole('textbox', { name: subnetsLabels.serviceRangePlaceholder })
    .fill(this.testContext.data.serviceRange);

  if (this.testContext.data.vlan) {
    await this.page
      .locator('osds-radio-button', {
        hasText: subnetsLabels.vlanSelectVlanOptionLabel,
      })
      .click();

    const vlanInput = await this.page
      .locator('osds-form-field', { hasText: subnetsLabels.vlanNumberLabel })
      .locator('input');

    await expect(vlanInput).toBeVisible();

    await vlanInput.fill(this.testContext.data.vlan);
  }

  await this.page
    .locator('osds-button', { hasText: subnetsLabels.createSubnetButtonLabel })
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
      hasText: endpointsLabels.serviceNamePlaceholder,
    });

    await expect(select).toBeVisible();

    select.click();
    await this.page.getByText('My-mongodb').click();

    await this.page
      .locator('osds-select', { hasText: endpointsLabels.subnetPlaceholder })
      .click();
    await this.page.getByText('My.Subnet').click();

    await this.page
      .locator('osds-button', {
        hasText: endpointsLabels.createEndpointButtonLabel,
      })
      .click();
  },
);

When('User updates the display name of a {word}', async function(
  this: ICustomWorld<ConfigParams>,
  page: 'subnet' | 'vrack-services',
) {
  await clickMenuButton({
    ctx: this,
    label:
      page === 'subnet'
        ? subnetsLabels['action-editDisplayName']
        : generalLabels['action-editDisplayName'],
  });

  const input = await this.page.locator('osds-form-field').locator('input');

  await expect(input).toBeVisible();

  await input.clear();

  await input.fill('test');

  await this.page
    .getByText(updateNameModalLabels.updateModalConfirmButton)
    .click();
});

When(
  'User updates the display name of this vRack Services from the overview',
  async function(this: ICustomWorld<ConfigParams>) {
    const editButton = await getDashboardEditButton({ ctx: this });
    await editButton.click();

    const input = await this.page.locator('osds-form-field').locator('input');

    await expect(input).toBeVisible();

    await input.clear();

    await input.fill('test');

    await this.page
      .getByText(updateNameModalLabels.updateModalConfirmButton)
      .click();
  },
);

When('User opens {word} delete modal', async function(
  this: ICustomWorld<ConfigParams>,
  page: 'vrack-services' | 'subnets' | 'endpoints',
) {
  const labelByPage = {
    'vrack-services': generalLabels['action-deleteVrackServices'],
    subnets: subnetsLabels['action-delete'],
    endpoints: endpointsLabels['action-deleteServiceEndpoint'],
  };
  await clickMenuButton({
    ctx: this,
    label: labelByPage[page],
  });
});

When('User fills the {word} delete form', async function(
  this: ICustomWorld<ConfigParams>,
  page: 'vrack-services' | 'subnets' | 'endpoints',
) {
  const headlineByPage = {
    'vrack-services': listingLabels.modalDeleteHeadline,
    subnets: subnetsLabels.modalDeleteHeadline,
    endpoints: endpointsLabels.modalDeleteHeadline,
  };

  await expect(
    this.page.locator('osds-modal').getByText(headlineByPage[page]),
  ).toBeVisible();

  const input = await this.page.locator('osds-form-field').locator('input');

  await expect(input).toBeVisible();

  await input.fill('TERMINATE');

  await this.page
    .locator('osds-modal')
    .getByText(deleteModalLabels.deleteModalDeleteButton, { exact: true })
    .click();
});
