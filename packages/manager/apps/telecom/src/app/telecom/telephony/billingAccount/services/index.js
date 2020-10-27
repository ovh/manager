import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './services.component';
import routing from './services.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountServices';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('telecomTelephonyBillingAccountServices', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
