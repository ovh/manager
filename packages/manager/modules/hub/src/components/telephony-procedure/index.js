import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';

import component from './telephony-procedure.component';

const moduleName = 'ovhManagerHubTelephonyProcedure';

angular
  .module(moduleName, ['oui', 'ngAtInternet', 'ngTranslateAsyncLoader'])
  .component('ovhManagerHubTelephonyProcedure', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
