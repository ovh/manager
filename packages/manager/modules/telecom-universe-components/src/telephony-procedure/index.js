import angular from 'angular';
import 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import component from './telephony-procedure.component';

const moduleName = 'tucTelephonyProcedure';

angular
  .module(moduleName, ['oui', 'ngTranslateAsyncLoader', uiRouter])
  .component('tucTelephonyProcedure', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
