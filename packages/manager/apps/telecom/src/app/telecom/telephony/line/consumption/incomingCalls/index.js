import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import serviceConsumptionIncomingCalls from '../../../service/consumption/incomingCalls';

import routing from './incoming-calls.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineConsumptionIncomingCalls';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    serviceConsumptionIncomingCalls,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
