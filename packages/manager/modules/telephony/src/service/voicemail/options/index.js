import angular from 'angular';

import controller from './telecom-telephony-service-voicemail-options.controller';

const moduleName = 'ovhManagerTelephonyVoicemailOptions';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceVoicemailOptionsCtrl', controller);

export default moduleName;
