import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import incomingFax from './incomingFax';
import incomingCalls from './incomingCalls';
import outgoingCalls from './outgoingCalls';
import outgoingFax from './outgoingFax';

import routing from './consumption.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineConsumption';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    incomingFax,
    incomingCalls,
    outgoingCalls,
    outgoingFax,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
