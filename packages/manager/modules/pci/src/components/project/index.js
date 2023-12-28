import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';
import 'ovh-api-services';

import billing from './billing';
import billingChangeMediationBanner from './billing-change-mediation-banner';
import flavorBilling from './flavor-billing';
import flavorsList from './flavors-list';
import imagesList from './images-list';
import quotaRegionHeader from './quota-region-header';
import regionsList from './regions-list';
import rights from './rights';
import sshKeys from './instance/ssh-keys';
import storages from './storages';
import repricingBanner from './repricing-banner';
import gateways from './gateways';

const moduleName = 'ovhManagerPciComponentsProject';

angular.module(moduleName, [
  billing,
  billingChangeMediationBanner,
  flavorBilling,
  flavorsList,
  imagesList,
  quotaRegionHeader,
  'ovh-api-services',
  regionsList,
  rights,
  sshKeys,
  storages,
  repricingBanner,
  gateways,
]);

export default moduleName;
