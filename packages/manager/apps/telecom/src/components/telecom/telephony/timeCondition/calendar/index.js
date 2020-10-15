import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import condition from '../condition';

import directive from './calendar.directive';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyTimeConditionCalendar';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    condition,
  ])
  .directive('voipTimeConditionCalendar', directive);

export default moduleName;
