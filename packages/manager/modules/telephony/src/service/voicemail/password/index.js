import angular from 'angular';

import controller from './telecom-telephony-service-voicemail-password.controller';

const moduleName = 'ovhManagerTelephonyVoicemailPassword';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceVoicemailPasswordCtrl', controller);

export default moduleName;
