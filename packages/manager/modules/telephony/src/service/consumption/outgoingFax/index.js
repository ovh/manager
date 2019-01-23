import angular from 'angular';

import controller from './telecom-telephony-service-consumption-outgoingFax.controller';

const moduleName = 'ovhManagerTelephonyConsumptionOutgoingFax';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceConsumptionOutgoingFaxCtrl', controller);

export default moduleName;
