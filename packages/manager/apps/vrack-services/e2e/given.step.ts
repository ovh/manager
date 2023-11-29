// eslint-disable-next-line import/no-extraneous-dependencies
import { Given } from '@cucumber/cucumber';
import { ICustomWorld } from '../../../../../playwright-helpers/custom-world';
import { urls } from './constants';
import { ConfigParams } from '../mock/handlers';
import { OrderStatus, ProductStatus } from '../src/api';
import { creationServiceError } from '../src/public/translations/vrack-services/create/Messages_fr_FR.json';

Given(
  'User wants to create a vRack Services with name {string} and zone {word}',
  function(this: ICustomWorld<ConfigParams>, name: string, zone: string) {
    this.testContext.inputTexts.displayName = name;
    this.testContext.inputTexts.selectedZone = zone;
    this.testContext.initialUrl = urls.create;
    this.testContext.errorMessage = creationServiceError;
  },
);

Given('The order service for vRack Services is {word}', function(
  this: ICustomWorld<ConfigParams>,
  okOrKo: string,
) {
  this.handlersConfig.vrackServicesOrderKo = okOrKo === 'KO';
});

Given('The order service for vRack is {word}', function(
  this: ICustomWorld<ConfigParams>,
  okOrKo: string,
) {
  this.handlersConfig.vrackOrderKo = okOrKo === 'KO';
});

Given('User does not have any vRack Services', function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.nbVs = 0;
});

Given('User is on the Onboarding page', function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.nbVs = 1;
  this.testContext.initialUrl = urls.onboarding;
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
  this.handlersConfig.nbVs = productStatus === 'DRAFT' ? 1 : 5;
});

Given('The service to edit a vRack Services is KO', function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.updateKo = true;
});

Given('The service to associate a vRack Services is KO', function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.associationKo = true;
});

Given('User has no eligible vRack for this vRack Services', function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.nbEligibleVrackServices = 0;
});

Given('User has a vRack order {word}', function(
  this: ICustomWorld<ConfigParams>,
  orderStatus: OrderStatus,
) {
  this.handlersConfig.deliveringVrackOrders = orderStatus === 'delivering';
});
