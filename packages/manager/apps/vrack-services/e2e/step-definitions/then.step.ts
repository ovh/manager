import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '@playwright-helpers';
import { modalDescriptionLine1 } from '../../src/public/translations/vrack-services/create/Messages_fr_FR.json';
import {
  AppRoute,
  getActionMenu,
  getDashboardEditButton,
  getUrl,
  labels,
} from '../utils';
import { ConfigParams } from '../../mock/handlers';
import { Subnet } from '@/api';

Then('User sees the create a vRack Services button {word}', async function(
  this: ICustomWorld<ConfigParams>,
  buttonState: 'enabled' | 'disabled',
) {
  const button = await this.page.locator('osds-button', {
    hasText: labels.createVrackServicesButtonLabel,
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
    await expect(this.page).toHaveURL(getUrl('listing'));
  } else {
    await expect(this.page).not.toHaveURL(getUrl('listing'));
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

Then('User sees {word} success message', async function(
  this: ICustomWorld<ConfigParams>,
  anySuccessMessage: 'an' | 'no',
) {
  const message = await this.page.locator('osds-message', {
    hasText: new RegExp(
      this.testContext.message?.replace(/{{[a-zA-Z]+}}/gm, '.*'),
    ),
  });
  if (anySuccessMessage === 'an') {
    await expect(message).toBeVisible({ timeout: 300000 });
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
    [labels.guide1Title, labels.guide2Title].map((guideTitle) =>
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
        labels.deliveringVrackServicesMessage.replace(/{{date}}.*/, '.*'),
      ),
    });
    await expect(message).toBeVisible();
  },
);
Then('User sees an empty listing page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const message = await this.page.getByText(
    labels.vrackServicesEmptyDataGridMessage,
  );
  await expect(message).toBeVisible();
});

Then(
  'User sees a data grid containing his vRack Services information',
  async function(this: ICustomWorld<ConfigParams>) {
    const { selectedVrackServices } = this.testContext.data;
    const displayName =
      selectedVrackServices.iam?.displayName || selectedVrackServices.id;
    const vsDisplayName = await this.page.getByText(displayName, {
      exact: true,
    });
    await expect(vsDisplayName).toBeVisible();
  },
);

Then('User sees a modal to select an eligible vRack', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const modalDescription = await this.page.getByText(
    labels.modalVrackAssociationDescription,
  );
  await expect(modalDescription).toBeVisible();
});

Then('User sees a modal to create a new vRack', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const modalDescription = await this.page.getByText(
    labels.modalVrackCreationDescriptionLine1,
  );
  await expect(modalDescription).toBeVisible();
});

Then(
  'User sees {word} information message about the order status of his vRack',
  async function(this: ICustomWorld<ConfigParams>, anyMessage: 'an' | 'no') {
    const message = await this.page
      .getByText(
        new RegExp(labels.deliveringVrackMessage.replace(/{{date}}.*/, '.*')),
      )
      .nth(0);

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
    hasText: labels.modalCreateNewVrackButtonLabel,
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
    const menuIndex = this.testContext.data.vsIndex || 0;

    const actionMenu = await getActionMenu({
      ctx: this,
      menuIndex,
    });

    await actionMenu.click();

    const associateButton = await this.page
      .locator('osds-button', {
        hasText: labels.associateVrackButtonLabel,
      })
      .nth(menuIndex);

    const editButton = await this.page
      .locator('osds-button', {
        hasText: labels['action-editDisplayName'],
      })
      .nth(menuIndex);

    if (buttonState === 'disabled') {
      await expect(associateButton).toHaveAttribute('disabled', '');
      await expect(editButton).toHaveAttribute('disabled', '');
    } else {
      await expect(associateButton).not.toHaveAttribute('disabled');
      await expect(editButton).not.toHaveAttribute('disabled');
    }
  },
);

Then('User sees the action buttons on the overview as {word}', async function(
  this: ICustomWorld<ConfigParams>,
  buttonState: 'disabled' | 'enabled',
) {
  const actionMenu = await getActionMenu({ ctx: this });
  const editButton = await getDashboardEditButton({ ctx: this });

  if (buttonState === 'disabled') {
    await expect(actionMenu).toHaveAttribute('disabled', '');
    await expect(editButton).toHaveAttribute('disabled', '');
  } else {
    await expect(actionMenu).not.toHaveAttribute('disabled');
    await expect(editButton).not.toHaveAttribute('disabled');
  }
});

