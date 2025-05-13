import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import service from './time-condition-configuration.service';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyServiceTimeConditionConfiguration';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .service('voipTimeConditionConfiguration', service);

export default moduleName;
