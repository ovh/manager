import angular from 'angular';

import controller from './telecom-telephony-service-fax-convertToVoicefax.controller';

const moduleName = 'ovhManagerTelephonyServiceFaxConvertToVoiceFax';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceFaxConvertToVoicefaxCtrl', controller);

export default moduleName;
