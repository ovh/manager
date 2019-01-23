import angular from 'angular';

import controller from './telecom-telephony-service-contact.controller';

const moduleName = 'ovhManagerTelephonyServiceContact';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceContactCtrl', controller);

export default moduleName;
