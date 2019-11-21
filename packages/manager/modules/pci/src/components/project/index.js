import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';
import 'ovh-api-services';

import billing from './billing';
import blackFriday from './black-friday';
import empty from './empty';
import flavorBilling from './flavor-billing';
import flavorsList from './flavors-list';
import guidesHeader from './guides-header';
import imagesList from './images-list';
import quotaRegionHeader from './quota-region-header';
import regionsList from './regions-list';
import rights from './rights';
import sshKeys from './instance/ssh-keys';

const moduleName = 'ovhManagerPciComponentsProject';

angular
  .module(moduleName, [
    billing,
    blackFriday,
    empty,
    flavorBilling,
    flavorsList,
    guidesHeader,
    imagesList,
    quotaRegionHeader,
    'ovh-api-services',
    regionsList,
    rights,
    sshKeys,
  ]);

export default moduleName;
