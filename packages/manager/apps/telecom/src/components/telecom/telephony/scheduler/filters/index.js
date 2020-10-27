import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import timeConditionComponent from '../../timeCondition';

import component from './filters.component';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonySchedulerFilters';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    timeConditionComponent,
  ])
  .component('telephonySchedulerFilters', component);

export default moduleName;
