import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import serviceConsumptionIncomingCalls from '../../../service/consumption/incomingCalls';

import routing from './incoming-calls.routing';

const moduleName = 'ovhManagerTelecomTelephonyAliasConsumptionIncomingCalls';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    serviceConsumptionIncomingCalls,
  ])
  .config(routing);

export default moduleName;
