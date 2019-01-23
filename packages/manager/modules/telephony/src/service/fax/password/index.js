import angular from 'angular';

import controller from './telecom-telephony-service-fax-password.controller';

const moduleName = 'ovhManagerTelephonyServiceFaxPassword';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceFaxPasswordCtrl', controller);

export default moduleName;
