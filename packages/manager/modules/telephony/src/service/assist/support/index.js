import angular from 'angular';

import supportCtrl from './telecom-telephony-service-assist-support.controller';

const moduleName = 'ovhManagerTelephonyServiceAssistSupport';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceAssistSupportCtrl', supportCtrl);

export default moduleName;
