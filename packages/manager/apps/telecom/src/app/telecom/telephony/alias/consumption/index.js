import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import incomingCalls from './incomingCalls';
import outgoingCalls from './outgoingCalls';

const moduleName = 'ovhManagerTelecomTelephonyAliasConsumption';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    incomingCalls,
    outgoingCalls,
  ])
  .run(/* @ngTranslationsInject:json ./translations ./../../service/consumption/translations */);

export default moduleName;
