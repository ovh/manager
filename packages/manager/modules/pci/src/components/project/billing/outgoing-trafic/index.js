import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingOutgoingTrafic';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('outgoingTrafic', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
