import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '@playwright-helpers';
import { setupNetwork, getUrl } from '../utils';
import { ConfigParams } from '../../mock/handlers';

Given('User is on {word} page', function(
  this: ICustomWorld<ConfigParams>,
  pageType: 'Overview' | 'Onboarding',
) {
  this.testContext.initialUrl = getUrl(
    pageType === 'Onboarding' ? 'onboarding' : 'overview',
    {
      id: this.testContext.data?.selectedVrackServices?.id,
    },
  );
});

Given('User is on {word} Creation page', function(
  this: ICustomWorld<ConfigParams>,
  tab: 'subnets' | 'endpoints',
) {
  this.testContext.initialUrl = getUrl(
    tab === 'subnets' ? 'createSubnet' : 'createEndpoint',
    {
      id: this.testContext.data.selectedVrackServices.id,
    },
  );
});

When('User navigates to vRack Services {word} page', async function(
  this: ICustomWorld<ConfigParams>,
  pageType: 'Listing' | 'Overview',
) {
  await setupNetwork(this);
  await this.page.goto(
    getUrl(pageType === 'Listing' ? 'listing' : 'overview', {
      id: this.testContext.data?.selectedVrackServices?.id,
    }),
    { waitUntil: 'load' },
  );
});

When('User navigates to {word} page', async function(
  this: ICustomWorld<ConfigParams>,
  tabName: 'subnets' | 'endpoints',
) {
  await setupNetwork(this);
  await this.page.goto(
    getUrl(tabName, { id: this.testContext.data?.selectedVrackServices?.id }),
    {
      waitUntil: 'load',
    },
  );
});

Then('User is redirected to vRack Services {word} page', async function(
  this: ICustomWorld<ConfigParams>,
  pageType: 'Configuration' | 'Listing',
) {
  await this.page.waitForURL(
    getUrl(pageType === 'Configuration' ? 'createVrackServices' : 'listing'),
    {
      waitUntil: 'load',
    },
  );
});
