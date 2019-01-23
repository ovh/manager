import angular from 'angular';

import controller from './telecom-telephony-service-voicemail-management.controller';

const moduleName = 'ovhManagerTelephonyVoicemailManagement';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceVoicemailManagementCtrl', controller);

export default moduleName;
