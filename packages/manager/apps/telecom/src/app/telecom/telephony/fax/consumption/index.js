import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import incompingFax from './incomingFax';
import outgoingFax from './outgoingFax';

import routing from './consumption.routing';

const moduleName = 'ovhManagerTelecomTelephonyFaxConsumption';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    incompingFax,
    outgoingFax,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
