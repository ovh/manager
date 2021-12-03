import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';
import 'ovh-api-services';

import billing from './billing';
import flavorBilling from './flavor-billing';
import flavorsList from './flavors-list';
import guidesHeader from './guides-header';
import imagesList from './images-list';
import quotaRegionHeader from './quota-region-header';
import regionsList from './regions-list';
import rights from './rights';
import sshKeys from './instance/ssh-keys';
import storages from './storages';

const moduleName = 'ovhManagerPciComponentsProject';

angular.module(moduleName, [
  billing,
  flavorBilling,
  flavorsList,
  guidesHeader,
  imagesList,
  quotaRegionHeader,
  'ovh-api-services',
  regionsList,
  rights,
  sshKeys,
  storages,
]);

export default moduleName;
