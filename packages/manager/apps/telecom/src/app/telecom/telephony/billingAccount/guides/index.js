import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './guides.component';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountGuides';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('telecomTelephonyBillingAccountGuides', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
