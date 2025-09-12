import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';
import 'ovh-api-services';

import billing from './billing';
import billingChangeMediationBanner from './billing-change-mediation-banner';
import flavorBilling from './flavor-billing';
import flavorsList from './flavors-list';
import guidesHeader from './guides-header';
import imagesList from './images-list';
import quotaRegionHeader from './quota-region-header';
import regionList from './regions-list';
import rights from './rights';
import sshKeys from './instance/ssh-keys';
import gateways from './gateways';

const moduleName = 'ovhManagerPciComponentsProject';

angular.module(moduleName, [
  billing,
  billingChangeMediationBanner,
  flavorBilling,
  flavorsList,
  guidesHeader,
  imagesList,
  quotaRegionHeader,
  'ovh-api-services',
  regionList,
  rights,
  sshKeys,
  gateways,
]);

export default moduleName;