Then('User sees the {word} Onboarding page', async function(
  this: ICustomWorld<ConfigParams>,
  tabName: 'subnets' | 'endpoints',
) {
  const title = await this.page.getByText(
    new RegExp(
      tabName === 'subnets'
        ? labels.subnetsOnboardingTitle
        : labels.endpointsOnboardingTitle,
    ),
  );
  await expect(title).toBeVisible();

  const createButton = await this.page.locator('osds-button', {
    hasText:
      tabName === 'subnets'
        ? labels.createSubnetButtonLabel
        : labels.createEndpointButtonLabel,
  });
  await expect(createButton).toBeVisible();
});

Then('User sees the subnets Listing page', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const createButton = await this.page.locator('osds-button', {
    hasText: labels.createSubnetButtonLabel,
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
    hasText: labels.createEndpointButtonLabel,
  });
  await expect(createButton).toBeVisible();

  const subnetData = this.testContext.data.selectedVrackServices.currentState.subnets.find(
    (s: Subnet) => s.serviceEndpoints.length > 0,
  );

  const subnetNameCount = await this.page
    .getByText(subnetData.displayName || subnetData.cidr)
    .count();
  await expect(subnetNameCount).toBeGreaterThan(0);

  const subnetTableHeader = this.page
    .getByTestId('header-subnet')
    .getByText(labels.endpointDatagridSubnetLabel);
  await expect(subnetTableHeader).toBeVisible();

  const ipTableHeader = this.page
    .getByTestId('header-ip')
    .getByText(labels.endpointDatagridIpLabel);
  await expect(ipTableHeader).toBeVisible();

  const serviceTypeTableHeader = this.page
    .getByTestId('header-serviceType')
    .getByText(labels.endpointDatagridServiceTypeLabel);
  await expect(serviceTypeTableHeader).toBeVisible();
});

Then('User {string} the action menu with button dissociate', async function(
  this: ICustomWorld<ConfigParams>,
  seeActionMenu: 'see' | "doesn't see",
) {
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
  const dissociateButton = this.page.getByText(labels.vrackActionDissociate, {
    exact: true,
  });
  if (await this.page.getByTestId('action-menu-icon').count()) {
    await expect(dissociateButton).toBeVisible();
  } else {
    await expect(dissociateButton).not.toBeVisible();
  }
});

Then('User sees button associate another', async function(
  this: ICustomWorld<ConfigParams>,
) {
  const associateToAnotherButton = this.page.getByText(
    labels.vrackActionAssociateToAnother,
    {
      exact: true,
    },
  );
  if (await this.page.getByTestId('action-menu-icon').count()) {
    await expect(associateToAnotherButton).toBeVisible();
  } else {
    await expect(associateToAnotherButton).not.toBeVisible();
  }
});

Then(
  'A modal appears to ask if the user wants to dissociate the vRack',
  async function(this: ICustomWorld<ConfigParams>) {
    const modalTitle = await this.page.getByText(
      labels.modalDissociateHeadline,
    );
    await expect(modalTitle).toBeVisible();
  },
);

Then(
  'A modal appears to associate the vRack Services to another vRack',
  async function(this: ICustomWorld<ConfigParams>) {
    const modalTitle = await this.page.getByText(
      labels.modalAssociateAnotherVrackTitle,
    );
    await expect(modalTitle).toBeVisible();
  },
);

Then(
  'User {string} on the Overview page from dissociation modal',
  async function(
    this: ICustomWorld<ConfigParams>,
    returnOverview: 'returns' | "doesn't returns",
  ) {
    const modalTitle = await this.page.getByText(
      labels.modalDissociateHeadline,
    );

    if (returnOverview === 'returns') {
      await expect(modalTitle).not.toBeVisible();
    } else {
      await expect(modalTitle).toBeVisible();
    }
  },
);

Then(
  'User {string} on the Overview page from associate another modal',
  async function(
    this: ICustomWorld<ConfigParams>,
    returnOverview: 'returns' | "doesn't returns",
  ) {
    const modalTitle = await this.page.getByText(
      labels.modalAssociateAnotherVrackTitle,
    );

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
      tab === 'subnet'
        ? labels.createSubnetButtonLabel
        : labels.createEndpointButtonLabel,
  });
  if (buttonState === 'enabled') {
    await expect(button).not.toHaveAttribute('disabled');
  } else {
    await expect(button).toHaveAttribute('disabled');
  }
});
