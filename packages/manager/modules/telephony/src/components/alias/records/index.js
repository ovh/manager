import angular from 'angular';

import component from './telecom-telephony-alias-records.component';

const moduleName = 'ovhManagerTelephonyAliasRecords';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .component('telecomTelephonyAliasRecords', component);

export default moduleName;
