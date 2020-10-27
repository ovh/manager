import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import component from './params.component';

const moduleName = 'ovhManagerTelecomComponentsTelecomTelephonySchedulerParams';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('telephonySchedulerParams', component);

export default moduleName;
