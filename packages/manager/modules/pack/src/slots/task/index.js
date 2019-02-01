import angular from 'angular';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-pagination-front';
import 'angular-translate';
import 'ovh-api-services';

import component from './component';

const moduleName = 'ovhManagerPackSlotsTask';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'ngPaginationFront',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .component('packTaskSlot', component);

export default moduleName;
