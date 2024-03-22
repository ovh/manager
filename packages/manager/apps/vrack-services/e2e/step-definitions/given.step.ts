import { Given } from '@cucumber/cucumber';
import { OrderStatus } from '@ovh-ux/manager-module-order';
import { ICustomWorld } from '@playwright-helpers';
import { getUrl } from '../utils';
import { ConfigParams } from '../../mock/handlers';
import { ProductStatus, ResourceStatus } from '@/api';
import { creationServiceError } from '../../src/public/translations/vrack-services/create/Messages_fr_FR.json';
import { updateError } from '../../src/public/translations/vrack-services/listing/Messages_fr_FR.json';
import vrackServicesList from '../../mock/vrack-services/get-vrack-services.json';

Given('User has {word} vRack Services', function(
  this: ICustomWorld<ConfigParams>,
  nbVsStr: string,
) {
  this.handlersConfig.nbVs = Number(nbVsStr);
});

Given(
  'User wants to create a vRack Services with name {string} and region {word}',
  function(this: ICustomWorld<ConfigParams>, name: string, region: string) {
    this.handlersConfig.nbVs = 5;
    this.testContext.data.displayName = name;
    this.testContext.data.selectedRegion = region;
    this.testContext.initialUrl = getUrl('createVrackServices');
    this.testContext.errorMessage = creationServiceError.replace(
      '{{error}}',
      '.*',
    );
  },
);

Given('User does not have any vRack Services', function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.nbVs = 0;
});

Given('User is on the Onboarding page', function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.nbVs = 1;
  this.testContext.initialUrl = getUrl('onboarding');
});

Given('User has a vRack Services order delivering', function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.deliveringVrackServicesOrders = true;
});

Given('User has a vRack Services in {word} state', function(
  this: ICustomWorld<ConfigParams>,
  productStatus: ProductStatus,
) {
  this.handlersConfig.nbVs = 19;
  this.testContext.data.vsIndex = vrackServicesList.findIndex(
    (v) => v.currentState.productStatus === productStatus,
  );
});

Given('User has a vRack Services with a status {word}', function(
  this: ICustomWorld<ConfigParams>,
  resourceStatus: ResourceStatus,
) {
  this.handlersConfig.nbVs = 19;
  const vsIndex = vrackServicesList.findIndex(
    (v) => v.resourceStatus === resourceStatus,
  );

  this.testContext.data.vsIndex = vsIndex;
  this.testContext.data.selectedVrackServices = vrackServicesList[vsIndex];
});

Given('The service to edit a vRack Services is KO', function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.updateKo = true;
  this.testContext.errorMessage = updateError;
});

Given('The service to associate a vRack Services is KO', function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.associationKo = true;
  this.testContext.errorMessage = updateError;
});

Given(
  'User has {word} eligible vRacks to be associated to his vRack Services',
  function(this: ICustomWorld<ConfigParams>, anyEligibleVrack: 'an' | 'no') {
    this.handlersConfig.nbEligibleVrackServices =
      anyEligibleVrack === 'an' ? 5 : 0;
  },
);

Given('User has a vRack order {word}', function(
  this: ICustomWorld<ConfigParams>,
  orderStatus: OrderStatus,
) {
  this.handlersConfig.deliveringVrackOrders = orderStatus === 'delivering';
});

Given('User selects his vRack Services in the Listing page', function(
  this: ICustomWorld<ConfigParams>,
) {
  this.testContext.initialUrl = getUrl('listing');
});

Given('User has a vRack Services that {string} a subnet', function(
  this: ICustomWorld<ConfigParams>,
  hasSubnet: 'has' | "doesn't have",
) {
  this.testContext.initialUrl = getUrl('listing');
  this.handlersConfig.nbVs = 19;
  const index = vrackServicesList.findIndex((v) =>
    hasSubnet === 'has'
      ? v.currentState.subnets.length > 0
      : v.currentState.subnets.length === 0,
  );
  this.testContext.data.selectedVrackServices = vrackServicesList[index];
  this.testContext.data.vsIndex = index;
});

Given('User {string} a vRack associated to a vRack Services', function(
  this: ICustomWorld<ConfigParams>,
  hasVrack: 'has' | "doesn't have",
) {
  this.testContext.initialUrl = getUrl('listing');
  this.handlersConfig.nbVs = 20;

  const vsIndex = vrackServicesList.findIndex(
    (v) =>
      (hasVrack === 'has' && v.currentState.vrackId) ||
      (hasVrack === "doesn't have" && !v.currentState.vrackId),
  );
  this.testContext.data.vsIndex = vsIndex;
  this.testContext.data.selectedVrackServices = vrackServicesList[vsIndex];
});
