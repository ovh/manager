import angular from 'angular';
import 'angular-translate';

import component from './telephony-procedure.component';

const moduleName = 'tucTelephonyProcedure';

angular
  .module(moduleName, ['oui', 'ngTranslateAsyncLoader'])
  .component('tucTelephonyProcedure', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
