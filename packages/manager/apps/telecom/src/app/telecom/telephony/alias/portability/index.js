import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import order from './order';
import portabilities from './portabilities/portabilities.module';

import controller from './portability.controller';

const moduleName = 'ovhManagerTelecomTelephonyAliasPortability';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    order,
    portabilities,
  ])
  .controller('TelecomTelephonyAliasPortabilityCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
