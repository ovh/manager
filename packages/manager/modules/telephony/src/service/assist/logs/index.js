import angular from 'angular';

import logCtrl from './telecom-telephony-service-assist-logs.controller';

const moduleName = 'ovhManagerTelephonyServiceAssistLogs';

angular.module(moduleName, [])
  .controller('TelecomTelephonyServiceAssistLogsCtrl', logCtrl)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
