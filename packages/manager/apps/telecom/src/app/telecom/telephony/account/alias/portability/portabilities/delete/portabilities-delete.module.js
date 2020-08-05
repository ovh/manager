import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './portabilities-delete.component';
import routing from './portabilities-delete.routing';

const moduleName = 'ovhManagerTelecomTelephonyPortabilitiesDelete';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('telephonyPortabilitiesDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
