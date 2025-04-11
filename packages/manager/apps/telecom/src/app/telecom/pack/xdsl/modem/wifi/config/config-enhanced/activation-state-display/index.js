import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './activation-state-display.component';

const moduleName = 'ovhManagerTelecomPackConfigActivationState';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .component('activationStateDisplay', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
