import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './credits.component';

const moduleName = 'ovhManagerPciProjectsNewPaymentCredits';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectNewPaymentCredits', component);

export default moduleName;
