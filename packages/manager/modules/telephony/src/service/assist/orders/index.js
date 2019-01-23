import angular from 'angular';

import assistOrdersCtrl from './telecom-telephony-service-assist-orders.controller';

const moduleName = 'ovhManagerTelephonyServiceAssistOrders';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceAssistOrdersCtrl', assistOrdersCtrl);

export default moduleName;
