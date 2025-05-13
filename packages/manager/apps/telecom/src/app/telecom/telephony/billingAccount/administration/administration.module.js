import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import portabilities from './portabilities/portabilities.module';

import routing from './administration.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountAdministration';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    portabilities,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations ./../billing/translations */);

export default moduleName;
