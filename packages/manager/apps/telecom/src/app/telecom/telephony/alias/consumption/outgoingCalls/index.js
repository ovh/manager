import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import serviceConsumptionOutgoingCalls from '../../../service/consumption/outgoingCalls';

import routing from './outgoing-calls.routing';

const moduleName = 'ovhManagerTelecomTelephonyAliasConsumptionOutgoingCalls';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    serviceConsumptionOutgoingCalls,
  ])
  .config(routing);

export default moduleName;
