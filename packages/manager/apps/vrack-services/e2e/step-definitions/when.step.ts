import { When } from '@cucumber/cucumber';
import { ICustomWorld } from '@playwright-helpers';
import { sleep } from '../../../../../../playwright-helpers';
import { vrackList } from '../../mock/vrack/vrack';
import { setupNetwork, getUrl } from '../utils';
import { ConfigParams } from '../../mock/handlers';
import {
  associateVrackButtonLabel,
  modalConfirmVrackAssociationButtonLabel,
  modalVrackAssociationDescription,
} from '../../src/public/translations/vrack-services/listing/Messages_fr_FR.json';
import { orderButtonLabel } from '../../src/public/translations/vrack-services/onboarding/Messages_fr_FR.json';
import {
  modalCancelButtonLabel,
  modalConfirmVrackButtonLabel,
  modalNoVrackButtonLabel,
} from '../../src/public/translations/vrack-services/create/Messages_fr_FR.json';
import { displayNameInputName } from '../../src/pages/create/constants';
import {
  subnetsTabLabel,
  vrackActionDissociate,
} from '../../src/public/translations/vrack-services/dashboard/Messages_fr_FR.json';
import {
  modalConfirmButton,
  modalCancelButton,
} from '../../src/public/translations/vrack-services/Messages_fr_FR.json';

When('User navigates to vRack Services Listing page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.nbVs = this.handlersConfig.nbVs ?? 5;
  this.testContext.initialUrl = getUrl('listing');
  await setupNetwork(this);
  await this.page.goto(getUrl('listing'), { waitUntil: 'load' });
});

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
      ?.locator(`input[name="${displayNameInputName}"]`)
      .fill(this.testContext.data.displayName.toString());
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

  await sleep(1000);

  const editButtonList = await this.page
    .locator('osds-button', {
      has: this.page.locator('osds-icon[name="pen"]'),
    })
    .all();

  const index = this.testContext.data.vsIndex || 0;
  await editButtonList[index].click();

  await sleep(1000);

  const input = await this.page.locator('input').all();
  await input[0].fill('test');
  await input[0].press('Enter');
});

When('User clicks on the link to associate a vRack', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupNetwork(this);
  await this.page.goto(this.testContext.initialUrl || getUrl('root'), {
    waitUntil: 'load',
  });

  // Wait for the datagrid to render cells
  await sleep(1000);

  const buttonList = await this.page.getByText(associateVrackButtonLabel).all();
  const button = buttonList.length > 1 ? buttonList[1] : buttonList[0];
  await button.click();
});

When(
  'User selects a vRack in the association list and submits the form',
  async function(this: ICustomWorld<ConfigParams>) {
    const associationModal = await this.page.locator('osds-modal', {
      hasText: modalVrackAssociationDescription,
    });

    await associationModal.locator('osds-select').click();
    await associationModal.getByText(vrackList[0]).click();

    await associationModal
      .getByText(modalConfirmVrackAssociationButtonLabel)
      .click();
  },
);

When('User navigates to the vRack Services Overview page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupNetwork(this);
  await this.page.goto(this.testContext.initialUrl, { waitUntil: 'load' });

  const { selectedVrackServices } = this.testContext.data;

  await this.page
    .getByText(
      selectedVrackServices.currentState.displayName ||
        selectedVrackServices.id,
    )
    .click();

  await this.page.waitForURL(
    getUrl('overview', this.testContext.data.selectedVrackServices.id),
    {
      waitUntil: 'load',
    },
  );
});

When('User navigates to the vRack Services Subnet page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupNetwork(this);
  await this.page.goto(this.testContext.initialUrl, { waitUntil: 'load' });

  const { selectedVrackServices } = this.testContext.data;

  await this.page
    .getByText(
      selectedVrackServices.currentState.displayName ||
        selectedVrackServices.id,
    )
    .click();

  await this.page.waitForURL(getUrl('overview', selectedVrackServices.id), {
    waitUntil: 'load',
  });

  await this.page.getByText(subnetsTabLabel).click();

  await this.page.waitForURL(getUrl('subnets', selectedVrackServices.id), {
    waitUntil: 'load',
  });
});

When('User click on the private network action menu button', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await setupNetwork(this);

  const { selectedVrackServices } = this.testContext.data;

  await this.page.waitForURL(getUrl('overview', selectedVrackServices.id), {
    waitUntil: 'load',
  });

  if (await this.page.getByTestId('action-menu-icon').count()) {
    await this.page.getByTestId('action-menu-icon').click();
  }
});

When(
  'User click on dissociate in action menu of private network',
  async function(this: ICustomWorld<ConfigParams>) {
    await setupNetwork(this);
    await sleep(1000);

    await this.page.getByText(vrackActionDissociate, { exact: true }).click();
  },
);

When('User {word} modal', async function(
  this: ICustomWorld<ConfigParams>,
  acceptOrCancel: 'accept' | 'cancel',
) {
  await setupNetwork(this);

  await sleep(1000);
  const labelToButton = {
    accept: modalConfirmButton,
    cancel: modalCancelButton,
  };
  const buttonLabel = labelToButton[acceptOrCancel];
  const button = await this.page.getByText(buttonLabel, { exact: true });
  await button.click();
});
