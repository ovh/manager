import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './terminate.component';
import routing from './terminate.routing';

const moduleName = 'ovhManagerTelecomTelephonyAliasAdministrationTerminate';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component(
    'ovhManagerTelecomTelephonyAliasAdministrationTerminate',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
