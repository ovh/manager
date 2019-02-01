import angular from 'angular';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-q-allsettled';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import activation from './activation';
import component from './component';

const moduleName = 'ovhManagerPackSlotsHubic';

angular
  .module(moduleName, [
    activation,
    'ngOvhTelecomUniverseComponents',
    'ngQAllSettled',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('packHubicSlot', component);

export default moduleName;
