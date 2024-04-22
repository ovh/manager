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
  modalDissociateHeadline,
} from '../../src/public/translations/vrack-services/Messages_fr_FR.json';
import { AppRoute, getUrl } from '../utils';
import { ConfigParams } from '../../mock/handlers';
import vsMocks from '../../mock/vrack-services/get-vrack-services.json';
import {
  guide1Title,
  guide2Title,
} from '../../src/public/translations/vrack-services/onboarding/Messages_fr_FR.json';
import {
  onboardingTitle as subnetOnboardingTitle,
  createSubnetButtonLabel,
  modalDeleteHeadline as subnetModalDeleteHeadline,
} from '../../src/public/translations/vrack-services/subnets/Messages_fr_FR.json';
import { vrackActionDissociate } from '../../src/public/translations/vrack-services/dashboard/Messages_fr_FR.json';
import {
  createEndpointButtonLabel,
  onboardingTitle as endpointsOnboardingTitle,
  modalDeleteHeadline as endpointModalDeleteHeadline,
  serviceType,
  ip,
  subnet,
} from '../../src/public/translations/vrack-services/endpoints/Messages_fr_FR.json';
import { Subnet } from '@/api';

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
    await expect(modalDescriptionLine).toBeVisible();
  },
);

Then('User {string} on the Listing page', async function(
  this: ICustomWorld<ConfigParams>,
  returnsListing: 'returns' | "doesn't return",
) {
  if (returnsListing === 'returns') {
    await this.page.waitForURL(getUrl('listing'), { waitUntil: 'load' });
  } else {
    await sleep(1000);
    await expect(this.page.url()).not.toBe(getUrl('listing'));
  }
});

Then('User {string} on the {word} Listing page', async function(
  this: ICustomWorld<ConfigParams>,
  returnsListing: 'returns' | "doesn't return",
  tab: 'Subnet' | 'Endpoints',
) {
  const { selectedVrackServices } = this.testContext.data;

  if (returnsListing === 'returns') {
    await this.page.waitForURL(
      getUrl(tab === 'Subnet' ? 'subnets' : 'endpoints', {
        id: selectedVrackServices.id,
      }),
      { waitUntil: 'load' },
    );
  } else {
    await sleep(1000);
    const routes: AppRoute[] =
      tab === 'Subnet'
        ? ['subnets', 'subnetsListing', 'subnetsOnboarding']
        : ['endpoints', 'endpointsListing', 'endpointsOnboarding'];
    routes.forEach(async (route) => {
      await expect(this.page.url()).not.toBe(
        getUrl(route, { id: selectedVrackServices.id }),
      );
    });
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
  await expect(guideList).toHaveLength(guideNumber);
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
  const modalDescription = await this.page.getByText(
    modalVrackAssociationDescription,
  );
  await expect(modalDescription).toBeVisible();
});

Then('User sees a modal to create a new vRack', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const modalDescription = await this.page.getByText(
    modalVrackCreationDescriptionLine1,
  );
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

Then('User sees the {word} Onboarding page', async function(
  this: ICustomWorld<ConfigParams>,
  tabName: 'subnets' | 'endpoints',
) {
  await sleep(1000);
  const title = await this.page.getByText(
    new RegExp(
      tabName === 'subnets' ? subnetOnboardingTitle : endpointsOnboardingTitle,
    ),
  );
  await expect(title).toBeVisible();

  const createButton = await this.page.locator('osds-button', {
    hasText:
      tabName === 'subnets'
        ? createSubnetButtonLabel
        : createEndpointButtonLabel,
  });
  await expect(createButton).toBeVisible();
});

Then('User sees the subnets Listing page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const createButton = await this.page.locator('osds-button', {
    hasText: createSubnetButtonLabel,
  });
  await expect(createButton).toBeVisible();

  const subnetData = this.testContext.data.selectedVrackServices.currentState
    .subnets[0];

  const displayName = await this.page.getByText(subnetData.displayName);
  if (displayName) {
    await expect(displayName).toBeVisible();
  }

  const cidr = await this.page.locator('osds-clipboard');
  await expect(cidr).toHaveAttribute('value', subnetData.cidr);

  const serviceRange = await this.page.getByText(
    new RegExp(subnetData.serviceRange.cidr),
  );
  await expect(serviceRange).toBeVisible();

  const vlan = await this.page.getByText(subnetData.vlan);
  if (vlan) {
    await expect(vlan).toBeVisible();
  }
});

