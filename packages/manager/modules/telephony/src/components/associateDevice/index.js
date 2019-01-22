import angular from 'angular';

import component from './telecom-telephony-associate-device.component';

const moduleName = 'ovhManagerTelephonyAliasAssociateDevice';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .component('telecomTelephonyAssociateDevice', component);

export default moduleName;
