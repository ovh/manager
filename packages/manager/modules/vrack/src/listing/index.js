import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-core';
import { ApiV2ListHelper } from '@ovh-ux/manager-ng-apiv2-helper';

import vrackListing from './listing.component';
import route from './listing.route';
import service from '../dashboard/vrack.service';

const moduleName = 'ovhManagerVrackListing';

angular
  .module(moduleName, [
    'oui',
    'ui.router',
    'ovhManagerCore',
    ApiV2ListHelper.moduleName,
  ])
  .component('vrackListing', vrackListing)
  .service('vrackService', service)
  .config(route)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