Then('User sees the endpoints Listing page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const createButton = await this.page.locator('osds-button', {
    hasText: createEndpointButtonLabel,
  });
  await expect(createButton).toBeVisible();

  const subnetData = this.testContext.data.selectedVrackServices.currentState.subnets.find(
    (s: Subnet) => s.serviceEndpoints.length > 0,
  );

  const subnetNameCount = await this.page
    .getByText(subnetData.displayName || subnetData.cidr)
    .count();
  await expect(subnetNameCount).toBeGreaterThan(0);

  const subnetTableHeader = this.page.getByRole('columnheader', {
    name: subnet,
  });
  await expect(subnetTableHeader).toBeVisible();

  const ipTableHeader = this.page.getByRole('columnheader', { name: ip });
  await expect(ipTableHeader).toBeVisible();

  const serviceTypeTableHeader = this.page.getByRole('columnheader', {
    name: serviceType,
  });
  await expect(serviceTypeTableHeader).toBeVisible();
});

Then('User {string} the action menu with button dissociate', async function(
  this: ICustomWorld<ConfigParams>,
  seeActionMenu: 'see' | "doesn't see",
) {
  await sleep(1000);
  const actionMenu = await this.page.getByTestId('action-menu-icon');
  if (seeActionMenu === 'see') {
    await expect(actionMenu).toBeVisible();
  } else {
    await expect(actionMenu).not.toBeVisible();
  }
});

Then('User sees button dissociate', async function(
  this: ICustomWorld<ConfigParams>,
) {
  await sleep(1000);
  const dissociateButton = this.page.getByText(vrackActionDissociate, {
    exact: true,
  });
  if (await this.page.getByTestId('action-menu-icon').count()) {
    await expect(dissociateButton).toBeVisible();
  } else {
    await expect(dissociateButton).not.toBeVisible();
  }
});

Then(
  'A modal appears to ask if the user wants to dissociate the vRack',
  async function(this: ICustomWorld<ConfigParams>) {
    await sleep(1000);

    const modalTitle = await this.page.getByText(modalDissociateHeadline);
    await expect(modalTitle).toBeVisible();
  },
);

Then(
  'User {string} on the Overview page from dissociation modal',
  async function(
    this: ICustomWorld<ConfigParams>,
    returnOverview: 'returns' | "doesn't returns",
  ) {
    await sleep(1000);

    const modalTitle = await this.page.getByText(modalDissociateHeadline);

    if (returnOverview === 'returns') {
      await expect(modalTitle).not.toBeVisible();
    } else {
      await expect(modalTitle).toBeVisible();
    }
  },
);
Then('User sees the create a {word} button {word}', async function(
  this: ICustomWorld<ConfigParams>,
  tab: 'subnet' | 'endpoint',
  buttonState: 'enabled' | 'disabled',
) {
  const button = await this.page.locator('osds-button', {
    hasText:
      tab === 'subnet' ? createSubnetButtonLabel : createEndpointButtonLabel,
  });
  if (buttonState === 'enabled') {
    await expect(button).not.toHaveAttribute('disabled', '');
  } else {
    await expect(button).toHaveAttribute('disabled', '');
  }
});

Then('User sees a modal to confirm {word} deletion', async function(
  this: ICustomWorld<ConfigParams>,
  tab: 'subnet' | 'endpoint',
) {
  const modalHeadLine = await this.page?.locator('osds-text', {
    hasText:
      tab === 'subnet'
        ? subnetModalDeleteHeadline
        : endpointModalDeleteHeadline,
  });
  await expect(modalHeadLine).toBeVisible();
});
