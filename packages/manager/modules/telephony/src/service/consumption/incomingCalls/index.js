import angular from 'angular';

import controller from './telecom-telephony-service-consumption-incomingCalls.controller';

const moduleName = 'ovhManagerTelephonyConsumptionIncomingCalls';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceConsumptionIncomingCallsCtrl', controller);

export default moduleName;
