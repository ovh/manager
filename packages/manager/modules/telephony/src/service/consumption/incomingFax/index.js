import angular from 'angular';

import controller from './telecom-telephony-service-consumption-incomingFax.controller';

const moduleName = 'ovhManagerTelephonyConsumptionIncomingFax';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceConsumptionIncomingFaxCtrl', controller);

export default moduleName;
