import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';
import 'ovh-api-services';

import add from './add';
import billing from './billing';
import compute from './compute';
import empty from './empty';
import flavorBilling from './flavor-billing';
import flavorsList from './flavors-list';
import imagesList from './images-list';
import quotaRegionHeader from './quota-region-header';
import rights from './rights';
import sshKeys from './instance/ssh-keys';

import factory from './factory';
import service from './service';

const moduleName = 'ovhManagerPciComponentsProject';

angular
  .module(moduleName, [
    add,
    billing,
    compute,
    empty,
    flavorBilling,
    flavorsList,
    imagesList,
    quotaRegionHeader,
    'ovh-api-services',
    rights,
    sshKeys,
  ])
  .factory('CloudProjectFactory', factory)
  .service('CloudProjectOrchestrator', service);

export default moduleName;
