import angular from 'angular';
import component from './telecom-telephony-alias-configuration-liveCalls.component';

const moduleName = 'ovhManagerTelephonyAliasLiveCalls';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .component('telecomTelephonyAliasLiveCalls', component);

export default moduleName;
