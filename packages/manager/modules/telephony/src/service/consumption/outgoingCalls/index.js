import angular from 'angular';

import controller from './telecom-telephony-service-consumption-outgoingCalls.controller';

const moduleName = 'ovhManagerTelephonyConsumptionOutgoingCalls';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceConsumptionOutgoingCallsCtrl', controller);

export default moduleName;
