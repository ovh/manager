import angular from 'angular';

import controller from './telecom-telephony-service-time-condition-import.controller';

const moduleName = 'ovhManagerTelephonyServiceTimeConditionImport';

angular.module(moduleName, [])
  .controller('TelecomTelephonyServiceTimeConditionImportCtrl', controller);

export default moduleName;
