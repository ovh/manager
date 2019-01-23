import angular from 'angular';

import controller from './telecom-telephony-service-voicemail-default.controller';

const moduleName = 'ovhManagerTelephonyVoicemailDefault';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceVoicemailDefaultCtrl', controller);

export default moduleName;
